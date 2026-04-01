/**
 * RideArrivingComponent.jsx
 * UI for when driver is approaching pickup location
 * - Shows arrival status and "I've Arrived" button
 * - Animated pulse effect when near pickup
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MapPin, Navigation, Phone, User, Star, CheckCircle } from 'lucide-react-native';
import { colors } from '../../utils/colors';

/* ════════════════════════════════════════════════════════════════
   Distance Calculator (Haversine formula)
   ════════════════════════════════════════════════════════════════ */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ════════════════════════════════════════════════════════════════
   Arrival Status Badge
   ════════════════════════════════════════════════════════════════ */
function ArrivalStatusBadge({ distance, hasArrived }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!hasArrived && distance <= 0.3) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }

    return () => {
      pulseAnim.stopAnimation();
    };
  }, [distance, hasArrived]);

  const getStatusColor = () => {
    if (hasArrived) return colors.green;
    if (distance <= 0.1) return colors.orange;
    if (distance <= 0.3) return colors.blue;
    return colors.grey;
  };

  const getStatusText = () => {
    if (hasArrived) return 'Driver Arrived';
    if (distance <= 0.1) return 'Very close to pickup';
    if (distance <= 0.3) return 'Approaching pickup';
    return `${distance.toFixed(1)} mi to pickup`;
  };

  return (
    <View style={styles.statusBadge}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: getStatusColor(),
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.3],
              outputRange: [0.5, 0],
            }),
          },
        ]}
      />
      <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
      <Text style={[styles.statusText, { color: getStatusColor() }]}>
        {getStatusText()}
      </Text>
    </View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Passenger Info Card
   ════════════════════════════════════════════════════════════════ */
function PassengerInfoCard({ ride }) {
  return (
    <View style={styles.passengerCard}>
      <View style={styles.passengerAvatar}>
        <User size={moderateScale(28)} color={colors.white} />
      </View>
      <View style={styles.passengerDetails}>
        <Text style={styles.passengerName}>{ride.passengerName}</Text>
        <View style={styles.ratingRow}>
          <Star size={moderateScale(12)} color={colors.orange} fill={colors.orange} />
          <Text style={styles.ratingText}>{ride.rating}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.rideTypeText}>
            {ride.type === 'match' ? 'Shared Ride' : 'Standard Ride'}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callButton} activeOpacity={0.7}>
        <Phone size={moderateScale(20)} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Pickup Location Card
   ════════════════════════════════════════════════════════════════ */
function PickupLocationCard({ address }) {
  return (
    <View style={styles.locationCard}>
      <View style={styles.locationIcon}>
        <MapPin size={moderateScale(20)} color={colors.white} />
      </View>
      <View style={styles.locationDetails}>
        <Text style={styles.locationLabel}>Pickup Location</Text>
        <Text style={styles.locationAddress} numberOfLines={2}>{address}</Text>
      </View>
    </View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Arrival Button
   ════════════════════════════════════════════════════════════════ */
function ArrivalButton({ onPress, hasArrived, distance }) {
  const isNearPickup = distance <= 0.15; // 0.15 miles = ~800 feet

  if (hasArrived) {
    return (
      <View style={[styles.arrivalButton, styles.arrivedButton]}>
        <CheckCircle size={moderateScale(20)} color={colors.white} />
        <Text style={styles.arrivalButtonText}>You Have Arrived</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.arrivalButton,
        isNearPickup ? styles.arrivalButtonActive : styles.arrivalButtonDisabled,
      ]}
      onPress={onPress}
      activeOpacity={isNearPickup ? 0.8 : 1}
      disabled={!isNearPickup}
    >
      <Navigation size={moderateScale(20)} color={colors.white} />
      <Text style={styles.arrivalButtonText}>
        {isNearPickup ? "I've Arrived" : 'Get Closer to Pickup'}
      </Text>
    </TouchableOpacity>
  );
}

/* ════════════════════════════════════════════════════════════════
   Main Ride Arriving Component
   ════════════════════════════════════════════════════════════════ */
export default function RideArrivingComponent({
  ride,
  driverLocation,
  onArrived,
  onCancel,
  hasArrived = false,
}) {
  const distance = driverLocation && ride?.pickup?.coordinate
    ? calculateDistance(
        driverLocation.latitude,
        driverLocation.longitude,
        ride.pickup.coordinate.latitude,
        ride.pickup.coordinate.longitude
      )
    : 999;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header with status */}
        <ArrivalStatusBadge distance={distance} hasArrived={hasArrived} />

        {/* Passenger info */}
        <PassengerInfoCard ride={ride} />

        {/* Pickup location */}
        <PickupLocationCard address={ride.pickup.address} />

        {/* Distance indicator */}
        {!hasArrived && (
          <View style={styles.distanceRow}>
            <Text style={styles.distanceLabel}>Distance to pickup:</Text>
            <Text style={styles.distanceValue}>{distance.toFixed(2)} miles</Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          </TouchableOpacity>

          <ArrivalButton
            onPress={onArrived}
            hasArrived={hasArrived}
            distance={distance}
          />
        </View>
      </View>
    </View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: verticalScale(100),
    left: scale(16),
    right: scale(16),
    zIndex: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: scale(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.veryLightGrey,
  },

  /* Status Badge */
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    paddingVertical: verticalScale(8),
    backgroundColor: colors.background,
    borderRadius: moderateScale(12),
  },
  pulseRing: {
    position: 'absolute',
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
  },
  statusDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    marginRight: scale(8),
  },
  statusText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },

  /* Passenger Card */
  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    padding: scale(12),
    backgroundColor: colors.background,
    borderRadius: moderateScale(12),
  },
  passengerAvatar: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerDetails: {
    flex: 1,
    marginLeft: scale(12),
  },
  passengerName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.secondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(2),
  },
  ratingText: {
    fontSize: moderateScale(12),
    color: colors.grey,
    marginLeft: scale(4),
  },
  dotSeparator: {
    fontSize: moderateScale(12),
    color: colors.grey,
    marginHorizontal: scale(6),
  },
  rideTypeText: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },
  callButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Location Card */
  locationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
    padding: scale(12),
    backgroundColor: colors.background,
    borderRadius: moderateScale(12),
  },
  locationIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDetails: {
    flex: 1,
    marginLeft: scale(12),
  },
  locationLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationAddress: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.secondary,
    marginTop: verticalScale(2),
  },

  /* Distance Row */
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(4),
  },
  distanceLabel: {
    fontSize: moderateScale(13),
    color: colors.grey,
  },
  distanceValue: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.secondary,
  },

  /* Action Buttons */
  actions: {
    flexDirection: 'row',
    gap: scale(12),
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    backgroundColor: colors.veryLightGrey,
  },
  cancelButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.red,
  },
  arrivalButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
  },
  arrivalButtonActive: {
    backgroundColor: colors.green,
  },
  arrivalButtonDisabled: {
    backgroundColor: colors.grey,
  },
  arrivedButton: {
    backgroundColor: colors.secondary,
  },
  arrivalButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: colors.white,
  },
});

export { calculateDistance };
