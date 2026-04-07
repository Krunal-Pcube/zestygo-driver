import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage/asyncStorageKeys';


export async function getDeviceInfo() {
  try { 
    const brand = DeviceInfo.getBrand();
    const model = DeviceInfo.getModel();
    const isTablet = DeviceInfo.isTablet();

    const fcm_token = await AsyncStorage.getItem(STORAGE_KEYS.FCM_TOKEN); // ✅ READ

    return {
      device_name: `${brand} ${model}`, 
      device_type: isTablet ? 'tablet' : 'mobile',
      os_type: Platform.OS,
      fcm_token: fcm_token || null,
    };
  } catch (error) {
    console.log('❌ DEVICE INFO ERROR:', error);
    return {
      device_name: 'Unknown Device',
      device_type: 'mobile',
      os_type: Platform.OS,
      fcm_token: null,
    };
  } 
}
