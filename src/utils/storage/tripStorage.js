import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './asyncStorageKeys';

const TRIP_KEY = STORAGE_KEYS.ACTIVE_TRIP_ID; // 'active_trip_id'

// Save only trip ID, step, and current stop index (minimal data)
export const saveActiveTripId = async (deliveryTripId, currentStep, currentStopIndex = 0) => {
  const trip = {
    deliveryTripId,
    step: currentStep,
    currentStopIndex, // Track which stop (by sequence) driver is at
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(TRIP_KEY, JSON.stringify(trip));
};

// Get stored trip ID and step
export const getActiveTripId = async () => {
  const data = await AsyncStorage.getItem(TRIP_KEY);
  return data ? JSON.parse(data) : null;
};

// Clear trip ID
export const clearActiveTripId = async () => {
  await AsyncStorage.removeItem(TRIP_KEY);
};