import { getToken, onMessage } from 'firebase/messaging';
import { doc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { arrayUnion } from 'firebase/firestore';
import { messaging } from './config';
import { db } from './config';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;
const FCM_DENIED_KEY = 'fcm_permission_denied';

/**
 * Request push notification permission and store the FCM token on the kid's profile.
 * Called once when the kid enters cloud/play mode. Safe to call multiple times —
 * skips if permission was previously denied or if the browser doesn't support push.
 */
export async function registerFcmToken(familyId: string, profileId: string): Promise<void> {
  if (localStorage.getItem(FCM_DENIED_KEY)) return;
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
  if (!VAPID_KEY || VAPID_KEY === 'REPLACE_WITH_YOUR_VAPID_KEY') return;

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') {
    localStorage.setItem(FCM_DENIED_KEY, '1');
    return;
  }

  try {
    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg });
    if (token) {
      await updateDoc(doc(db, 'families', familyId, 'profiles', profileId), {
        fcmTokens: arrayUnion(token),
      });
    }
  } catch {
    // Browser doesn't support push or service worker failed — fail silently
  }
}

/**
 * Show a native OS notification banner via the service worker.
 * No-ops if permission is not granted or service worker is unavailable.
 */
export async function showLocalNotification(title: string, body: string): Promise<void> {
  if (Notification.permission !== 'granted' || !('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification(title, { body, icon: '/creature-charactors/sloth.png' });
  } catch {
    // Service worker not ready — fail silently
  }
}

/**
 * Subscribe to FCM messages when the app is in the foreground and show them
 * as native OS notification banners via the service worker.
 * Returns an unsubscribe function to clean up when the component unmounts.
 */
export function subscribeFcmForeground(): () => void {
  return onMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? 'HabitHatch';
    const body = payload.notification?.body ?? '';
    showLocalNotification(title, body);
  });
}

/**
 * Get the current browser's FCM token without prompting for permission.
 * Returns null if permission is not already granted, VAPID key is missing,
 * or the service worker is unavailable. Used to identify the sender's device
 * so the Cloud Function can exclude it from notification delivery.
 */
export async function getSenderToken(): Promise<string | null> {
  if (!VAPID_KEY || VAPID_KEY === 'REPLACE_WITH_YOUR_VAPID_KEY') return null;
  if (!('Notification' in window) || Notification.permission !== 'granted') return null;
  if (!('serviceWorker' in navigator)) return null;
  try {
    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
    return await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg });
  } catch {
    return null;
  }
}

/**
 * Write a pending notification document to Firestore.
 * The Cloud Function (`sendKidNotification`) triggers on this document
 * and delivers the push notification to the kid's device(s).
 * Pass senderToken to suppress delivery to the initiating device.
 * Fire-and-forget — callers should not await this.
 */
export async function writePendingNotification(
  familyId: string,
  targetProfileId: string,
  title: string,
  body: string,
  senderToken?: string | null,
): Promise<void> {
  await addDoc(collection(db, 'families', familyId, 'notifications'), {
    targetProfileId,
    title,
    body,
    createdAt: serverTimestamp(),
    ...(senderToken ? { senderToken } : {}),
  });
}
