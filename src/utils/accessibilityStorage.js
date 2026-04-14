import AsyncStorage from '@react-native-async-storage/async-storage';

const VIBRATION_KEY = '@accessibility_vibration_for_request';
const SCREEN_FLASH_KEY = '@accessibility_screen_flash_for_request';

export const getVibrationSetting = async () => {
  try {
    const value = await AsyncStorage.getItem(VIBRATION_KEY);
    return value !== null ? JSON.parse(value) : true; // default: true
  } catch {
    return true;
  }
};

export const setVibrationSetting = async (value) => {
  try {
    await AsyncStorage.setItem(VIBRATION_KEY, JSON.stringify(value));
  } catch {
    // silently fail
  }
};

export const getScreenFlashSetting = async () => {
  try {
    const value = await AsyncStorage.getItem(SCREEN_FLASH_KEY);
    return value !== null ? JSON.parse(value) : false; // default: false
  } catch {
    return false;
  }
};

export const setScreenFlashSetting = async (value) => {
  try {
    await AsyncStorage.setItem(SCREEN_FLASH_KEY, JSON.stringify(value));
  } catch {
    // silently fail
  }
};
