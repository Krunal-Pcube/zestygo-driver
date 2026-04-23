/**
 * HomeScreen.js
 * Main screen for the driver app.
 * - Uses @react-native-community/geolocation for GPS
 * - Requests permissions, tracks real location & heading
 * - "Locate" button snaps camera to real GPS position
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Platform,
  Animated,
  Easing,
  Dimensions,
  Alert,
  Linking,
  Text,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useSharedValue } from 'react-native-reanimated';
import { verticalScale } from 'react-native-size-matters';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import RideRequestCard from '../../components/homeComponents/Riderequestcard';
import HomeHeader from '../../components/homeComponents/homeHeader';
import MapComponent from '../../components/homeComponents/MapComponent';
import BottomSheetComponent from '../../components/homeComponents/bottomsheetComponent';
import ActiveRideBottomSheet from '../../components/homeComponents/ActiveRideBottomSheet';
import { EarningsModal, ChatModal } from '../../components/homeComponents/TripCompletionModals';
import StatsContent from '../../components/homeComponents/StatsContent';
import useRideState, { RIDE_STEPS } from '../../hooks/useRideState';
import { acceptOrderController, rejectOrderController, updateOrderStatusController, uploadOrderProofController } from '../../MVC/controllers/driverAssignmentController';
import { requestLocationPermission, checkAndPromptGPSEnabled } from '../../utils/gpsHelpers';
import { onSocketEvent, offSocketEvent } from '../../services/socketIndex';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/storage/asyncStorageKeys';
import useBackgroundLocation from '../../hooks/useBackgroundLocation';
import useBatteryMonitor from '../../hooks/useBatteryMonitor';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/* ─────────────────────────────────────────────────────────────────
   MAIN HOME SCREEN
───────────────────────────────────────────────────────────────── */
export default function HomeScreen({ navigation }) {

  // Use ride state machine
  const {
    currentStep,
    rideData,
    isActive,
    deliveryTripId,
    currentStopIndex,
    totalStops,
    startRide,
    arriveAtPickup,
    startDropoff,
    arriveAtDropoff,
    completeRide,
    cancelRide,
    getCurrentStop,
    getCurrentOrder,
    hasMoreStops,
    advanceToNextStop,
    refreshTripData,
  } = useRideState();

  const [isOnline, setIsOnline] = useState(false);
  const isOnlineRef = useRef(false);
  /* ── Load saved online status from AsyncStorage ──────────────── */
  useEffect(() => {
    const loadOnlineStatus = async () => {
      try {
        const savedStatus = await AsyncStorage.getItem(STORAGE_KEYS.DRIVER_ONLINE_STATUS);
        if (savedStatus !== null) {
          const parsedStatus = JSON.parse(savedStatus);
          console.log('[Status] Loaded from AsyncStorage:', parsedStatus);
          setIsOnline(parsedStatus);
        }
      } catch (error) {
        console.log('[Status] Error loading from AsyncStorage:', error);
      }
    };

    loadOnlineStatus();
  }, []);
  const [notificationCount, setNotificationCount] = useState(2); // TODO: Fetch from API
  const [rideRequests, setRideRequests] = useState([]);
  const [showRideRequests, setShowRideRequests] = useState(false);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [refreshEarningsTrigger, setRefreshEarningsTrigger] = useState(0);
  const [currentOrderEarnings, setCurrentOrderEarnings] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [locationReady, setLocationReady] = useState(false);
  const [gpsReady, setGpsReady] = useState(false);
  const [cameraHeading, setCameraHeading] = useState(0);
  const [swipeResetKey, setSwipeResetKey] = useState(0);  // ← Reset SwipeToConfirm on API failure

  // Map follow mode: auto-follow driver during active ride
  const [isFollowingDriver, setIsFollowingDriver] = useState(true);
  const userInteractedRef = useRef(false);

  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const chevronRot = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;
  const watchIdRef = useRef(null);

  /* ── DEBUG: Generate test ride without socket ─────────────────── */
  const addTestRide = useCallback(() => {
    const testRide = {
      offer: { order_id: `TEST_${Date.now()}` },
      order: { order_type: 'delivery', schedule_type: 'now' },
      payout: { delivery_fee_amount: 15.5, tip_amount: 3.5 },
      restaurant: { name: 'Test Restaurant', address: '123 Test St, Test City' },
      customer: { name: 'John Doe', address: '456 Customer Ave, Test City' },
      eta: { to_restaurant_minutes: 5, to_customer_minutes: 12 },
      route: { to_restaurant_km: 1.2, to_customer_km: 4.5 },
    };
    setRideRequests(prev => [...prev, testRide]);
    setShowRideRequests(true);
    console.log('[TEST] Added test ride:', testRide.offer.order_id);
  }, []);

  const animatedPosition = useSharedValue(SCREEN_HEIGHT * 0.85);
  const snapPoints = useMemo(() => ['15%'], []);
  const floatBtnOffset = verticalScale(58);

  const isFocused = useIsFocused();
  const { colors } = useTheme();

  /* ── Request permission + start GPS ──────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const granted = await requestLocationPermission();
      if (cancelled) return;

      if (!granted) {
        Alert.alert(
          'Location Permission Denied',
          'Enable location in Settings to use the map.',
        );
        setLocationReady(false);
        return;
      }

      // ── Check if GPS is enabled (Android only) ────────────────
      const gpsEnabled = await checkAndPromptGPSEnabled();
      if (!gpsEnabled) {
        Alert.alert(
          'GPS Required',
          'GPS is required for this app to work properly. Please enable GPS and try again.',
          [{ text: 'OK' }],
        );
        setGpsReady(false);
        setLocationReady(false);
        return;
      }

      setGpsReady(true);
      setLocationReady(true);

      // ── Configure the community geolocation library ───────────
      // Must call setRNConfiguration before any GPS calls.
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,   // let the lib prompt on iOS
        authorizationLevel: 'whenInUse', // iOS: foreground only
        locationProvider: 'auto',        // Android: GPS + Network fused
      });

      // ── Get initial fix right away ────────────────────────────
      // First try: get cached location quickly (max 30s old)
      Geolocation.getCurrentPosition(
        pos => {
          if (cancelled) return;
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
          mapRef.current?.animateCamera(
            { center: { latitude, longitude }, zoom: 16 },
            { duration: 800 },
          );
        },
        err => {
          console.warn('[GPS] getCurrentPosition error:', err);
          // Only fallback to default if we still don't have a location
          if (!location) {
            setLocation({ latitude: 37.3541, longitude: -121.9552 });
          }
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 },
      );

      // ── Continuous watch ──────────────────────────────────────
      watchIdRef.current = Geolocation.watchPosition(
        pos => {
          if (cancelled) return;
          const { latitude, longitude, heading: h } = pos.coords;
          setLocation({ latitude, longitude });

          // heading is only reliable when moving; ignore negatives
          if (h != null && h >= 0) {
            setHeading(h);
          }

          // Follow driver only during active ride and when user hasn't manually moved map
          if (isActive && isFollowingDriver && !userInteractedRef.current) {
            mapRef.current?.animateCamera(
              { center: { latitude, longitude }, heading: h, zoom: 16 },
              { duration: 600 },
            );


          }
        },
        err => console.warn('[GPS] watchPosition error:', err),
        {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 20, // metres
        },
      );
    })();

    return () => {
      cancelled = true;
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isFocused]);


  useEffect(() => {
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  /* ── Real socket ride requests while online ───────────────────── */
  useEffect(() => {
    const handleNewOrderOffer = (orderData) => {

      if (!isOnlineRef.current) {  // ← Always fresh value!
        console.log('[Socket] Ignoring - driver offline');
        return;
      }
      console.log('[Socket] New order offer received:', orderData);

      const data = Array.isArray(orderData) ? orderData[0] : orderData;
      if (!data || !data.offer) {
        console.error('[Socket] Invalid order data format:', orderData);
        return;
      }

      setRideRequests(prev => [...prev, data]);
      setShowRideRequests(true);
      console.log('[Socket] New ride request:', data.offer.order_id);
    };

    onSocketEvent('new_order_offer', handleNewOrderOffer);

    return () => {
      offSocketEvent('new_order_offer', handleNewOrderOffer);
    };
  }, []);


  /* ── Update location to backend every minute when online ──── */
  useBackgroundLocation(location, isOnline);

  /* ── Monitor battery level ──────────────────────────────────── */
  useBatteryMonitor({ threshold: 20, intervalMs: 60000 });

  /* ── Chevron follows sheet index ─────────────────────────────── */
  useEffect(() => {
    Animated.timing(chevronRot, {
      toValue: sheetIndex === 1 ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [sheetIndex]);

  const acceptRide = async (ride) => {
    const assignmentId = ride?.offer?.assignment_id;
    if (!assignmentId) {
      console.error('[Accept] No assignment_id in ride:', ride);
      Alert.alert('Error', 'Assignment ID not found');
      return;
    }

    const success = await acceptOrderController({
      payload: { assignment_id: assignmentId },
      onSuccess: (data) => {
        console.log('[Accept] API success:', data);

        // Pass API response - startRide extracts delivery_trip_id and fetches details
        startRide(data);
      },
    });

    // Remove from queue ALWAYS (success or fail)
    setRideRequests(prev => {
      const remaining = prev.filter(r => r.offer?.order_id !== ride.offer?.order_id);
      if (remaining.length === 0) {
        setShowRideRequests(false);
      }
      return remaining;
    });

    if (!success) {
      console.log('[Accept] API failed');
    }
  }

  const declineRide = async (ride) => {
    const assignmentId = ride?.offer?.assignment_id;
    if (!assignmentId) {
      console.error('[Decline] No assignment_id in ride:', ride);
      Alert.alert('Error', 'Assignment ID not found');
      return;
    }

    const success = await rejectOrderController({
      payload: { assignment_id: assignmentId },
      onSuccess: () => {
        console.log('[Decline] API success');
        setRideRequests(prev => {
          const remaining = prev.filter(r => r.offer?.order_id !== ride.offer?.order_id);
          if (remaining.length === 0) {
            setShowRideRequests(false);
          }
          return remaining;
        });
      },
    });

    if (!success) {
      console.log('[Decline] API failed');
    }
  };


  const autoDeclineRide = useCallback((ride) => {
    console.log('[AutoDecline] Timer expired, removing:', ride?.offer?.order_id);
    setRideRequests(prev => {
      const remaining = prev.filter(r => r.offer?.order_id !== ride?.offer?.order_id);
      if (remaining.length === 0) {
        setShowRideRequests(false);
      }
      return remaining;
    });
  }, []);  // ← Add this


  const handleArrived = async () => {
    // Get current order based on current stop index
    const currentOrder = getCurrentOrder();
    // Use delivery_trip_order_id (e.g., 2) instead of order_id (e.g., 44)
    const deliveryTripOrderId = currentOrder?.id;

    if (!deliveryTripOrderId) {
      console.error('[Arrived] No delivery trip order ID found');
      Alert.alert('Error', 'Order ID not found');
      return;
    }

    console.log('[Arrived] Using delivery_trip_order_id:', deliveryTripOrderId);

    // Update order status to "at_restaurant"
    const success = await updateOrderStatusController({
      deliveryTripOrderId,
      payload: { status: 'at_restaurant' },
      onStatusUpdate: (data) => {
        console.log('[Arrived] Status updated:', data);
        // Then update local state
        arriveAtPickup();
      },
    });

    if (!success) {
      console.log('[Arrived] Failed to update status');
      setSwipeResetKey(prev => prev + 1);  // ← Reset the swipe button
    }
  };

  const handleCompletePickup = useCallback(async () => {
    // Get current order based on current stop index
    const currentOrder = getCurrentOrder();
    // Use delivery_trip_order_id (e.g., 2) instead of order_id (e.g., 44)
    const deliveryTripOrderId = currentOrder?.id;

    if (!deliveryTripOrderId) {
      console.error('[CompletePickup] No delivery trip order ID found');
      Alert.alert('Error', 'Order ID not found');
      return;
    }

    console.log('[CompletePickup] Using delivery_trip_order_id:', deliveryTripOrderId);

    // Update order status to "picked_up"
    const success = await updateOrderStatusController({
      deliveryTripOrderId,
      payload: { status: 'picked_up' },
      onStatusUpdate: (data) => {
        console.log('[CompletePickup] Status updated to picked_up:', data);
        // Then advance to next stop (start dropoff)
        startDropoff();
      },
    });

    if (!success) {
      console.log('[CompletePickup] Failed to update status');
    }
  }, [getCurrentOrder, startDropoff]);

  const handleNavigate = useCallback(async () => {
    if (!rideData || !location) {
      Alert.alert('Error', 'Location or ride data not available');
      return;
    }

    // Get current order based on current stop
    const activeOrder = getCurrentOrder();
    const currentStop = getCurrentStop();

    let destination;
    if (currentStep === 'going_to_pickup' || currentStep === 'arrived_at_pickup') {
      // Use current stop coordinates if available, otherwise fallback to order
      destination = currentStop?.latitude ? {
        latitude: parseFloat(currentStop.latitude),
        longitude: parseFloat(currentStop.longitude)
      } : activeOrder?.restaurant_latitude ? {
        latitude: parseFloat(activeOrder.restaurant_latitude),
        longitude: parseFloat(activeOrder.restaurant_longitude)
      } : null;

    } else if (currentStep === 'going_to_dropoff' || currentStep === 'arrived_at_dropoff') {
      // Use current stop coordinates if available, otherwise find drop stop from route
      const dropStop = rideData?.delivery_route_stops?.find(s => s.stop_type === 'drop');
      destination = currentStop?.latitude ? {
        latitude: parseFloat(currentStop.latitude),
        longitude: parseFloat(currentStop.longitude)
      } : dropStop?.latitude ? {
        latitude: parseFloat(dropStop.latitude),
        longitude: parseFloat(dropStop.longitude)
      } : null;

    }

    if (!destination) {
      Alert.alert('Error', 'Destination coordinates not available');
      return;
    }

    const { latitude: destLat, longitude: destLng } = destination;
    const { latitude: originLat, longitude: originLng } = location;

    let url;
    if (Platform.OS === 'ios') {
      url = `comgooglemaps://?daddr=${destLat},${destLng}&directionsmode=driving`;
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
      }
    } else {
      url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
    }

    try {
      await Linking.openURL(url);
      console.log('[NAV] Opening Google Maps with destination:', destination);
    } catch (error) {
      console.error('[NAV] Error opening Google Maps:', error);
      Alert.alert('Error', 'Failed to open Google Maps. Please make sure the app is installed.');
    }
  }, [rideData, location, currentStep, getCurrentOrder, getCurrentStop]);



  const handleCancelRide = useCallback(async (reason) => {
    console.log('[CancelRide] Reason:', reason);

    const currentOrder = getCurrentOrder();
    const deliveryTripOrderId = currentOrder?.id;

    // 1. Cancel current order
    if (deliveryTripOrderId) {
      await updateOrderStatusController({
        deliveryTripOrderId,
        payload: {
          status: 'cancelled',
          reason: reason
        },
        onStatusUpdate: () => {
          console.log('[CancelRide] Order cancelled');
        },
      });
    }

    // 2. Refresh trip data to get latest state after cancellation
    console.log('[CancelRide] Refreshing trip data after cancel...');
    const freshData = await refreshTripData();

    // 3. Check for active stops using FRESH data (not stale state)
    const orders = freshData?.delivery_trip_orders || [];
    const stops = freshData?.delivery_route_stops || [];
    const activeStops = stops.filter(stop => {
      const order = orders.find(o => o.id === stop.delivery_trip_order_id);
      const isOrderActive = order && order.status !== 'cancelled';
      const isStopActive = !['completed', 'skipped', 'cancelled'].includes(stop.status);
      return isOrderActive && isStopActive;
    });

    const hasActiveStops = activeStops.length > 0;
    console.log('[CancelRide] Active stops found:', activeStops.length, 'hasActiveStops:', hasActiveStops);

    if (hasActiveStops) {
      console.log('[CancelRide] More orders remain, advancing to next stop');
      await advanceToNextStop();  // Skip to next order
    } else {
      console.log('[CancelRide] No more orders, clearing trip and returning to online');
      cancelRide();  // Only clear if no more orders
    }
  }, [getCurrentOrder, advanceToNextStop, cancelRide, refreshTripData]);


  const handleCall = useCallback(async () => {
    // Determine who to call based on current step
    const isPickupPhase = currentStep === RIDE_STEPS.GOING_TO_PICKUP || currentStep === RIDE_STEPS.ARRIVED_AT_PICKUP;

    // Get current order based on current stop
    const activeOrder = getCurrentOrder();

    let phoneNumber;
    let callTarget;

    if (isPickupPhase) {
      // Call restaurant during pickup
      phoneNumber = activeOrder?.restaurant_contact_number;
      callTarget = 'restaurant';
    } else {
      // Call customer during dropoff
      phoneNumber = activeOrder?.order?.order_checkout_details?.contact_number;
      callTarget = 'customer';
    }

    if (!phoneNumber) {
      Alert.alert('Error', `Phone number not available for ${callTarget}`);
      return;
    }

    try {
      await Linking.openURL(`tel:${phoneNumber}`);
      console.log(`[CALL] Calling ${callTarget}:`, phoneNumber);
    } catch (error) {
      console.error(`[CALL] Error calling ${callTarget}:`, error);
      Alert.alert('Error', 'Failed to make phone call');
    }
  }, [rideData, currentStep, getCurrentOrder]);



  const handleOpenChat = useCallback(() => {
    setShowChatModal(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setShowChatModal(false);
  }, []);






  const handleLocate = useCallback(() => {
    // Re-enable auto-follow when user clicks locate button
    userInteractedRef.current = false;
    setIsFollowingDriver(true);

    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          },
          700
        );


      },
      err => {
        console.warn('[GPS] handleLocate error:', err);
        mapRef.current?.animateToRegion(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          },
          500
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 3000 },
    );
  }, [location]);


  const handleReCenter = useCallback(() => {
    // 1. Center map on driver
    handleLocate();
    // 2. Clear route to force re-fetch
    // MapComponent will re-fetch automatically when location updates
  }, [handleLocate]);


  // When user interacts with map, stop auto-following
  const handleUserMapInteraction = useCallback(() => {
    if (isActive && isFollowingDriver) {
      userInteractedRef.current = true;
      setIsFollowingDriver(false);
      console.log('[Map] User interaction - stopped auto-follow');
    }
  }, [isActive, isFollowingDriver]);

  const handleMapClick = useCallback(() => {
  }, [navigation, rideData, location]);

  const animateChevron = useCallback((toIndex) => setSheetIndex(toIndex), []);
  const handleSheetChange = useCallback((index) => setSheetIndex(index), []);

  const handleShowEarningsModal = useCallback(() => {
    setShowEarningsModal(true);
  }, []);

  const handleCompleteDelivery = useCallback(async (photoUri, notes) => {
    // Check if current order is cancelled/null
    let currentOrder = getCurrentOrder();

    // If current order is cancelled, skip to next active stop
    if (!currentOrder) {
      console.log('[CompleteDelivery] Current order cancelled, skipping to next stop');
      const hasNext = await advanceToNextStop();
      if (!hasNext) {
        console.log('[CompleteDelivery] No more stops');
        cancelRide();
        return true; // Return true as flow is handled
      }
      // Try again with new stop
      currentOrder = getCurrentOrder();
    }

    const deliveryTripOrderId = currentOrder?.id;
    if (!deliveryTripOrderId) {
      console.error('[CompleteDelivery] No delivery trip order ID found');
      Alert.alert('Error', 'Order ID not found');
      return false; // Return false to keep modal open
    }


    // Calculate earnings for this specific order (delivery_amount + tip_amount)
    const deliveryAmount = parseFloat(currentOrder?.delivery_amount || 0);
    const tipAmount = parseFloat(currentOrder?.tip_amount || 0);
    const orderEarnings = (deliveryAmount + tipAmount).toFixed(2);
    setCurrentOrderEarnings(orderEarnings);
    console.log('[CompleteDelivery] Order earnings calculated:', orderEarnings);

    console.log('[CompleteDelivery] Using delivery trip order id:', deliveryTripOrderId);

    // Upload delivery proof with image and note
    const formData = new FormData();
    formData.append('delivery_proof_image', {
      uri: photoUri, // photo from DeliveryInfoModal
      type: 'image/jpeg',
      name: 'delivery_proof.jpg',
    });
    formData.append('note', notes);

    console.log('[CompleteDelivery] Proof ', formData, deliveryTripOrderId);

    try {
      const result = await uploadOrderProofController({
        deliveryTripOrderId,
        payload: formData,
        onSuccess: () => {
          console.log('[CompleteDelivery] Proof uploaded successfully');
          handleShowEarningsModal();
        },
      });

      // Return true if upload was successful, false otherwise
      return result !== null;
    } catch (error) {
      console.error('[CompleteDelivery] Upload failed:', error);
      return false;
    }
  }, [getCurrentOrder, advanceToNextStop, cancelRide, handleShowEarningsModal]);



  const handleEarningsDone = useCallback(() => {
    setShowEarningsModal(false);
    setRefreshEarningsTrigger(prev => prev + 1);
    completeRide();
  }, [completeRide]);


  return (
    <View style={{ flex: 1 }}>
      <HomeHeader navigation={navigation} notificationCount={notificationCount} refreshTrigger={refreshEarningsTrigger} />

      <MapComponent
        key={`map-${isFocused ? 'focused' : 'blurred'}`}
        location={location}
        heading={heading}
        cameraHeading={cameraHeading}
        setCameraHeading={setCameraHeading}
        activeRide={rideData}
        deliveryStep={currentStep}
        currentStopIndex={currentStopIndex}
        isOnline={isOnline}
        floatBtnOffset={floatBtnOffset}
        animatedPosition={animatedPosition}
        mapRef={mapRef}
        handleLocate={handleLocate}
        onMapClick={handleMapClick}
        onPanDrag={handleUserMapInteraction}
      />

      {/* <TouchableOpacity style={{ position: 'absolute', top: 80, left: 10, backgroundColor: 'red', padding: 10 }} onPress={addTestRide}>
        <Text style={{ color: 'white' }}>Add Test Ride</Text>
      </TouchableOpacity> */}

      <RideRequestCard
        rides={rideRequests}
        visible={showRideRequests && rideRequests.length > 0}
        onAccept={acceptRide}
        onDecline={declineRide}
        onAutoDecline={autoDeclineRide}
        duration={14}
      />

      <ActiveRideBottomSheet
        ride={rideData}
        driverLocation={location}
        rideStep={currentStep}
        currentStopIndex={currentStopIndex}
        totalStops={totalStops}
        isVisible={isActive && !showEarningsModal}
        onArrived={handleArrived}
        onNavigate={handleNavigate}
        onReCenter={handleReCenter}
        onCall={handleCall}
        onChat={handleOpenChat}
        onCancel={handleCancelRide}
        onStartDropoff={handleCompletePickup}
        onCompleteRide={completeRide}
        onShowRating={handleCompleteDelivery}
        swipeResetKey={swipeResetKey}
      />



      {/* Earnings Modal */}
      <EarningsModal
        visible={showEarningsModal}
        tripId={rideData?.trip_number || '#0001'}
        amount={currentOrderEarnings || '0.00'}
        customerName={rideData?.passengerName || 'Kelsey'}
        onDone={handleEarningsDone}
      />

      {/* Chat Modal */}
      <ChatModal
        visible={showChatModal}
        customerName={rideData?.passengerName || 'Customer'}
        onClose={handleCloseChat}
      />

      {!isActive && !showRideRequests && (
        <BottomSheetComponent
          key={`sheet-${gpsReady ? 'ready' : 'not-ready'}`}
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
          animatedPosition={animatedPosition}
          handleSheetChange={handleSheetChange}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          sheetIndex={sheetIndex}
          setSheetIndex={setSheetIndex}
          animateChevron={animateChevron}
          chevronRot={chevronRot}
          dotPulse={dotPulse}
          activeRide={rideData}
          locationReady={locationReady}
          gpsReady={gpsReady}
          location={location}
        >
          <StatsContent colors={colors} />
        </BottomSheetComponent>
      )}
    </View>
  );
} 