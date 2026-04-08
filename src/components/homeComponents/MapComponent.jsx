/**
 * MapComponent.js
 * Full-screen map with:
 *  - Uber-style animated driver marker (smooth movement + shortest-arc heading)
 *  - Pickup marker for active ride
 *  - Floating buttons that track bottom sheet position
 */

import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MapPin, LocateFixed, PersonStanding, UtensilsCrossed, Home, Store, Info } from 'lucide-react-native';
import Svg, { Polygon, Circle, G } from 'react-native-svg';
import { RIDE_STEPS, STEP_CONFIG } from '../../hooks/useRideState';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';

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
              width={scale(18)}
              height={scale(18)}
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
const INNER  = scale(34);
const HALO   = scale(62);

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
  isOnline,
  floatBtnOffset,
  animatedPosition,
  mapRef,
  handleLocate,
  onMapClick,
}) {
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

  // Get coordinates
  const restaurantCoord = activeRide?.pickup?.coordinate;
  const customerCoord = activeRide?.dropoff?.coordinate;

  // Camera focus effect - animate to different points based on step
  useEffect(() => {
    if (!mapRef.current || !activeRide) return;

    let targetCoord = location;
    let zoomLevel = 16;

    switch (mapFocus) {
      case 'restaurant':
        targetCoord = restaurantCoord || location;
        zoomLevel = 17;
        break;
      case 'customer':
        targetCoord = customerCoord || location;
        zoomLevel = 17;
        break;
      case 'driver':
      default:
        targetCoord = location;
        zoomLevel = 16;
    }

    // Animate camera to target
    mapRef.current.animateCamera(
      {
        center: targetCoord,
        heading: 0,
        pitch: 0,
        zoom: zoomLevel,
      },
      { duration: 800 }
    );
  }, [mapFocus, activeRide, location, restaurantCoord, customerCoord]);

  // Determine route coordinates based on step
  const getRouteCoordinates = () => {
    if (!activeRide) return [];
    
    switch (showRoute) {
      case 'driver_to_restaurant':
        return [location, restaurantCoord].filter(Boolean);
      case 'driver_to_customer':
        return [location, customerCoord].filter(Boolean);
      case 'restaurant_to_customer':
        return [restaurantCoord, customerCoord].filter(Boolean);
      default:
        return [];
    }
  };

  const routeCoordinates = getRouteCoordinates();
  const hasActiveRide = deliveryStep && deliveryStep !== RIDE_STEPS.IDLE && deliveryStep !== RIDE_STEPS.COMPLETED;

  // Don't render map until we have a valid location
  if (!location || !location.latitude || !location.longitude) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.secondary} />
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
          showsUserLocation={false}
          followsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={false}
          rotateEnabled={true}
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
              name={activeRide?.pickup?.name || 'Restaurant'} 
            />
          )}

          {/* Customer Marker - shown during delivery phase */}
          {showCustomer && customerCoord && (
            <CustomerMarker 
              coordinate={customerCoord} 
              name={activeRide?.dropoff?.address || 'Customer'} 
            />
          )}

          {/* Route Line */}
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={showRoute === 'driver_to_restaurant' ? colors.green : colors.orange}
              strokeWidth={4}
              lineDashPattern={showRoute === 'restaurant_to_customer' ? [5, 5] : [0]}
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
          {!hasActiveRide && isOnline && (
            <TouchableOpacity activeOpacity={0.7} style={styles.mapBtn}>
              <PersonStanding size={moderateScale(22)} color={colors.grey} />
            </TouchableOpacity>
          )}
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