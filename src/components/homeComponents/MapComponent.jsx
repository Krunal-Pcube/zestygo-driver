/**
 * MapComponent.js
 * Full-screen map with:
 *  - Uber-style animated driver marker (smooth movement + shortest-arc heading)
 *  - Pickup marker for active ride
 *  - Floating buttons that track bottom sheet position
 */

import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import ReAnimated, { useAnimatedStyle } from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MapPin, LocateFixed, PersonStanding } from 'lucide-react-native';
import Svg, { Polygon, Circle, G } from 'react-native-svg';
import { colors } from '../../utils/colors';

/* ════════════════════════════════════════════════════════════════
   Uber-Style Driver Marker
   ─ Dark filled outer circle with a clean white inner ring
   ─ Bold arrow inside pointing in heading direction
   ─ Subtle transparent halo ring around the whole thing
   ════════════════════════════════════════════════════════════════ */
function DriverMarker({ coordinate, heading, cameraHeading }) {

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
        <View style={markerStyles.halo} />

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
   Pickup Marker  (shown when a ride is active)
   ─ Green pin with a white dot center — clean & minimal
   ════════════════════════════════════════════════════════════════ */
function PickupMarker({ coordinate }) {
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 1 }}>
      <View style={markerStyles.pickupWrapper}>
        {/* Circle pin */}
        <View style={markerStyles.pickupCircle}>
          <View style={markerStyles.pickupDot} />
        </View>
        {/* Stem */}
        <View style={markerStyles.pickupStem} />
        {/* Tip dot */}
        <View style={markerStyles.pickupTip} />
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
    borderRadius: scale(3),
    backgroundColor: colors.green,
  },
});

/* ════════════════════════════════════════════════════════════════
   Map Component
   ════════════════════════════════════════════════════════════════ */
export default function MapComponent({
  location,
  heading,
  cameraHeading,
  setCameraHeading,
  activeRide,
  isOnline,
  floatBtnOffset,
  animatedPosition,
  mapRef,
  handleLocate,
}) {
  const floatBtnStyle = useAnimatedStyle(() => ({
    top: animatedPosition.value - floatBtnOffset,
  }));

  return (
    <>
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
        <DriverMarker
          coordinate={location}
          heading={heading}
          cameraHeading={cameraHeading}
        />
        {activeRide && (
          <PickupMarker coordinate={activeRide.pickup.coordinate} />
        )}

        {/* Route line between driver and pickup */}
        {activeRide && (
          <Polyline
            coordinates={[location, activeRide.pickup.coordinate]}
            strokeColor="#1A1A1A"
            strokeWidth={4}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {/* ── Floating Action Buttons ── */}
      {!activeRide && (
        <ReAnimated.View style={[styles.floatRow, floatBtnStyle]} pointerEvents="box-none">
          <View style={styles.floatLeft}>
            {isOnline && (
              <TouchableOpacity activeOpacity={0.7} style={styles.mapBtn}>
                <PersonStanding size={moderateScale(22)} color={colors.grey} />
              </TouchableOpacity> 
            )}
          </View>
          <View style={styles.floatRight}>
            <TouchableOpacity activeOpacity={0.7} style={styles.mapBtn} onPress={handleLocate}>
              <LocateFixed size={moderateScale(22)} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        </ReAnimated.View>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
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
});