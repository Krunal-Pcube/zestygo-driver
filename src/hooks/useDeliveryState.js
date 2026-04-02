/**
 * useDeliveryState.js
 * Food delivery state machine with complete flow
 */

import { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// DELIVERY STEPS
// ═══════════════════════════════════════════════════════════════
export const DELIVERY_STEPS = {
  IDLE: 'idle',                                    // No active order
  ORDER_ASSIGNED: 'order_assigned',               // Order accepted, going to restaurant
  ARRIVED_AT_RESTAURANT: 'arrived_at_restaurant', // At restaurant, waiting for food
  PICKED_UP_FOOD: 'picked_up_food',              // Food picked up, going to customer
  GOING_TO_CUSTOMER: 'going_to_customer',        // En route to customer
  ARRIVED_AT_CUSTOMER: 'arrived_at_customer',     // At customer location
  DELIVERED: 'delivered',                         // Order completed
};

// ═══════════════════════════════════════════════════════════════
// STEP CONFIGURATION
// Defines: bottom sheet UI, map behavior, actions for each step
// ═══════════════════════════════════════════════════════════════
export const STEP_CONFIG = {
  [DELIVERY_STEPS.ORDER_ASSIGNED]: {
    // Bottom Sheet
    bottomSheetHeight: '22%',
    title: 'Going to Restaurant',
    subtitle: 'Pick up the order',
    primaryButtonText: 'Arrived at Restaurant',
    statusText: 'Finding Trips',
    actions: ['call_restaurant', 'chat_support', 'cancel'],
    
    // Map
    mapFocus: 'restaurant',           // Camera focuses on restaurant
    showRoute: 'driver_to_restaurant', // Show route line
    showRestaurantMarker: true,
    showCustomerMarker: false,
    showNavigationButton: true,
    
    // Data to show
    showRestaurantInfo: true,
    showCustomerInfo: false,
  },
  
  [DELIVERY_STEPS.ARRIVED_AT_RESTAURANT]: {
    bottomSheetHeight: '32%',
    title: 'Arrived at Restaurant',
    subtitle: 'Confirm order pickup',
    primaryButtonText: 'Picked Up Food',
    statusText: 'Waiting for order',
    actions: ['call_restaurant', 'chat_support'],
    
    mapFocus: 'restaurant',
    showRoute: 'none',
    showRestaurantMarker: true,
    showCustomerMarker: false,
    showNavigationButton: false,
    
    showRestaurantInfo: true,
    showCustomerInfo: false,
  },
  
  [DELIVERY_STEPS.PICKED_UP_FOOD]: {
    bottomSheetHeight: '22%',
    title: 'Going to Customer',
    subtitle: 'Deliver the order',
    primaryButtonText: 'Arrived at Customer',
    statusText: 'Finding Trips',
    actions: ['call_customer', 'chat_customer'],
    
    mapFocus: 'customer',
    showRoute: 'driver_to_customer',
    showRestaurantMarker: false,
    showCustomerMarker: true,
    showNavigationButton: true,
    
    showRestaurantInfo: false,
    showCustomerInfo: true,
  },
  
  [DELIVERY_STEPS.GOING_TO_CUSTOMER]: {
    bottomSheetHeight: '22%',
    title: 'Going to Customer',
    subtitle: 'Deliver the order',
    primaryButtonText: 'Arrived at Customer',
    statusText: 'Finding Trips',
    actions: ['call_customer', 'chat_customer'],
    
    mapFocus: 'customer',
    showRoute: 'driver_to_customer',
    showRestaurantMarker: false,
    showCustomerMarker: true,
    showNavigationButton: true,
    
    showRestaurantInfo: false,
    showCustomerInfo: true,
  },
  
  [DELIVERY_STEPS.ARRIVED_AT_CUSTOMER]: {
    bottomSheetHeight: '28%',
    title: 'Arrived at Customer',
    subtitle: 'Hand over the order',
    primaryButtonText: 'Complete Delivery',
    statusText: 'Waiting at door',
    actions: ['call_customer', 'chat_customer'],
    
    mapFocus: 'customer',
    showRoute: 'none',
    showRestaurantMarker: false,
    showCustomerMarker: true,
    showNavigationButton: false,
    
    showRestaurantInfo: false,
    showCustomerInfo: true,
  },
  
  [DELIVERY_STEPS.DELIVERED]: {
    bottomSheetHeight: '25%',
    title: 'Order Delivered',
    subtitle: 'Delivery completed successfully',
    primaryButtonText: 'Back to Home',
    statusText: 'Completed',
    actions: [],
    
    mapFocus: 'driver',
    showRoute: 'none',
    showRestaurantMarker: false,
    showCustomerMarker: false,
    showNavigationButton: false,
    
    showRestaurantInfo: false,
    showCustomerInfo: false,
  },
};

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════
export function useDeliveryState() {
  const [currentStep, setCurrentStep] = useState(DELIVERY_STEPS.IDLE);
  const [orderData, setOrderData] = useState(null);

  // Start delivery flow
  const startDelivery = useCallback((order) => {
    setOrderData(order);
    setCurrentStep(DELIVERY_STEPS.ORDER_ASSIGNED);
  }, []);

  // Step transitions
  const arriveAtRestaurant = useCallback(() => {
    setCurrentStep(DELIVERY_STEPS.ARRIVED_AT_RESTAURANT);
  }, []);

  const pickUpFood = useCallback(() => {
    setCurrentStep(DELIVERY_STEPS.PICKED_UP_FOOD);
    // Auto-transition to going after short delay
    setTimeout(() => {
      setCurrentStep(DELIVERY_STEPS.GOING_TO_CUSTOMER);
    }, 500);
  }, []);

  const arriveAtCustomer = useCallback(() => {
    setCurrentStep(DELIVERY_STEPS.ARRIVED_AT_CUSTOMER);
  }, []);

  const completeDelivery = useCallback(() => {
    setCurrentStep(DELIVERY_STEPS.DELIVERED);
  }, []);

  const cancelDelivery = useCallback(() => {
    setCurrentStep(DELIVERY_STEPS.IDLE);
    setOrderData(null);
  }, []);

  const resetToHome = useCallback(() => {
    setCurrentStep(DELIVERY_STEPS.IDLE);
    setOrderData(null);
  }, []);

  // Get config for current step
  const getCurrentConfig = useCallback(() => {
    return STEP_CONFIG[currentStep] || STEP_CONFIG[DELIVERY_STEPS.ORDER_ASSIGNED];
  }, [currentStep]);

  const isActive = currentStep !== DELIVERY_STEPS.IDLE && currentStep !== DELIVERY_STEPS.DELIVERED;
  const isDelivered = currentStep === DELIVERY_STEPS.DELIVERED;

  return {
    // State
    currentStep,
    orderData,
    isActive,
    isDelivered,
    config: getCurrentConfig(),
    
    // Actions
    startDelivery,
    arriveAtRestaurant,
    pickUpFood,
    arriveAtCustomer,
    completeDelivery,
    cancelDelivery,
    resetToHome,
    
    // Helpers
    DELIVERY_STEPS,
  };
}

export default useDeliveryState;
