import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

/**
 * GPS PERMISSION HELPER
 * @react-native-community/geolocation does NOT have a built-in
 * requestAuthorization() — we handle Android manually and rely on
 * the Info.plist key for iOS (no runtime call needed on iOS).
 */
export async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    // iOS: permission is triggered automatically by the first
    // getCurrentPosition / watchPosition call as long as
    // NSLocationWhenInUseUsageDescription is in Info.plist.
    return true;
  }

  // Android: request explicitly
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs your location to show your position on the map.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('[GPS] Permission request error:', err);
    return false;
  }
}

/**
 * GPS ENABLED CHECK & PROMPT (Android only)
 * Uses react-native-android-location-enabler to prompt user to
 * enable GPS when it's turned off.
 */
export async function checkAndPromptGPSEnabled() {
  if (Platform.OS !== 'android') return true;

  try {
    await promptForEnableLocationIfNeeded();
    return true;
  } catch (error) {
    console.warn('[GPS] User denied enabling GPS:', error);
    return false;
  }
}
