/**
 * ActiveRideBottomSheet.jsx
 * Bottom sheet for active ride/delivery - Full UI like screenshot
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated as RNAnimated,
} from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MapPin, Navigation, ChevronDown, ChevronRight, Phone } from 'lucide-react-native';
import { colors } from '../../utils/colors';

/* ════════════════════════════════════════════════════════════════
   Navigation FAB
   ════════════════════════════════════════════════════════════════ */
function NavigationFAB({ onPress }) {
  return (
    <TouchableOpacity style={styles.navFab} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.navFabInner}>
        <Navigation size={moderateScale(18)} color={colors.blue} />
      </View>
      <Text style={styles.navFabText}>Navigation</Text>
    </TouchableOpacity>
  );
}

/* ════════════════════════════════════════════════════════════════
   Active Ride Bottom Sheet Component
   ════════════════════════════════════════════════════════════════ */
export default function ActiveRideBottomSheet({
  ride,
  driverLocation,
  onCompletePickup,
  onNavigate,
  onCancel,
  isVisible,
}) {
  const bottomSheetRef = useRef(null);
  const chevronRot = useRef(new RNAnimated.Value(0)).current;
  const [sheetIndex, setSheetIndex] = useState(0);

  const snapPoints = useMemo(() => ['20%', '80%'], []);

  const handleSheetChange = useCallback((index) => {
    setSheetIndex(index);
    RNAnimated.spring(chevronRot, {
      toValue: index === 1 ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [chevronRot]);

  const handleChevron = () => {
    const next = sheetIndex === 0 ? 1 : 0;
    bottomSheetRef.current?.snapToIndex(next);
  };

  const chevronAngle = chevronRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Snap bottom sheet when visibility changes
  useEffect(() => {
    if (isVisible && ride) {
      // Delay to ensure ref is ready
      setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 100);
    }
  }, [isVisible, ride]);

  if (!isVisible || !ride) return null;

  const distance = ride?.pickup?.distance || '0.0';
  const eta = ride?.pickup?.eta || '0';
  const pickupName = ride?.pickup?.name || 'Pickup Location';
  const pickupAddress = ride?.pickup?.address || '';

  return (
    <>
      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        handleComponent={null}
        backgroundStyle={styles.sheetBg}
        animateOnMount
        enablePanDownToClose={false}
      >
        <BottomSheetScrollView
          style={styles.sheetBody}
          showsVerticalScrollIndicator={false}
        >
            {/* Header Row: Chevron + ETA + Distance */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleChevron} style={styles.chevronBtn} activeOpacity={0.7}>
                <RNAnimated.View style={{ transform: [{ rotate: chevronAngle }] }}>
                  <ChevronDown size={moderateScale(22)} color={colors.mediumGrey} />
                </RNAnimated.View>
              </TouchableOpacity>

              <View style={styles.etaRowCentered}>
                <Text style={styles.etaText}>{eta} min</Text>
                <View style={styles.dot} />
                <MapPin size={moderateScale(14)} color={colors.secondary} />
                <Text style={styles.distanceText}>{distance} km</Text>
              </View>

              {/* Invisible placeholder to balance the chevron */}
              <View style={styles.placeholderBtn} />
            </View>

            {/* Restaurant Info */}
            <View style={styles.restaurantSection}>
              <View style={styles.restaurantHeader}>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{pickupName}</Text>
                  <Text style={styles.restaurantAddress}>{pickupAddress}</Text>
                </View>
                <TouchableOpacity style={styles.phoneBtn} activeOpacity={0.7}>
                  <View style={styles.phoneIconBg}>
                    <Phone size={moderateScale(16)} color={colors.white} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Note from Business */}
            <View style={styles.noteSection}>
              <Text style={styles.noteTitle}>Note from Business</Text>
              <Text style={styles.noteText}>
                Park near restaurant. Go in the front entrance, say with FDS Driver. Verify order #230203
              </Text>
            </View>

            {/* Pick up order section */}
            <Text style={styles.pickupTitle}>Pick up 1 order</Text>

            {/* Customer Card */}
            <View style={styles.customerCard}>
              <View style={styles.customerHeader}>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>Kelsey Lavin.</Text>
                  <Text style={styles.orderDetails}>308YY - 2 items</Text>
                  <Text style={styles.expectedTime}>Expected time 10:32 AM</Text>
                </View>
                <ChevronRight size={moderateScale(20)} color={colors.grey} />
              </View>

              {/* Verify Order Button */}
              <TouchableOpacity style={styles.verifyBtn} activeOpacity={0.8}>
                <Text style={styles.verifyBtnText}>Verify Order</Text>
              </TouchableOpacity>
            </View>

           

            {/* Help & Support */}
            <TouchableOpacity style={styles.helpRow} activeOpacity={0.7}>
              <Text style={styles.helpText}>Help & Support</Text>
              <ChevronRight size={moderateScale(20)} color={colors.grey} />
            </TouchableOpacity>

            {/* Complete Pickup Button */}
            <TouchableOpacity
              style={styles.completeButton}
              onPress={onCompletePickup}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>Picked Up</Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  /* Navigation FAB - positioned just above 20% bottom sheet */
  navFab: {
    position: 'absolute',
    bottom: verticalScale(180),
    right: scale(16),
    alignItems: 'center',
    zIndex: 0,
    elevation: 0,
  },
  navFabInner: {
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
    elevation: 8,
  },
  navFabText: {
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

  /* Bottom Sheet */
  sheetBg: {
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    backgroundColor: colors.white,
  },
  sheetBody: {
    paddingHorizontal: scale(16),
    paddingTop: scale(6),
    paddingBottom: verticalScale(20),
    maxHeight: '100%',
  },

  /* Header Row */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  chevronBtn: {
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderBtn: {
    width: scale(44),
    height: scale(44),
  },
  etaRowCentered: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },
  etaText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.secondary,
  },
  distanceText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.secondary,
  },
  dot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: colors.grey,
  },

  /* Restaurant Section */
  restaurantSection: {
    marginBottom: verticalScale(16),
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(4),
  },
  restaurantAddress: {
    fontSize: moderateScale(13),
    color: colors.grey,
    lineHeight: moderateScale(18),
  },
  phoneBtn: {
    marginLeft: scale(12),
    marginTop: verticalScale(2),
  },
  phoneIconBg: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Note Section */
  noteSection: {
    marginBottom: verticalScale(16),
  },
  noteTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(6),
  },
  noteText: {
    fontSize: moderateScale(13),
    color: colors.grey,
    lineHeight: moderateScale(18),
  },

  /* Pickup Title */
  pickupTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(12),
  },

  /* Customer Card */
  customerCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(16),
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(2),
  },
  orderDetails: {
    fontSize: moderateScale(13),
    color: colors.grey,
    marginBottom: verticalScale(2),
  },
  expectedTime: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },

  /* Verify Button */
  verifyBtn: {
    backgroundColor: '#E8E8E8',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: colors.secondary,
  },

  /* Help Row */
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(16),
  },
  helpText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.secondary,
  },

  /* Complete Button */
  completeButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  completeButtonText: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});
