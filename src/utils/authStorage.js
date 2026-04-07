import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storage/asyncStorageKeys';

const AUTH_KEY = STORAGE_KEYS.AUTH_DATA;

export const saveAuthData = async data => {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(data));
};

export const getAuthData = async () => {
  const data = await AsyncStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearAuthData = async () => {
  await AsyncStorage.removeItem(AUTH_KEY);
};
  