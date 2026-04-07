import { PermissionsAndroid, Platform } from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';

import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  requestPermission,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage/asyncStorageKeys';


import { getApp } from '@react-native-firebase/app';

// 🔹 Firebase App & Messaging instance
const app = getApp(); 
const messaging = getMessaging(app);

/**
 * 🔔 Request notification permission 
 */
export async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, 
    );
  }

  await requestPermission(messaging);
}

/**
 * 🔑 Get FCM token
 */

export async function getFCMToken() {
  try {
    const token = await getToken(messaging);
    console.log('🔥 FCM TOKEN:', token);

    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token); // ✅ STORE
    }

    return token;
  } catch (error) {
    console.log('❌ FCM TOKEN ERROR:', error);
    return null;
  }
}

/**
 * 📢 Display notification using Notifee
 */
 
async function displayNotification(remoteMessage) {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel', 
    importance: AndroidImportance.HIGH,
  });
 
  await notifee.displayNotification({
    title: remoteMessage.data?.title || 'Zesty Go',
    body: remoteMessage.data?.body || '',
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
      style: {
        type: AndroidStyle.BIGTEXT,
        text: remoteMessage.data?.body,
      },
    },
    data: remoteMessage.data,
  });
}




/**
 * 🔵 Foreground notifications
 */
export function foregroundListener() {
  return onMessage(messaging, async remoteMessage => {
    console.log('📩 Foreground:', remoteMessage);
    await displayNotification(remoteMessage);
  });
}

/**
 * 🟡 Background & Quit state handler
 * ⚠️ MUST be registered ONCE (index.js)
 */
export function registerBackgroundHandler() {
  setBackgroundMessageHandler(messaging, async remoteMessage => {
    console.log('📩 Background/Quit:', remoteMessage);
    await displayNotification(remoteMessage);
  });
}

/**
 * 🚀 When app opened from quit state
 */
export async function checkInitialNotification() {
  const remoteMessage = await getInitialNotification(messaging);
  if (remoteMessage) {
    console.log('🚀 Opened from quit:', remoteMessage);
  }
}

/**
 * 👉 When app opened from background
 */
export function notificationOpenedListener() {
  return onNotificationOpenedApp(messaging, remoteMessage => {
    console.log('➡️ Opened from background:', remoteMessage);
  });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









