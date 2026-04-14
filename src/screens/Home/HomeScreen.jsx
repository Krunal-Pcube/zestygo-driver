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
  Vibration,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';
import { useSharedValue } from 'react-native-reanimated';
import { verticalScale } from 'react-native-size-matters';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { getVibrationSetting, getScreenFlashSetting } from '../../utils/accessibilityStorage';
import RideRequestCard from '../../components/homeComponents/Riderequestcard';
import HomeHeader from '../../components/homeComponents/homeHeader';
import MapComponent from '../../components/homeComponents/MapComponent';
import BottomSheetComponent from '../../components/homeComponents/bottomsheetComponent';
import ActiveRideBottomSheet from '../../components/homeComponents/ActiveRideBottomSheet';
import { RatingModal, EarningsModal, ChatModal } from '../../components/homeComponents/TripCompletionModals';
import StatsContent from '../../components/homeComponents/StatsContent';
import useRideState from '../../hooks/useRideState';
import { changeLocationController } from '../../MVC/controllers/driverStatusController';
import { requestLocationPermission, checkAndPromptGPSEnabled } from '../../utils/gpsHelpers';
import styles from '../../components/homeComponents/HomeScreenStyles';

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
    startRide,
    arriveAtPickup,
    startDropoff,
    arriveAtDropoff,
    completeRide,
    cancelRide,
  } = useRideState();

  const [isOnline, setIsOnline] = useState(false);
  const [earnings] = useState(154.75);
  const [notificationCount, setNotificationCount] = useState(2); // TODO: Fetch from API
  const [rideRequests, setRideRequests] = useState([]);
  const [showRideRequests, setShowRideRequests] = useState(false);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [screenFlashAnim] = useState(new Animated.Value(0));
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [locationReady, setLocationReady] = useState(false);
  const [gpsReady, setGpsReady] = useState(false);
  const [cameraHeading, setCameraHeading] = useState(0);
  const [showLowBatteryAlert, setShowLowBatteryAlert] = useState(false);

  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const chevronRot = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;
  const watchIdRef = useRef(null);

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

          // Follow driver; camera stays north-up (marker rotates instead)
          mapRef.current?.animateCamera(
            { center: { latitude, longitude }, heading: 0, zoom: 16 },
            { duration: 600 },
          );
        },
        err => console.warn('[GPS] watchPosition error:', err),
        {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 3, // metres
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

  /* ── Fake ride requests while online ─────────────────────────── */
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.4 && !rideData) generateNewRide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isOnline, rideData]);

  /* ── Update location to backend every minute when online ──── */
  useEffect(() => {
    let interval;

    const updateLocation = async () => {
      if (!isOnline || !location?.latitude || !location?.longitude) {
        return;
      }

      const payload = {
        current_latitude: location.latitude.toString(),
        current_longitude: location.longitude.toString(),
      };

      try {
        await changeLocationController({
          payload,
          onLocationUpdate: (updatedData) => {
            console.log('[Location] Updated on server:', updatedData);
          },
        });
      } catch (error) {
        console.log('[Location] Update failed:', error);
      }
    };

    // Update immediately when going online
    if (isOnline) {
      updateLocation();
    }

    // Then update every 60 seconds
    interval = setInterval(updateLocation, 60000);

    return () => clearInterval(interval);
  }, [isOnline, location]);

  /* ── Monitor battery level ──────────────────────────────────── */
  useEffect(() => {
    let interval;

    const checkBattery = async () => {
      try {
        const level = await DeviceInfo.getBatteryLevel();
        const batteryPercent = level * 100;

        // Show alert if battery is below 20% and not already shown
        if (batteryPercent <= 20 && batteryPercent > 0 && !showLowBatteryAlert) {
          setShowLowBatteryAlert(true);
          Alert.alert(
            'Low Battery Warning',
            `Your battery is at ${Math.round(batteryPercent)}%. Please charge your device to continue using the app.`,
            [
              {
                text: 'OK',
                onPress: () => setShowLowBatteryAlert(false)
              }
            ]
          );
        }
      } catch (error) {
        console.log('[Battery] Error checking battery level:', error);
      }
    };

    // Check immediately
    checkBattery();

    // Check every 60 seconds
    interval = setInterval(checkBattery, 60000);

    return () => clearInterval(interval);
  }, [showLowBatteryAlert]);

  /* ── Chevron follows sheet index ─────────────────────────────── */
  useEffect(() => {
    Animated.timing(chevronRot, {
      toValue: sheetIndex === 1 ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [sheetIndex]);

  /* ── Generate fake ride ───────────────────────────────────────── */
  const generateNewRide = async () => {
    const streets = ['Main St', 'Oak Ave', 'Park Rd', 'Elm St'];
    const avenues = ['Broadway', '5th Ave', 'Market St', 'Beach Rd'];
    const names = ['John', 'Sarah', 'Mike', 'Emma', 'David'];
    const phoneNumbers = ['+1234567890', '+1987654321', '+1555123456', '+1444555666', '+1777888999'];

    const newRide = {
      id: Date.now(),
      type: Math.random() > 0.5 ? 'match' : 'accept',
      passengerName: names[Math.floor(Math.random() * names.length)],
      phoneNumber: phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      fare: Math.floor(Math.random() * 25 + 12),
      duration: Math.floor(Math.random() * 20 + 10),
      pickup: {
        name: 'Dave\'s Hot Chicken',
        address: `${Math.floor(Math.random() * 9999)} ${streets[Math.floor(Math.random() * streets.length)]}`,
        distance: (Math.random() * 2 + 0.5).toFixed(1),
        eta: Math.floor(Math.random() * 8 + 3),
        coordinate: {
          latitude: location.latitude + (Math.random() - 0.5) * 0.02,
          longitude: location.longitude + (Math.random() - 0.5) * 0.02,
        },
      },
      dropoff: {
        address: `${Math.floor(Math.random() * 9999)} ${avenues[Math.floor(Math.random() * avenues.length)]}`,
        distance: (Math.random() * 8 + 2).toFixed(1),
        coordinate: {
          latitude: location.latitude + (Math.random() - 0.5) * 0.05,
          longitude: location.longitude + (Math.random() - 0.5) * 0.05,
        },
      },
    };

    setRideRequests(prev => [...prev, newRide]);
    setShowRideRequests(true);

    // Vibrate if accessibility setting is enabled
    const shouldVibrate = await getVibrationSetting();
    if (shouldVibrate) {
      Vibration.vibrate(500);
    }

    // Screen flash if accessibility setting is enabled
    const shouldFlash = await getScreenFlashSetting();
    if (shouldFlash) {
      Animated.sequence([
        Animated.timing(screenFlashAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(screenFlashAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const acceptRide = (ride) => {
    startRide(ride);
    setRideRequests(prev => prev.filter(r => r.id !== ride.id));
    setShowRideRequests(false);
  };

  const declineRide = (rideId) => {
    setRideRequests(prev => prev.filter(r => r.id !== rideId));
    if (rideRequests.length <= 1) {
      setShowRideRequests(false);
    }
  };

  const handleArrived = () => {
    arriveAtPickup();
    console.log('[RIDE] Driver arrived at pickup location');
  };

  const handleNavigate = useCallback(async () => {
    if (!rideData || !location) {
      Alert.alert('Error', 'Location or ride data not available');
      return;
    }

    let destination;
    if (currentStep === 'going_to_pickup' || currentStep === 'arrived_at_pickup') {
      destination = rideData.pickup?.coordinate;
    } else if (currentStep === 'going_to_dropoff' || currentStep === 'arrived_at_dropoff') {
      destination = rideData.dropoff?.coordinate;
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
  }, [rideData, location, currentStep]);

  const handleCancelRide = (reason) => {
    console.log('[RIDE] Cancel reason:', reason);
    cancelRide();
  };

  const handleCallCustomer = useCallback(async () => {
    const phoneNumber = rideData?.phoneNumber;
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }

    try {
      await Linking.openURL(`tel:${phoneNumber}`);
      console.log('[CALL] Calling customer:', phoneNumber);
    } catch (error) {
      console.error('[CALL] Error making phone call:', error);
      Alert.alert('Error', 'Failed to make phone call');
    }
  }, [rideData]);

  const animateChevron = useCallback((toIndex) => setSheetIndex(toIndex), []);
  const handleSheetChange = useCallback((index) => setSheetIndex(index), []);

  /* ── Re-center on real GPS location ──────────────────────────── */
  const handleLocate = useCallback(() => {
    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        mapRef.current?.animateCamera(
          { center: { latitude, longitude }, heading: 0, pitch: 0, zoom: 17 },
          { duration: 700 },
        );
      },
      err => {
        console.warn('[GPS] handleLocate error:', err);
        mapRef.current?.animateCamera(
          { center: location, heading: 0, zoom: 17 },
          { duration: 500 },
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 3000 },
    );
  }, [location]);

  const handleMapClick = useCallback(() => {
  }, [navigation, rideData, location]);

  const handleShowRating = useCallback(() => {
    setShowRatingModal(true);
  }, []);

  const handleRatingSubmit = useCallback(() => {
    setShowRatingModal(false);
    setShowEarningsModal(true);
  }, []);

  const handleCloseRatingModal = useCallback(() => {
    setShowRatingModal(false);
    setShowEarningsModal(true);
  }, []);

  const handleOpenChat = useCallback(() => {
    setShowChatModal(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setShowChatModal(false);
  }, []);

  const handleEarningsDone = useCallback(() => {
    setShowEarningsModal(false);
    completeRide();
  }, [completeRide]);

  const handleViewTripDetails = useCallback(() => {
    setShowEarningsModal(false);
    completeRide();
    navigation.navigate('TripDetails', {
      tripId: '#0001',
      amount: '18.05',
      customerName: rideData?.passengerName || 'Kelsey',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: '40 min 25 sec',
      distance: '11 km',
      vehicleType: 'Bike',
      paymentMethod: 'Cash',
      pickup: {
        address: rideData?.pickup?.address?.split(',')[0] || '1582 Queen St W',
        city: rideData?.pickup?.address?.split(',')[1] || 'Toronto, ON M6R 1A6, Canada',
      },
      dropoff: {
        address: rideData?.dropoff?.address?.split(',')[0] || '825 Caledonia Rd',
        city: rideData?.dropoff?.address?.split(',')[1] || 'North York, ON M6B 3X8, Canada',
      },
      fare: '18.06',
      taxes: '0.1',
      totalEarning: '18.05',
      payouts: '18.05',
    });
  }, [navigation, rideData, completeRide]);

  return (
    <View style={{ flex: 1 }}>
      {/* Screen flash overlay for accessibility */}
      <Animated.View
        style={[
          styles.screenFlashOverlay,
          { opacity: screenFlashAnim }
        ]}
        pointerEvents="none"
      />

      <HomeHeader navigation={navigation} earnings={earnings} notificationCount={notificationCount} />

      <MapComponent
        key={`map-${isFocused ? 'focused' : 'blurred'}`}
        location={location}
        heading={heading}
        cameraHeading={cameraHeading}
        setCameraHeading={setCameraHeading}
        activeRide={rideData}
        deliveryStep={currentStep}
        isOnline={isOnline}
        floatBtnOffset={floatBtnOffset}
        animatedPosition={animatedPosition}
        mapRef={mapRef}
        handleLocate={handleLocate}
        onMapClick={handleMapClick}
      />

      <RideRequestCard
        ride={rideRequests[0]}
        visible={showRideRequests && rideRequests.length > 0}
        onAccept={acceptRide}
        onDecline={() => declineRide(rideRequests[0]?.id)}
        duration={14}
      />

      <ActiveRideBottomSheet
        ride={rideData}
        driverLocation={location}
        rideStep={currentStep}
        isVisible={isActive && !showRatingModal && !showEarningsModal}
        onArrived={handleArrived}
        onNavigate={handleNavigate}
        onCall={() => handleCallCustomer()}
        onChat={handleOpenChat}
        onCancel={handleCancelRide}
        onStartDropoff={startDropoff}
        onCompleteRide={completeRide}
        onShowRating={handleShowRating}
      />

      {/* Rating Modal */}
      <RatingModal
        visible={showRatingModal}
        customerName={rideData?.passengerName || 'Kelsey Lavin'}
        onSubmit={handleRatingSubmit}
        onClose={handleCloseRatingModal}
      />

      {/* Earnings Modal */}
      <EarningsModal
        visible={showEarningsModal}
        tripId="#0001"
        amount="18.05"
        customerName={rideData?.passengerName || 'Kelsey'}
        onDone={handleEarningsDone}
        onViewDetails={handleViewTripDetails}
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