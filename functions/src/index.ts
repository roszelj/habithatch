import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

initializeApp();

/**
 * Cloud Function: triggered when a PendingNotification document is created
 * in families/{familyId}/notifications/{notifId}.
 *
 * Reads the target kid's FCM tokens from their profile, sends a push notification
 * via FCM, removes any stale tokens, then deletes the notification document.
 */
export const sendKidNotification = onDocumentCreated(
  'families/{familyId}/notifications/{notifId}',
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data() as {
      targetProfileId: string;
      title: string;
      body: string;
      senderToken?: string;
    };

    const { targetProfileId, title, body, senderToken } = data;
    const { familyId } = event.params;

    const db = getFirestore();

    // Idempotency guard: if this document was already processed and deleted by a
    // previous invocation (Cloud Functions deliver at-least-once), skip silently.
    const freshSnap = await snap.ref.get();
    if (!freshSnap.exists()) return;

    const profileRef = db.doc(`families/${familyId}/profiles/${targetProfileId}`);
    const profileSnap = await profileRef.get();
    const allTokens: string[] = profileSnap.data()?.fcmTokens ?? [];
    // Exclude the initiating device's token so the parent doesn't receive
    // their own notification when granting a bonus or reward.
    const fcmTokens = senderToken ? allTokens.filter(t => t !== senderToken) : allTokens;

    if (fcmTokens.length > 0) {
      try {
        const response = await getMessaging().sendEachForMulticast({
          tokens: fcmTokens,
          notification: { title, body },
          webpush: {
            notification: {
              icon: '/creature-charactors/sloth.png',
            },
          },
        });

        // Remove tokens that FCM reports as invalid (e.g., user cleared site data)
        const staleTokens = fcmTokens.filter((_, i) => !response.responses[i].success);
        if (staleTokens.length > 0) {
          await profileRef.update({
            fcmTokens: FieldValue.arrayRemove(...staleTokens),
          });
        }
      } catch (err) {
        console.error('FCM send failed:', err);
        // Per FR-009: swallow the error; the core action already succeeded
      }
    }

    // Clean up the outbox document regardless of outcome
    await snap.ref.delete();
  },
);
