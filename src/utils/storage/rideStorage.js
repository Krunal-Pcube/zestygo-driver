import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './asyncStorageKeys';

const RIDES_KEY = STORAGE_KEYS.ACTIVE_RIDES;

// ═══════════════════════════════════════════════════════════════
// SINGLE ORDER (Today) - Array with 1 item
// MULTI ORDER (Future) - Array with N items
// ═══════════════════════════════════════════════════════════════
 
export const saveRides = async (rides) => {
  await AsyncStorage.setItem(RIDES_KEY, JSON.stringify(rides));
};

export const getRides = async () => {
  const data = await AsyncStorage.getItem(RIDES_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearRides = async () => {
  await AsyncStorage.removeItem(RIDES_KEY);
};

// ═══════════════════════════════════════════════════════════════
// SINGLE ORDER HELPERS (Use these today)
// ═══════════════════════════════════════════════════════════════

export const getActiveRide = async () => {
  const rides = await getRides();
  return rides[0] || null; // First item = current ride
};

export const saveActiveRide = async (rideData, currentStep) => {
  const ride = {
    id: rideData?.offer?.order_id || rideData?.id,
    data: rideData,
    step: currentStep,
    acceptedAt: new Date().toISOString(),
    priority: 1,
  };
  await saveRides([ride]); // Array with single item
};

export const updateRideStep = async (rideId, newStep) => {
  const rides = await getRides();
  const updated = rides.map(r => 
    r.id === rideId ? { ...r, step: newStep } : r
  );
  await saveRides(updated);
};

export const completeActiveRide = async (rideId) => {
  const rides = await getRides();
  // Today: clear all (single order)
  // Future: filter out completed, keep others
  await clearRides();
};