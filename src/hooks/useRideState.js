/**
 * useRideState.js
 * Hook for managing ride flow state machine
 * Easy to extend with new steps
 */

import { useState, useCallback } from 'react';

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

  const startRide = useCallback((ride) => {
    setRideData(ride);
    setCurrentStep(RIDE_STEPS.GOING_TO_PICKUP);
  }, []);

  const arriveAtPickup = useCallback(() => {
    setCurrentStep(RIDE_STEPS.ARRIVED_AT_PICKUP);
  }, []);

  const startDropoff = useCallback(() => {
    setCurrentStep(RIDE_STEPS.GOING_TO_DROPOFF);
  }, []);

  const arriveAtDropoff = useCallback(() => {
    setCurrentStep(RIDE_STEPS.ARRIVED_AT_DROPOFF);
  }, []);

  const completeRide = useCallback(() => {
    setCurrentStep(RIDE_STEPS.COMPLETED);
    setRideData(null);
  }, []);

  const cancelRide = useCallback(() => {
    setCurrentStep(RIDE_STEPS.IDLE);
    setRideData(null);
  }, []);

  const getCurrentConfig = useCallback(() => {
    return STEP_CONFIG[currentStep] || STEP_CONFIG[RIDE_STEPS.GOING_TO_PICKUP];
  }, [currentStep]);

  const isActive = currentStep !== RIDE_STEPS.IDLE && currentStep !== RIDE_STEPS.COMPLETED;

  return {
    // State
    currentStep,
    rideData,
    isActive,
    config: getCurrentConfig(),
    
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
 