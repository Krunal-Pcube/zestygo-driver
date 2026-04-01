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
import {
  Car, Users, MapPin, Navigation, Navigation2,
  Clock, Star, CheckCircle, X,
} from 'lucide-react-native';

import { colors } from '../utils/colors';
import RideRequestCard from '../components/homeComponents/Riderequestcard';
import HomeHeader from '../components/homeComponents/homeHeader';
import MapComponent from '../components/homeComponents/MapComponent';
import BottomSheetComponent from '../components/homeComponents/bottomsheetComponent';
import RideArrivingComponent from '../components/homeComponents/RideArrivingComponent';
import ActiveRideBottomSheet from '../components/homeComponents/ActiveRideBottomSheet';
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
   ACTIVE RIDE OVERLAY
───────────────────────────────────────────────────────────────── */
const ActiveRideOverlay = ({ ride, hasArrived, onCancel }) => {
  if (!ride) return null;
  const isMatch = ride.type === 'match';

  return (
    <View style={styles.activeContainer}>
      <View style={styles.activeCard}>
        <View style={styles.activeHeader}>
          <View style={styles.activeBadge}>
            {isMatch
              ? <Users size={moderateScale(14)} color={colors.white} />
              : <Car size={moderateScale(14)} color={colors.white} />}
            <Text style={styles.activeBadgeText}>{isMatch ? 'Match' : 'Accept'} Ride</Text>
          </View>
          <Text style={styles.activeStatus}>{hasArrived ? 'Waiting at pickup' : 'Heading to pickup'}</Text>
        </View>

        <View style={styles.activeRoute}>
          <MapPin size={moderateScale(16)} color={colors.green} />
          <Text style={styles.activeAddress} numberOfLines={1}>{ride.pickup.address}</Text>
        </View>

        <View style={styles.activeActions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigateBtn}>
            <Navigation size={moderateScale(16)} color={colors.white} />
            <Text style={styles.navigateText}>Navigate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
      icon={<CheckCircle size={moderateScale(24)} color={colors.blue} />}
      value="95.0%"
      label="Acceptance"
    />
    <View style={styles.statDivider} />
    <StatCell
      icon={<Star size={moderateScale(24)} color={colors.orange} fill={colors.orange} />}
      value="4.75"
      label="Rating"
    />
    <View style={styles.statDivider} />
    <StatCell
      icon={
        <View style={styles.cancelIconBox}>
          <X size={moderateScale(13)} color={colors.white} strokeWidth={3} />
        </View>
      }
      value="2.0%"
      label="Cancellation"
    />
  </View>
);

/* ─────────────────────────────────────────────────────────────────
   MAIN HOME SCREEN
───────────────────────────────────────────────────────────────── */
export default function HomeScreen({ navigation }) {

  const [isOnline, setIsOnline] = useState(false);
  const [earnings] = useState(154.75);
  const [rideRequests, setRideRequests] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [hasArrived, setHasArrived] = useState(false);
  const [showRideRequests, setShowRideRequests] = useState(false);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [location, setLocation] = useState({ latitude: 37.3541, longitude: -121.9552 });
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
        err => console.warn('[GPS] getCurrentPosition error:', err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
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
          enableHighAccuracy: true,
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
      if (Math.random() > 0.7 && !activeRide) generateNewRide();
    }, 8000);
    return () => clearInterval(interval);
  }, [isOnline, activeRide]);

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
    setActiveRide(ride);
    setHasArrived(false);
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
    setHasArrived(true);
    console.log('[RIDE] Driver arrived at pickup location');
  };

  const handleCompletePickup = () => {
    // Handle pickup completion - transition to delivery/dropoff phase
    console.log('[RIDE] Pickup completed');
    setHasArrived(false);
    // Could transition to showing dropoff/delivery screen here
  };

  const handleCancelRide = () => {
    setActiveRide(null);
    setHasArrived(false);
  };

  const toggleOnline = useCallback(() => {
    setIsOnline(prev => {
      if (prev) {
        setRideRequests([]);
        setActiveRide(null);
        setShowRideRequests(false);
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

  return (
    <View style={{ flex: 1 }}>

      <HomeHeader navigation={navigation} earnings={earnings} />

      <MapComponent
        location={location}
        heading={heading}
        cameraHeading={cameraHeading}
        setCameraHeading={setCameraHeading}
        activeRide={activeRide}
        isOnline={isOnline}
        floatBtnOffset={floatBtnOffset}
        animatedPosition={animatedPosition}
        mapRef={mapRef}
        handleLocate={handleLocate}
      />

      <RideRequestCard
        ride={rideRequests[0]}
        visible={showRideRequests && rideRequests.length > 0}
        onAccept={acceptRide}
        onDecline={() => declineRide(rideRequests[0]?.id)}
        duration={14}
      />

      {/* Navigation Button for Active Ride - rendered before bottom sheet so it appears behind */}
      {activeRide && (
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => console.log('[NAV] Starting navigation')}
          activeOpacity={0.8}
        >
          <View style={styles.navButtonInner}>
            <Navigation size={moderateScale(18)} color={colors.blue} />
          </View>
          <Text style={styles.navButtonText}>Navigation</Text>
        </TouchableOpacity>
      )}

      <ActiveRideBottomSheet
        ride={activeRide}
        driverLocation={location}
        isVisible={!!activeRide}
        onCompletePickup={handleCompletePickup}
        onNavigate={() => console.log('[NAV] Starting navigation')}
        onCancel={handleCancelRide}
      />

      {!activeRide && (
        <BottomSheetComponent
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
          animatedPosition={animatedPosition}
          handleSheetChange={handleSheetChange}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          setRideRequests={setRideRequests}
          setActiveRide={setActiveRide}
          setShowRideRequests={setShowRideRequests}
          sheetIndex={sheetIndex}
          setSheetIndex={setSheetIndex}
          animateChevron={animateChevron}
          chevronRot={chevronRot}
          dotPulse={dotPulse}
          activeRide={activeRide}
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
  typeBadgeText: { color: colors.white, fontSize: moderateScale(12), fontWeight: '700' },
  passengerInfo: { flex: 1, marginLeft: scale(12) },
  passengerName: { fontSize: moderateScale(16), fontWeight: '700', color: colors.secondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: scale(4) },
  ratingText: { fontSize: moderateScale(12), color: colors.grey },
  fare: { fontSize: moderateScale(24), fontWeight: '800', color: colors.secondary },
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
  routeAddress: { fontSize: moderateScale(14), fontWeight: '600', color: colors.secondary },
  routeMeta: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
  routeMetaText: { fontSize: moderateScale(11), color: colors.grey },
  cardActions: { flexDirection: 'row', gap: scale(12) },
  declineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: scale(6), paddingVertical: verticalScale(12),
    borderRadius: scale(12), backgroundColor: colors.veryLightGrey,
  },
  declineText: { fontSize: moderateScale(14), fontWeight: '600', color: colors.grey },
  acceptBtn: {
    flex: 2, alignItems: 'center', justifyContent: 'center',
    paddingVertical: verticalScale(12), borderRadius: scale(12),
    backgroundColor: colors.secondary,
  },
  acceptBtnMatch: { backgroundColor: colors.blue },
  acceptText: { fontSize: moderateScale(15), fontWeight: '700', color: colors.white },
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
  modalTitle: { fontSize: moderateScale(20), fontWeight: '800', color: colors.secondary },
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
  activeBadgeText: { color: colors.white, fontSize: moderateScale(12), fontWeight: '700' },
  activeStatus: { fontSize: moderateScale(13), color: colors.grey },
  activeRoute: {
    flexDirection: 'row', alignItems: 'center', gap: scale(8),
    marginBottom: verticalScale(12), padding: scale(12),
    backgroundColor: colors.background2, borderRadius: moderateScale(10),
  },
  activeAddress: { flex: 1, fontSize: moderateScale(14), fontWeight: '600', color: colors.secondary },
  activeActions: { flexDirection: 'row', gap: scale(12) },
  cancelBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: verticalScale(12), borderRadius: scale(12),
    backgroundColor: colors.veryLightGrey,
  },
  cancelText: { fontSize: moderateScale(14), fontWeight: '600', color: colors.red },
  navigateBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: scale(6), paddingVertical: verticalScale(12),
    borderRadius: scale(12), backgroundColor: colors.secondary,
  },
  navigateText: { fontSize: moderateScale(14), fontWeight: '700', color: colors.white },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-evenly', paddingVertical: verticalScale(12),
  },
  statCell: { alignItems: 'center', gap: verticalScale(4), flex: 1 },
  statValue: { fontSize: moderateScale(16), fontWeight: '700', color: colors.secondary },
  statLabel: { fontSize: moderateScale(11), color: colors.grey },
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
    fontWeight: '600',
    color: colors.secondary,
    marginTop: verticalScale(4),
    backgroundColor: colors.white,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
});