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
  Text,
  StyleSheet,
  TouchableOpacity, 
  Platform,
  Animated,
  Easing,
  Dimensions,
  Modal,
  ScrollView,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MapPin, Navigation, Navigation2, Clock, Star, CheckCircle, X, ChevronRight, Circle, Users, Car } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import AcceptenceIcon from '../assets/homeIcons/acceptence.svg';
import RatingIcon from '../assets/homeIcons/rating.svg';
import CancellationIcon from '../assets/homeIcons/cancellation.svg';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';
import RideRequestCard from '../components/homeComponents/Riderequestcard';
import HomeHeader from '../components/homeComponents/homeHeader';
import MapComponent from '../components/homeComponents/MapComponent';
import BottomSheetComponent from '../components/homeComponents/bottomsheetComponent';
import ActiveRideBottomSheet from '../components/homeComponents/ActiveRideBottomSheet';
import { RatingModal, EarningsModal } from '../components/homeComponents/TripCompletionModals';
import useRideState from '../hooks/useRideState';
const SCREEN_HEIGHT = Dimensions.get('window').height;



/* ─────────────────────────────────────────────────────────────────
   GPS PERMISSION HELPER
   @react-native-community/geolocation does NOT have a built-in
   requestAuthorization() — we handle Android manually and rely on
   the Info.plist key for iOS (no runtime call needed on iOS).
───────────────────────────────────────────────────────────────── */
async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    // iOS: permission is triggered automatically by the first
    // getCurrentPosition / watchPosition call as long as
    // NSLocationWhenInUseUsageDescription is in Info.plist.
    return true;
  }

  // Android: request explicitly
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs your location to show your position on the map.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('[GPS] Permission request error:', err);
    return false;
  }
}



/* ─────────────────────────────────────────────────────────────────
   STATS ROW
───────────────────────────────────────────────────────────────── */
const StatCell = ({ icon, value, label }) => (
  <View style={styles.statCell}>
    {icon}
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const StatsContent = () => (
  <View style={styles.statsRow}>
    <StatCell
      icon={<AcceptenceIcon width={moderateScale(24)} height={moderateScale(24)} fill={colors.blue} />}
      value="95.0%"
      label="Acceptance"
    />
    <View style={styles.statDivider} />
    <StatCell
      icon={<RatingIcon width={moderateScale(24)} height={moderateScale(24)} fill={colors.orange} />}
      value="4.75"
      label="Rating"
    />
    <View style={styles.statDivider} />
    <StatCell
      icon={<CancellationIcon width={moderateScale(24)} height={moderateScale(24)} fill={colors.red} />}
      value="2.0%"
      label="Cancellation"
    />
  </View>
);

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
  const [rideRequests, setRideRequests] = useState([]);
  const [hasArrived, setHasArrived] = useState(false);
  const [showRideRequests, setShowRideRequests] = useState(false);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [cameraHeading, setCameraHeading] = useState(0);

  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const chevronRot = useRef(new Animated.Value(0)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;
  const watchIdRef = useRef(null);

  const animatedPosition = useSharedValue(SCREEN_HEIGHT * 0.82);
  const snapPoints = useMemo(() => ['15%'], []);
  const floatBtnOffset = verticalScale(72);

  const isFocused = useIsFocused();

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
        return;
      }

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
  }, []);

  /* ── Fake ride requests while online ─────────────────────────── */
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.4 && !rideData) generateNewRide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isOnline, rideData]);

  /* ── Pulse online dot ─────────────────────────────────────────── */
  useEffect(() => {
    if (isOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotPulse, { toValue: 1.5, duration: 700, useNativeDriver: true }),
          Animated.timing(dotPulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      dotPulse.stopAnimation();
      dotPulse.setValue(1);
    }
  }, [isOnline]);

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
  const generateNewRide = () => {
    const streets = ['Main St', 'Oak Ave', 'Park Rd', 'Elm St'];
    const avenues = ['Broadway', '5th Ave', 'Market St', 'Beach Rd'];
    const names = ['John', 'Sarah', 'Mike', 'Emma', 'David'];

    const newRide = {
      id: Date.now(),
      type: Math.random() > 0.5 ? 'match' : 'accept',
      passengerName: names[Math.floor(Math.random() * names.length)],
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
  };

  const acceptRide = (ride) => {
    startRide(ride);
    setRideRequests(prev => prev.filter(r => r.id !== ride.id));
    setShowRideRequests(false);
  };

  const declineRide = (rideId) => {
    setRideRequests(prev => {
      const updated = prev.filter(r => r.id !== rideId);
      if (updated.length === 0) setShowRideRequests(false);
      return updated;
    });
  };

  const handleArrived = () => {
    arriveAtPickup();
    console.log('[RIDE] Driver arrived at pickup location');
  };

  const handleCompletePickup = () => {
    // Handle pickup completion - transition to delivery/dropoff phase
    console.log('[RIDE] Pickup completed');
    setHasArrived(false);
    // Could transition to showing dropoff/delivery screen here
  };

  const handleCancelRide = (reason) => {
    console.log('[RIDE] Cancel reason:', reason);
    cancelRide();
  };

  const toggleOnline = useCallback(() => {
    setIsOnline(prev => {
      if (prev) {
        setRideRequests([]);
        setHasArrived(false);
      }
      return !prev;
    });
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

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
        // Fallback to last known position
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

  const handleEarningsDone = useCallback(() => {
    setShowEarningsModal(false);
    completeRide();
  }, [completeRide]);

  const handleViewTripDetails = useCallback(() => {
    setShowEarningsModal(false);
    // Complete the ride so bottom sheet doesn't show when returning
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

      <HomeHeader navigation={navigation} earnings={earnings} />

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
        onNavigate={() => console.log('[NAV] Starting navigation')}
        onCall={() => console.log('[CALL] Calling customer')}
        onChat={() => console.log('[CHAT] Opening chat')}
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

      {!isActive && (
        <BottomSheetComponent
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
        >
          <StatsContent />
        </BottomSheetComponent>
      )}

    </View>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({

  rideCard: {
    width: Dimensions.get('window').width - scale(32),
    backgroundColor: colors.white, borderRadius: moderateScale(16),
    padding: scale(16), marginHorizontal: scale(8),
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 8,
    borderWidth: 2, borderColor: colors.secondary,
  },
  rideCardMatch: { borderColor: colors.blue, backgroundColor: colors.background },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(12) },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.secondary, paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4), borderRadius: scale(12), gap: scale(4),
  },
  typeBadgeText: { color: colors.white, fontSize: moderateScale(12), fontFamily: fonts.bold },
  passengerInfo: { flex: 1, marginLeft: scale(12) },
  passengerName: { fontSize: moderateScale(16), fontFamily: fonts.bold, color: colors.secondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: scale(4) },
  ratingText: { fontSize: moderateScale(12), color: colors.grey },
  fare: { fontSize: moderateScale(24), fontFamily: fonts.bold, color: colors.secondary },
  fareLabel: { fontSize: moderateScale(10), color: colors.grey },
  routeBox: {
    backgroundColor: colors.background2, borderRadius: moderateScale(12),
    padding: scale(12), marginBottom: verticalScale(12),
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start' },
  dot: {
    width: scale(10), height: scale(10), borderRadius: scale(5),
    marginRight: scale(10), marginTop: scale(4),
  },
  routeLine: {
    width: scale(2), height: verticalScale(28),
    backgroundColor: colors.veryLightGrey, marginLeft: scale(4),
    marginVertical: verticalScale(4),
  },
  routeLabel: { fontSize: moderateScale(10), color: colors.grey, textTransform: 'uppercase' },
  routeAddress: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.secondary },
  routeMeta: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
  routeMetaText: { fontSize: moderateScale(11), color: colors.grey },
  cardActions: { flexDirection: 'row', gap: scale(12) },
  declineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: scale(6), paddingVertical: verticalScale(12),
    borderRadius: scale(12), backgroundColor: colors.veryLightGrey,
  },
  declineText: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.grey },
  acceptBtn: {
    flex: 2, alignItems: 'center', justifyContent: 'center',
    paddingVertical: verticalScale(12), borderRadius: scale(12),
    backgroundColor: colors.secondary,
  },
  acceptBtnMatch: { backgroundColor: colors.blue },
  acceptText: { fontSize: moderateScale(15), fontFamily: fonts.bold, color: colors.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(24), borderTopRightRadius: moderateScale(24),
    paddingTop: verticalScale(16),
    paddingBottom: Platform.OS === 'ios' ? verticalScale(40) : verticalScale(20),
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: scale(16), marginBottom: verticalScale(16),
  },
  modalTitle: { fontSize: moderateScale(20), fontFamily: fonts.bold, color: colors.secondary },
  modalSubtitle: { fontSize: moderateScale(13), color: colors.grey, marginTop: verticalScale(2) },
  modalCloseBtn: {
    width: scale(40), height: scale(40), borderRadius: scale(20),
    backgroundColor: colors.veryLightGrey, alignItems: 'center', justifyContent: 'center',
  },
  activeContainer: {
    position: 'absolute', top: verticalScale(100),
    left: scale(16), right: scale(16), zIndex: 10,
  },
  activeCard: {
    backgroundColor: colors.white, borderRadius: moderateScale(16), padding: scale(16),
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 8,
  },
  activeHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: verticalScale(12),
  },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.green, paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4), borderRadius: scale(12), gap: scale(4),
  },
  activeBadgeText: { color: colors.white, fontSize: moderateScale(12), fontFamily: fonts.bold },
  activeStatus: { fontSize: moderateScale(13), color: colors.grey },
  activeRoute: {
    flexDirection: 'row', alignItems: 'center', gap: scale(8),
    marginBottom: verticalScale(12), padding: scale(12),
    backgroundColor: colors.background2, borderRadius: moderateScale(10),
  },
  activeAddress: { flex: 1, fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.secondary },
  activeActions: { flexDirection: 'row', gap: scale(12) },
  cancelBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: verticalScale(12), borderRadius: scale(12),
    backgroundColor: colors.veryLightGrey,
  },
  cancelText: { fontSize: moderateScale(14), fontFamily: fonts.semiBold, color: colors.red },
  navigateBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: scale(6), paddingVertical: verticalScale(12),
    borderRadius: scale(12), backgroundColor: colors.secondary,
  },
  navigateText: { fontSize: moderateScale(14), fontFamily: fonts.bold, color: colors.white },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-evenly', paddingVertical: verticalScale(12),
  },
  statCell: { alignItems: 'center', gap: verticalScale(4), flex: 1 },
  statValue: { fontSize: moderateScale(16), fontFamily: fonts.bold, color: colors.secondary },
  statLabel: { fontSize: moderateScale(11), fontFamily: fonts.regular, color: colors.grey },
  statDivider: { width: 1, height: verticalScale(40), backgroundColor: colors.veryLightGrey },
  cancelIconBox: {
    width: scale(22), height: scale(22), borderRadius: scale(6),
    backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center',
  },
  waitingContainer: {
    position: 'absolute', top: verticalScale(100),
    left: 0, right: 0, alignItems: 'center', zIndex: 10,
  },
  waitingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: scale(8),
    paddingHorizontal: scale(16), paddingVertical: verticalScale(10),
    borderRadius: scale(24), backgroundColor: colors.white,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 5, elevation: 5,
  },
  pulseDot: {
    width: scale(10), height: scale(10),
    borderRadius: scale(5), backgroundColor: colors.green,
  },
  navButton: {
    position: 'absolute',
    bottom: verticalScale(180),
    right: scale(16),
    alignItems: 'center',
    zIndex: 0,
  },
  navButtonInner: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  navButtonText: {
    fontSize: moderateScale(11),
    fontFamily: fonts.semiBold,
    color: colors.secondary,
    marginTop: verticalScale(4),
    backgroundColor: colors.white,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
});