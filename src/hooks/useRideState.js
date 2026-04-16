/**
 * useRideState.js
 * Hook for managing ride flow state machine
 * Easy to extend with new steps
 */

import { useState, useCallback, useEffect } from 'react';

import { getTripDetailsController } from '../MVC/controllers/driverAssignmentController';
import {
  getActiveTripId,
  saveActiveTripId,
  clearActiveTripId,
} from '../utils/storage/tripStorage';

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
  const [deliveryTripId, setDeliveryTripId] = useState(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0); // Track current stop sequence

  // Helper: Get sorted stops by sequence_number
  const getSortedStops = useCallback(() => {
    if (!rideData?.delivery_route_stops) return [];
    return [...rideData.delivery_route_stops].sort((a, b) => a.sequence_number - b.sequence_number);
  }, [rideData]);

  // Helper: Get current stop based on currentStopIndex
  const getCurrentStop = useCallback(() => {
    const stops = getSortedStops();
    return stops[currentStopIndex] || null;
  }, [getSortedStops, currentStopIndex]);

  // Helper: Get current order based on current stop
  const getCurrentOrder = useCallback(() => {
    const currentStop = getCurrentStop();
    if (!currentStop || !rideData?.delivery_trip_orders) return null;
    return rideData.delivery_trip_orders.find(
      order => order.id === currentStop.delivery_trip_order_id
    ) || rideData.delivery_trip_orders[0];
  }, [getCurrentStop, rideData]);

  // Helper: Check if there are more stops after current
  const hasMoreStops = useCallback(() => {
    const stops = getSortedStops();
    return currentStopIndex < stops.length - 1;
  }, [getSortedStops, currentStopIndex]);

  // Helper: Advance to next stop
  const advanceToNextStop = useCallback(async () => {
    const stops = getSortedStops();
    const nextIndex = currentStopIndex + 1;

    if (nextIndex >= stops.length) {
      // All stops completed
      return false;
    }

    const nextStop = stops[nextIndex];
    setCurrentStopIndex(nextIndex);

    // Determine step based on next stop type
    const nextStep = nextStop.stop_type === 'pickup'
      ? RIDE_STEPS.GOING_TO_PICKUP
      : RIDE_STEPS.GOING_TO_DROPOFF;

    setCurrentStep(nextStep);

    if (deliveryTripId) {
      await saveActiveTripId(deliveryTripId, nextStep, nextIndex);
    }

    return true;
  }, [currentStopIndex, deliveryTripId, getSortedStops]);

  useEffect(() => {
    const loadSavedTrip = async () => {
      const saved = await getActiveTripId();
      console.log('[loadSavedTrip] Loaded from storage:', saved);

      if (saved?.deliveryTripId && saved?.step) {
        console.log('[loadSavedTrip] Restoring trip:', saved.deliveryTripId, 'step:', saved.step);
        setDeliveryTripId(saved.deliveryTripId);
        setCurrentStep(saved.step);
        setCurrentStopIndex(saved.currentStopIndex || 0);

        // Fetch fresh trip details from API
        console.log('[loadSavedTrip] Fetching trip details for ID:', saved.deliveryTripId);
        await getTripDetailsController({
          deliveryTripId: saved.deliveryTripId,
          onSuccess: (data) => {
            console.log('[loadSavedTrip] Trip details fetched:', data?.trip_number || data?.id);
            setRideData(data);
          },
        });
      } else {
        console.log('[loadSavedTrip] No saved trip found');
      }
    };
    loadSavedTrip();
  }, []);



  const startRide = useCallback(async (apiResponse) => {
    console.log('[startRide] API response:', apiResponse);

    // Try multiple possible paths for trip ID
    const tripId = apiResponse?.delivery_trip_id
    console.log('[startRide] Extracted tripId:', tripId);

    if (!tripId) {
      console.error('[startRide] No deliveryTripId found in API response');
      console.error('[startRide] Response keys:', Object.keys(apiResponse || {}));
      return;
    }

    setDeliveryTripId(tripId);
    setCurrentStep(RIDE_STEPS.GOING_TO_PICKUP);

    // Save only trip ID + step + stop index (minimal storage)
    await saveActiveTripId(tripId, RIDE_STEPS.GOING_TO_PICKUP, 0);

    // Fetch full trip details from API
    console.log('[startRide] Fetching trip details for ID:', tripId);
    await getTripDetailsController({
      deliveryTripId: tripId,
      onSuccess: (data) => {
        console.log('[startRide] Trip details fetched successfully:', data?.trip_number || data?.id);
        setRideData(data);
      },
    });
  }, []);

  const arriveAtPickup = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.ARRIVED_AT_PICKUP);
    if (deliveryTripId) {
      await saveActiveTripId(deliveryTripId, RIDE_STEPS.ARRIVED_AT_PICKUP, currentStopIndex);
    }
  }, [deliveryTripId, currentStopIndex]);


  const startDropoff = useCallback(async () => {
    // Check if we need to go to next stop or start dropoff for current
    const currentStop = getCurrentStop();

    if (currentStop?.stop_type === 'pickup' && hasMoreStops()) {
      // There are more stops - advance to next
      const hasNext = await advanceToNextStop();
      if (!hasNext) {
        // No more stops, complete the ride
        await completeRide();
      }
    } else {
      // Start dropoff for current order
      setCurrentStep(RIDE_STEPS.GOING_TO_DROPOFF);
      if (deliveryTripId) {
        await saveActiveTripId(deliveryTripId, RIDE_STEPS.GOING_TO_DROPOFF, currentStopIndex);
      }
    }
  }, [deliveryTripId, currentStopIndex, getCurrentStop, hasMoreStops, advanceToNextStop]);


  const arriveAtDropoff = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.ARRIVED_AT_DROPOFF);
    if (deliveryTripId) {
      await saveActiveTripId(deliveryTripId, RIDE_STEPS.ARRIVED_AT_DROPOFF, currentStopIndex);
    }
  }, [deliveryTripId, currentStopIndex]);


  const completeRide = useCallback(async () => {
    // Check if there are more stops to complete
    if (hasMoreStops()) {
      const hasNext = await advanceToNextStop();
      if (hasNext) return; // Continue to next stop
    }

    // All stops completed
    setCurrentStep(RIDE_STEPS.COMPLETED);
    setRideData(null);
    setDeliveryTripId(null);
    setCurrentStopIndex(0);
    await clearActiveTripId(); // Clears storage
  }, [hasMoreStops, advanceToNextStop]);

  const cancelRide = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.IDLE);
    setRideData(null);
    setDeliveryTripId(null);
    setCurrentStopIndex(0);
    await clearActiveTripId(); // Clears storage
  }, []);



  const isActive = currentStep !== RIDE_STEPS.IDLE && currentStep !== RIDE_STEPS.COMPLETED;

  return {
    // State
    currentStep,
    rideData,
    isActive,
    deliveryTripId,
    currentStopIndex,
    config: STEP_CONFIG[currentStep] || {},

    // Multi-order helpers
    getSortedStops,
    getCurrentStop,
    getCurrentOrder,
    hasMoreStops,
    advanceToNextStop,
    totalStops: rideData?.delivery_route_stops?.length || 0,

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
