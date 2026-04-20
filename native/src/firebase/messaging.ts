/**
 * Push notifications — React Native version
 *
 * Replaces:
 *   - Web Notification API → @react-native-firebase/messaging
 *   - navigator.serviceWorker → background message handler in index.js
 *   - VAPID key → not needed (FCM handles iOS APNs tokens natively)
 *
 * Native setup required:
 *   iOS:     add Push Notifications capability in Xcode, configure APNs in Firebase Console
 *   Android: no extra config beyond google-services.json
 */

import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_DENIED_KEY = 'fcm_permission_denied';

/**
 * Request push notification permission and store the FCM token on the kid's profile.
 * Safe to call multiple times — skips if previously denied.
 */
export async function registerFcmToken(familyId: string, profileId: string): Promise<void> {
  const denied = await AsyncStorage.getItem(FCM_DENIED_KEY);
  if (denied) return;

  const status = await messaging().requestPermission();
  const granted =
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL;

  if (!granted) {
    await AsyncStorage.setItem(FCM_DENIED_KEY, '1');
    return;
  }

  try {
    const token = await messaging().getToken();
    if (token) {
      await firestore()
        .collection('families')
        .doc(familyId)
        .collection('profiles')
        .doc(profileId)
        .update({
          fcmTokens: firestore.FieldValue.arrayUnion(token),
        });
    }
  } catch {
    // Native push unavailable — fail silently
  }
}

/**
 * Subscribe to FCM messages when the app is in the foreground.
 * On React Native, foreground messages don't show OS banners automatically —
 * you can display an in-app alert or use notifee for a native heads-up.
 * Returns an unsubscribe function.
 */
export function subscribeFcmForeground(
  onNotification: (title: string, body: string) => void,
): () => void {
  return messaging().onMessage(async remoteMessage => {
    const title = remoteMessage.notification?.title ?? 'HabitHatch';
    const body = remoteMessage.notification?.body ?? '';
    onNotification(title, body);
  });
}

/**
 * Get this device's current FCM token without prompting.
 * Returns null if permission is not already granted.
 * Used to identify the sender so the Cloud Function can exclude it.
 */
export async function getSenderToken(): Promise<string | null> {
  try {
    const status = await messaging().hasPermission();
    const granted =
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL;
    if (!granted) return null;
    return await messaging().getToken();
  } catch {
    return null;
  }
}

/**
 * Write a pending notification document to Firestore.
 * The Cloud Function triggers on this and delivers the push to the kid's device(s).
 */
export async function writePendingNotification(
  familyId: string,
  targetProfileId: string,
  title: string,
  body: string,
  senderToken?: string | null,
): Promise<void> {
  await firestore()
    .collection('families')
    .doc(familyId)
    .collection('notifications')
    .add({
      targetProfileId,
      title,
      body,
      createdAt: firestore.FieldValue.serverTimestamp(),
      ...(senderToken ? { senderToken } : {}),
    });
}
