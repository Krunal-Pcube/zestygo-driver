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

  // Helper: Get current order based on current stop (skip cancelled)
  const getCurrentOrder = useCallback(() => {
    const currentStop = getCurrentStop();
    if (!currentStop || !rideData?.delivery_trip_orders) return null;
    
    // Find order for current stop
    const order = rideData.delivery_trip_orders.find(
      o => o.id === currentStop.delivery_trip_order_id
    );
    
    // Skip cancelled orders - return null if cancelled
    if (!order || order.status === 'cancelled') {
      console.log('[getCurrentOrder] Order cancelled or not found, id:', currentStop.delivery_trip_order_id);
      return null;
    }
    
    // Also skip if stop itself is completed/skipped/cancelled
    if (['completed', 'skipped', 'cancelled'].includes(currentStop.status)) {
      console.log('[getCurrentOrder] Stop already processed, id:', currentStop.id, 'status:', currentStop.status);
      return null;
    }
    
    return order;
  }, [getCurrentStop, rideData]);

  // Helper: Check if there are more active stops after current (skip cancelled)
  const hasMoreStops = useCallback(() => {
    const stops = getSortedStops();
    const orders = rideData?.delivery_trip_orders || [];
    
    // Look for next active stop
    for (let i = currentStopIndex + 1; i < stops.length; i++) {
      const stop = stops[i];
      const order = orders.find(o => o.id === stop.delivery_trip_order_id);
      if (order && order.status !== 'cancelled' && !['completed', 'skipped', 'cancelled'].includes(stop.status)) {
        return true; // Found active order
      }
    }
    return false; // No more active stops
  }, [getSortedStops, currentStopIndex, rideData]);

  // Helper: Advance to next stop (skip cancelled orders)
  const advanceToNextStop = useCallback(async () => {
    const stops = getSortedStops();
    const orders = rideData?.delivery_trip_orders || [];
    
    // Find next stop with active (non-cancelled) order
    let nextIndex = currentStopIndex + 1;
    while (nextIndex < stops.length) {
      const stop = stops[nextIndex];
      const order = orders.find(o => o.id === stop.delivery_trip_order_id);
      
      if (order && order.status !== 'cancelled' && !['completed', 'skipped', 'cancelled'].includes(stop.status)) {
        // Found active order, use this stop
        break;
      }
      
      // Skip cancelled order stop
      console.log('[advanceToNextStop] Skipping cancelled order stop:', stop.id);
      nextIndex++;
    }

    if (nextIndex >= stops.length) {
      // No more active stops
      console.log('[advanceToNextStop] No more active stops');
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

    console.log('[advanceToNextStop] Advanced to stop:', nextIndex, 'order:', nextStop.delivery_trip_order_id);
    return true;
  }, [currentStopIndex, deliveryTripId, getSortedStops, rideData]);

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

  
    const tripId = apiResponse?.delivery_trip_id
    console.log('[startRide] Extracted tripId:', tripId);

    if (!tripId) {
      console.error('[startRide] No deliveryTripId found in API response');
      console.error('[startRide] Response keys:', Object.keys(apiResponse || {}));
      return;
    }

    // Check if this is the same trip (accepting additional order)
    const isSameTrip = tripId === deliveryTripId;
    console.log('[startRide] isSameTrip:', isSameTrip, 'existing:', deliveryTripId, 'new:', tripId);

    setDeliveryTripId(tripId);

    if (!isSameTrip) {
      // New trip - reset to beginning
      console.log('[startRide] New trip - resetting state');
      setCurrentStep(RIDE_STEPS.GOING_TO_PICKUP);
      setCurrentStopIndex(0);
      await saveActiveTripId(tripId, RIDE_STEPS.GOING_TO_PICKUP, 0);
    } else {
      // Same trip - accepting additional order, keep current position
      console.log('[startRide] Same trip - refreshing data only');
      // Keep currentStep and currentStopIndex as-is
    }

    // Fetch full trip details from API
    console.log('[startRide] Fetching trip details for ID:', tripId);
    await getTripDetailsController({
      deliveryTripId: tripId,
      onSuccess: (data) => {
        console.log('[startRide] Trip details fetched successfully:', data?.trip_number || data?.id);
        setRideData(data);

        // If same trip and new stops added, we may need to advance
        if (isSameTrip) {
          const stops = data?.delivery_route_stops || [];
          const currentStop = stops[currentStopIndex];
          console.log('[startRide] Current stop after refresh:', currentStop?.sequence_number, currentStop?.stop_type);
        }
      },
    });
  }, [deliveryTripId, currentStopIndex]);

  // Refresh trip data without changing state
  // Returns fresh data for immediate use (avoids race condition with setState)
  const refreshTripData = useCallback(async () => {
    if (!deliveryTripId) {
      console.error('[refreshTripData] No active trip ID');
      return null;
    }

    console.log('[refreshTripData] Fetching fresh data for trip:', deliveryTripId);
    let freshData = null;
    await getTripDetailsController({
      deliveryTripId,
      onSuccess: (data) => {
        console.log('[refreshTripData] Data refreshed:', data?.trip_number || data?.id);
        freshData = data;
        setRideData(data);
      },
    });
    return freshData;
  }, [deliveryTripId]);

  const arriveAtPickup = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.ARRIVED_AT_PICKUP);
    if (deliveryTripId) {
      await saveActiveTripId(deliveryTripId, RIDE_STEPS.ARRIVED_AT_PICKUP, currentStopIndex);
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

  const startDropoff = useCallback(async () => {
    // Check if we need to go to next stop or start dropoff for current
    const currentStop = getCurrentStop();
    const stops = getSortedStops();

    if (currentStop?.stop_type === 'pickup' && hasMoreStops()) {
      // Look at what the next stop is BEFORE advancing
      const nextStop = stops[currentStopIndex + 1];

      if (nextStop?.stop_type === 'pickup') {
        // Next stop is another pickup (same restaurant, different order)
        // Stay in ARRIVED_AT_PICKUP state but advance to the next stop
        const hasNext = await advanceToNextStop();
        if (!hasNext) {
          await completeRide();
          return;
        }
        // Stay in ARRIVED_AT_PICKUP - don't go to dropoff yet
        // The UI will refresh with the new order data
        return;
      } else {
        // Next stop is a drop - advance and then go to dropoff
        const hasNext = await advanceToNextStop();
        if (!hasNext) {
          await completeRide();
          return;
        }
        // After advancing to drop, verify the next order is valid
        const nextOrder = getCurrentOrder();
        if (!nextOrder) {
          console.log('[startDropoff] Next order is cancelled/null, completing ride');
          await completeRide();
          return;
        }
      }
    }
    // Start dropoff for current order
    setCurrentStep(RIDE_STEPS.GOING_TO_DROPOFF);
    if (deliveryTripId) {
      await saveActiveTripId(deliveryTripId, RIDE_STEPS.GOING_TO_DROPOFF, currentStopIndex);
    }
  }, [deliveryTripId, currentStopIndex, getCurrentStop, getSortedStops, hasMoreStops, advanceToNextStop, getCurrentOrder, completeRide]);

  const arriveAtDropoff = useCallback(async () => {
    setCurrentStep(RIDE_STEPS.ARRIVED_AT_DROPOFF);
    if (deliveryTripId) {
      await saveActiveTripId(deliveryTripId, RIDE_STEPS.ARRIVED_AT_DROPOFF, currentStopIndex);
    }
  }, [deliveryTripId, currentStopIndex]);

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
    refreshTripData,
    // Helpers
    RIDE_STEPS,
  };
}

export default useRideState;
