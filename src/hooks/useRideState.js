/**
 * useRideState.js
 * Hook for managing ride flow state machine
 * Easy to extend with new steps
 */

import { useState, useCallback, useEffect } from 'react';

import {
  getActiveRide,
  saveActiveRide,
  updateRideStep,
  completeActiveRide
} from '../utils/storage/rideStorage';

// ═══════════════════════════════════════════════════════════════
// RIDE STEPS - Add new steps here as needed
// ═══════════════════════════════════════════════════════════════
export const RIDE_STEPS = {
  IDLE: 'idle',                           // No active ride
  GOING_TO_PICKUP: 'going_to_pickup',     // Driver heading to pickup
  ARRIVED_AT_PICKUP: 'arrived_at_pickup', // Driver at pickup location
  GOING_TO_DROPOFF: 'going_to_dropoff',   // Driver heading to dropoff
  ARRIVED_AT_DROPOFF: 'arrived_at_dropoff', // Driver at dropoff
  COMPLETED: 'completed',                 // Ride finished
};

// ═══════════════════════════════════════════════════════════════
// STEP CONFIGURATION - Define behavior for each step
// ═══════════════════════════════════════════════════════════════
export const STEP_CONFIG = {
  [RIDE_STEPS.GOING_TO_PICKUP]: {
    bottomSheetHeight: '15%',
    primaryButtonText: 'Arrived',
    primaryButtonAction: 'ARRIVE_PICKUP',
    showNavigationButton: true,
    mapFocus: 'pickup',
    statusText: 'Finding Trips',
    actions: ['call', 'chat', 'cancel'],
    // Map route config
    showRoute: 'driver_to_restaurant',
    showRestaurantMarker: true,
    showCustomerMarker: false,
  },
  [RIDE_STEPS.ARRIVED_AT_PICKUP]: {
    bottomSheetHeight: '20%',
    primaryButtonText: 'Complete Pickup',
    primaryButtonAction: 'START_DROPOFF',
    showNavigationButton: false,
    mapFocus: 'pickup',
    statusText: 'Arrived at restaurant',
    actions: ['call', 'chat'],
    showRoute: 'none',
    showRestaurantMarker: true,
    showCustomerMarker: false,
  },
  [RIDE_STEPS.GOING_TO_DROPOFF]: {
    bottomSheetHeight: '15%',
    primaryButtonText: 'Arrived',
    primaryButtonAction: 'ARRIVE_DROPOFF',
    showNavigationButton: true,
    mapFocus: 'dropoff',
    statusText: 'Finding Trips',
    actions: ['call', 'chat'],
    showRoute: 'driver_to_customer',
    showRestaurantMarker: false,
    showCustomerMarker: true,
  },
  [RIDE_STEPS.ARRIVED_AT_DROPOFF]: {
    bottomSheetHeight: '18%',
    primaryButtonText: 'Complete Delivery',
    primaryButtonAction: 'COMPLETE_RIDE',
    showNavigationButton: false,
    mapFocus: 'dropoff',
    statusText: 'Arrived at destination',
    actions: ['call', 'chat'],
    showRoute: 'none',
    showRestaurantMarker: false,
    showCustomerMarker: true,
  },
};

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════
export function useRideState() {
  const [currentStep, setCurrentStep] = useState(RIDE_STEPS.IDLE);
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    const loadSavedRide = async () => {
      const saved = await getActiveRide();
      if (saved?.data && saved?.step) {
        setRideData(saved.data);
        setCurrentStep(saved.step);
      }
    };
    loadSavedRide();
  }, []);



  const startRide = useCallback(async (ride) => {
    setRideData(ride);
    setCurrentStep(RIDE_STEPS.GOING_TO_PICKUP);
     await saveActiveRide(ride, RIDE_STEPS.GOING_TO_PICKUP);
  }, []);

   const arriveAtPickup = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.ARRIVED_AT_PICKUP);
    if (rideData) {
      await updateRideStep(rideData.offer?.order_id, RIDE_STEPS.ARRIVED_AT_PICKUP);
    }
  }, [rideData]);


  const startDropoff = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.GOING_TO_DROPOFF);
    if (rideData) {
      await updateRideStep(rideData.offer?.order_id, RIDE_STEPS.GOING_TO_DROPOFF);
    }
  }, [rideData]);


   const arriveAtDropoff = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.ARRIVED_AT_DROPOFF);
    if (rideData) {
      await updateRideStep(rideData.offer?.order_id, RIDE_STEPS.ARRIVED_AT_DROPOFF);
    }
  }, [rideData]);


 const completeRide = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.COMPLETED);
    setRideData(null);
    await completeActiveRide(); // Clears storage
  }, []);
 
  const cancelRide = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.IDLE);
    setRideData(null);
    await completeActiveRide(); // Clears storage
  }, []);



  const isActive = currentStep !== RIDE_STEPS.IDLE && currentStep !== RIDE_STEPS.COMPLETED;

  return {
    // State
    currentStep,
    rideData,
    isActive,
    config: STEP_CONFIG[currentStep] || {},

    // Actions
    startRide,
    arriveAtPickup,
    startDropoff,
    arriveAtDropoff,
    completeRide,
    cancelRide,
    // Helpers
    RIDE_STEPS,
  };
}

export default useRideState;
