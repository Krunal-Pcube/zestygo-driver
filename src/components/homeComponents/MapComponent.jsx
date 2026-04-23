/**
 * MapComponent.js
 * Full-screen map with:
 *  - Uber-style animated driver marker (smooth movement + shortest-arc heading)
 *  - Pickup marker for active ride
 *  - Floating buttons that track bottom sheet position
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Text, ActivityIndicator, AppState } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MapPin, LocateFixed, PersonStanding, UtensilsCrossed, Home, Store, Info } from 'lucide-react-native';
import Svg, { Polygon, Circle, G } from 'react-native-svg';
import { RIDE_STEPS, STEP_CONFIG } from '../../hooks/useRideState';
import { colors, useTheme } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';
import LottieView from 'lottie-react-native';

/* ════════════════════════════════════════════════════════════════
   Map Styles for Light/Dark Themes
   ════════════════════════════════════════════════════════════════ */
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

const lightMapStyle = []; // Empty for default light theme

/* ════════════════════════════════════════════════════════════════
   Uber-Style Driver Marker
   ─ Dark filled outer circle with a clean white inner ring
   ─ Bold arrow inside pointing in heading direction
   ─ Subtle transparent halo ring around the whole thing
   ════════════════════════════════════════════════════════════════ */
const DriverMarker = ({ coordinate, heading, cameraHeading }) => {

  /* ── Smooth coordinate interpolation (600 ms glide) ─────────── */
  const animLat = useRef(new Animated.Value(coordinate.latitude)).current;
  const animLng = useRef(new Animated.Value(coordinate.longitude)).current;

  /* ── Shortest-arc heading animation ─────────────────────────── */
  const animHeading = useRef(new Animated.Value(heading)).current;
  const prevHeadingRef = useRef(heading);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animLat, {
        toValue: coordinate.latitude,
        duration: 600,
        useNativeDriver: false, // lat/lng cannot use native driver
      }),
      Animated.timing(animLng, {
        toValue: coordinate.longitude,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, [coordinate.latitude, coordinate.longitude]);

  useEffect(() => {
    // Shortest-arc: prevents 350° spin when crossing 0°/360°
    const prev = prevHeadingRef.current;
    let delta = heading - (prev % 360);
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const next = prev + delta;
    prevHeadingRef.current = next;

    Animated.timing(animHeading, {
      toValue: next,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [heading]);

  /* ── Rotate style: real heading minus camera bearing ─────────── */
  const rotateStyle = {
    transform: [
      {
        rotate: animHeading.interpolate({
          inputRange: [-360, 0, 360, 720],
          outputRange: [
            `${-cameraHeading - 360}deg`,
            `${-cameraHeading}deg`,
            `${-cameraHeading + 360}deg`,
            `${-cameraHeading + 720}deg`,
          ],
        }),
      },
    ],
  };

  return (
    <Marker.Animated
      coordinate={{ latitude: animLat, longitude: animLng }}
      anchor={{ x: 0.5, y: 0.5 }}
      flat
      tracksViewChanges={false}
    >
      <Animated.View style={[markerStyles.wrapper, rotateStyle]}>

        {/* ── Outer transparent halo ── */}
        {/* <View style={markerStyles.halo} /> */}

        {/* ── Main dark circle ── */}
        <View style={markerStyles.outerCircle}>

          {/* ── White inner ring ── */}
          <View style={markerStyles.innerRing}>

            {/* ── Arrow SVG (sharp, bold) ── */}
            <Svg
              width={scale(22)}
              height={scale(22)}
              viewBox="0 0 24 24"
            >
              {/* Bold upward arrow — rotated by parent Animated.View */}
              <Polygon
                points="12,2 20,20 12,15 4,20"
                fill={colors.secondary}
                strokeLinejoin="round"
              />
            </Svg>

          </View>
        </View>
      </Animated.View>
    </Marker.Animated>
  );
}

/* ════════════════════════════════════════════════════════════════
   Restaurant Marker (Green with store icon)
   ════════════════════════════════════════════════════════════════ */
const RestaurantMarker = ({ coordinate, name }) => {
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 1 }} title={name}>
      <View style={markerStyles.restaurantWrapper}>
        <View style={markerStyles.restaurantCircle}>
          <Store size={moderateScale(16)} color={colors.white} />
        </View>
        <View style={markerStyles.restaurantStem} />
        <View style={markerStyles.restaurantTip} />
      </View>
    </Marker>
  );
}

/* ════════════════════════════════════════════════════════════════
   Customer Marker (Orange with home icon)
   ════════════════════════════════════════════════════════════════ */
const CustomerMarker = ({ coordinate, name }) => {
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 1 }} title={name}>
      <View style={markerStyles.customerWrapper}>
        <View style={markerStyles.customerCircle}>
          <Home size={moderateScale(16)} color={colors.white} />
        </View>
        <View style={markerStyles.customerStem} />
        <View style={markerStyles.customerTip} />
      </View>
    </Marker>
  );
}

/* ════════════════════════════════════════════════════════════════
   Marker Styles
   ════════════════════════════════════════════════════════════════ */
const OUTER = scale(46);
const INNER = scale(34);
const HALO = scale(62);

const markerStyles = StyleSheet.create({
  wrapper: {
    width: HALO,
    height: HALO,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Transparent blue-tinted halo ring */
  halo: {
    position: 'absolute',
    width: HALO,
    height: HALO,
    borderRadius: HALO / 2,
    backgroundColor: 'rgba(30, 41, 59, 0.10)',
  },

  /* Dark filled outer circle */
  outerCircle: {
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    /* Crisp shadow so the marker pops off the map */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 6,
    elevation: 10,
  },

  /* White inner ring — creates the 2-tone Uber look */
  innerRing: {
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Restaurant Marker ── */
  restaurantWrapper: {
    alignItems: 'center',
  },
  restaurantCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.white,
  },
  restaurantStem: {
    width: scale(3),
    height: scale(10),
    backgroundColor: colors.green,
  },
  restaurantTip: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.green,
  },

  /* ── Customer Marker ── */
  customerWrapper: {
    alignItems: 'center',
  },
  customerCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.white,
  },
  customerStem: {
    width: scale(3),
    height: scale(10),
    backgroundColor: colors.orange,
  },
  customerTip: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.orange,
  },

  /* ── Pickup marker ── */
  pickupWrapper: {
    alignItems: 'center',
  },
  pickupCircle: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  pickupDot: {
    width: scale(14),
    height: scale(14),
    borderRadius: scale(7),
    backgroundColor: colors.white,
  },
  pickupStem: {
    width: scale(3),
    height: scale(10),
    backgroundColor: colors.green,
  },
  pickupTip: {
    width: scale(6),
    height: scale(6),
    borderRadius: Math.floor(scale(3)),
    backgroundColor: colors.green,
  },
});
export default function MapComponent({
  location,
  heading,
  cameraHeading,
  setCameraHeading,
  activeRide,
  deliveryStep,
  currentStopIndex = 0, // Multi-order: current stop index
  isOnline,
  floatBtnOffset,
  animatedPosition,
  mapRef,
  handleLocate,
  onMapClick,
  onPanDrag,
}) {
  const { isDarkMode } = useTheme();

  const floatBtnStyle = useAnimatedStyle(() => ({
    top: animatedPosition.value - floatBtnOffset,
  }));

  // Get step config for map behavior
  const stepConfig = deliveryStep ? STEP_CONFIG[deliveryStep] : null;

  // Determine what to show based on step
  const showRestaurant = stepConfig?.showRestaurantMarker ?? false;
  const showCustomer = stepConfig?.showCustomerMarker ?? false;
  const showRoute = stepConfig?.showRoute ?? 'none';
  const mapFocus = stepConfig?.mapFocus ?? 'driver';

  // Get sorted stops by sequence_number
  const sortedStops = useMemo(() => {
    if (!activeRide?.delivery_route_stops) return [];
    return [...activeRide.delivery_route_stops].sort((a, b) => a.sequence_number - b.sequence_number);
  }, [activeRide?.delivery_route_stops]);

  // Get current stop based on currentStopIndex
  const currentStop = sortedStops[currentStopIndex] || sortedStops[0] || null;

  // Get current order based on current stop
  const activeOrder = useMemo(() => {
    if (!currentStop || !activeRide?.delivery_trip_orders) return activeRide?.delivery_trip_orders?.[0] || null;
    return activeRide.delivery_trip_orders.find(
      order => order.id === currentStop.delivery_trip_order_id
    ) || activeRide?.delivery_trip_orders?.[0];
  }, [currentStop, activeRide?.delivery_trip_orders]);

  // Get coordinates from current stop or order (memoized to prevent re-renders)
  const restaurantCoord = useMemo(() => {
    if (currentStop?.stop_type === 'pickup' && currentStop?.latitude) {
      return {
        latitude: parseFloat(currentStop.latitude),
        longitude: parseFloat(currentStop.longitude)
      };
    }
    if (activeOrder?.restaurant_latitude) {
      return {
        latitude: parseFloat(activeOrder.restaurant_latitude),
        longitude: parseFloat(activeOrder.restaurant_longitude)
      };
    }
    return null;
  }, [currentStop, activeOrder]);

  const customerCoord = useMemo(() => {
    if (currentStop?.stop_type === 'drop' && currentStop?.latitude) {
      return {
        latitude: parseFloat(currentStop.latitude),
        longitude: parseFloat(currentStop.longitude)
      };
    }
    if (activeOrder?.order?.order_address?.latitude) {
      return {
        latitude: parseFloat(activeOrder.order.order_address.latitude),
        longitude: parseFloat(activeOrder.order.order_address.longitude)
      };
    }
    return null;
  }, [currentStop, activeOrder]);

  // Camera focus effect - animate to different points based on step
  useEffect(() => {
    if (!mapRef.current || !activeRide) return;

    let targetCoord = location;

    switch (mapFocus) {
      case 'restaurant':
        targetCoord = restaurantCoord || location;
        break;
      case 'customer':
        targetCoord = customerCoord || location;
        break;
      case 'driver':
      default:
        targetCoord = location;
    }

    if (!targetCoord) return;

    // Animate camera to target
    mapRef.current.animateCamera(
      {
        center: targetCoord,
        heading: mapFocus === 'driver' ? heading : 0,
        pitch: 0,

      },
      { duration: 300 }
    );
  }, [mapFocus, activeRide, location,]);

  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Decode Google Maps polyline into array of coordinates
  const decodePolyline = useCallback((encoded) => {
    const poly = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return poly;
  }, []);



  const routeCacheRef = useRef({});
  const currentDestKeyRef = useRef(null);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAN2cTEOnOBmPIXmNtBWen5db7Xl0aEOPk';

  const fetchRoute = useCallback(async (origin, destination) => {
    if (!origin || !destination) return;
    

    const destKey = `${destination.latitude.toFixed(4)},${destination.longitude.toFixed(4)}`;

    // Already cached in memory? Use instantly, no API call
    if (routeCacheRef.current[destKey]) {
      setRouteCoordinates(routeCacheRef.current[destKey]);
      return;
    }

    // Same destination already fetching/fetched? Skip
    if (currentDestKeyRef.current === destKey) return;
    currentDestKeyRef.current = destKey;

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destStr = `${destination.latitude},${destination.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes?.length > 0) {
        const decoded = decodePolyline(data.routes[0].overview_polyline.points);
        routeCacheRef.current[destKey] = decoded; // cache it
        setRouteCoordinates(decoded);
        console.log('[DIRECTIONS] Fetched & cached route for:', destKey);
      } else {
        setRouteCoordinates([origin, destination]);
      }
    } catch (error) {
      console.error('[DIRECTIONS] Error:', error);
      setRouteCoordinates([origin, destination]);
    }
  }, [decodePolyline]);

 

  // Clear route when step changes to prevent showing old path
 useEffect(() => {
  setRouteCoordinates([]);
  currentDestKeyRef.current = null;

    if (!activeRide) {
    routeCacheRef.current = {};
  }

}, [showRoute, activeRide]);

  // Fetch route ONCE when destination changes — NOT on every location update
  useEffect(() => {
    if (!activeRide || !location) {
      setRouteCoordinates([]);
      return;
    }
 
    let destination;
    switch (showRoute) {
      case 'driver_to_restaurant':
        destination = restaurantCoord;
        break;
      case 'driver_to_customer':
        destination = customerCoord;
        break;
      default:
        setRouteCoordinates([]);
        currentDestKeyRef.current = null; // reset so next step fetches fresh
        return;
    }

    if (!destination) return;

    fetchRoute(location, destination);

  }, [showRoute, restaurantCoord, customerCoord, activeRide, location]);
  // ✅ location in deps — needed to fetch when app reopens and location becomes available


  const hasActiveRide = deliveryStep && deliveryStep !== RIDE_STEPS.IDLE && deliveryStep !== RIDE_STEPS.COMPLETED;


  if (!location || !location.latitude || !location.longitude) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBox}>
          <LottieView
            source={require('../../assets/loading_map.json')} // 
            autoPlay
            loop
            style={{ width: scale(250), height: scale(100) }}
          />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.mapContainer}
        onPress={onMapClick}
        activeOpacity={1}
      >
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={isDarkMode ? darkMapStyle : lightMapStyle}
          showsUserLocation={false}
          followsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={false}
          rotateEnabled={true}
          onPanDrag={onPanDrag}
          minZoomLevel={13} 
          onRegionChangeComplete={(region) => {
            if (region.heading !== undefined) {
              setCameraHeading(region.heading);
            }
          }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
          }}
        >
          {/* Driver Marker */}
          <DriverMarker
            coordinate={location}
            heading={heading}
            cameraHeading={cameraHeading}
          />

          {/* Restaurant Marker - shown during pickup phase */}
          {showRestaurant && restaurantCoord && (
            <RestaurantMarker
              coordinate={restaurantCoord}
              name={activeOrder?.restaurant_name || 'Restaurant'}
            />
          )}

          {/* Customer Marker - shown during delivery phase */}
          {showCustomer && customerCoord && (
            <CustomerMarker
              coordinate={customerCoord}
              name={activeOrder?.customer_name || 'Customer'}
            />
          )}

          {/* Route Line */}
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor={isDarkMode ? '#FFFFFF' : colors.blue}
            />
          )}
        </MapView>
      </TouchableOpacity>


      {/* ── Floating Action Buttons ── */}
      <ReAnimated.View
        style={[
          styles.floatRow,
          floatBtnStyle,
          { zIndex: hasActiveRide ? 1 : 9 }
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.floatLeft}>

        </View>
        <View style={styles.floatRight}>
          {!hasActiveRide && (
            <TouchableOpacity activeOpacity={0.7} style={styles.mapBtn} onPress={handleLocate}>
              <LocateFixed size={moderateScale(22)} color={colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </ReAnimated.View>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  floatRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    zIndex: 9,
  },
  floatLeft: {
    width: scale(48),
    alignItems: 'flex-start',
  },
  floatRight: {
    width: scale(48),
    alignItems: 'flex-end',
  },
  mapBtn: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.veryLightGrey,
  },
  tapHintContainer: {
    position: 'absolute',
    top: verticalScale(100),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 8,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    gap: scale(6),
  },
  tapHintText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.medium,
    color: colors.secondary,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    alignItems: 'center',
    gap: verticalScale(16),
  },
  loadingText: {
    fontSize: moderateScale(16),
    fontFamily: fonts.semiBold,
    color: colors.secondary,
  },
});