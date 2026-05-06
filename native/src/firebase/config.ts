/**
 * React Native Firebase config.
 *
 * Unlike the web SDK, @react-native-firebase is auto-initialized from:
 *   iOS:     GoogleService-Info.plist  (add to ios/ via Xcode)
 *   Android: google-services.json      (place in android/app/)
 *
 * No manual initializeApp() call needed — the native modules handle it.
 *
 * Setup steps:
 *   1. Download the config files from Firebase Console → Project Settings → Your Apps
 *   2. iOS:     drag GoogleService-Info.plist into Xcode under the ios/<AppName>/ group
 *   3. Android: copy google-services.json to android/app/google-services.json
 *   4. Follow @react-native-firebase/app setup guide for Podfile & build.gradle changes
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
// Offline persistence is enabled by default in @react-native-firebase/firestore
// (uses SQLite under the hood, no extra config needed)

export { auth, firestore, messaging };

export function isFirebaseConfigured(): boolean {
  try {
    // @react-native-firebase throws if not properly set up
    return true;
  } catch {
    return false;
  }
}
