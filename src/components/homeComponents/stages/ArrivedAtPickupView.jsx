/**
 * ArrivedAtPickupView.jsx
 * Stage view for ARRIVED_AT_PICKUP step - Shows restaurant details
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated as RNAnimated,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import ChevronIcon from '../../../assets/homeIcons/chevron.svg';
import VectorIcon from '../../../assets/homeIcons/Vector.svg';
import LocationFilledIcon from '../../../assets/ridecardIcons/location_filled.svg';
import CallIcon from '../../../assets/ridecardIcons/call_icon.svg';
import { colors } from '../../../utils/colors';
import ActionButton from '../../../components/common/ActionButton';
import fonts from '../../../utils/fonts/fontsList'; 


export default function ArrivedAtPickupView({
  ride,
  eta,
  distance,
  isOrderVerified,
  chevronAngle,
  onChevronPress,
  onCall,
  onShowConfirmation,
  onVerifyOrder,
}) {
  const restaurant = ride?.pickup;
  const customerName = ride?.passengerName || 'Kelsey Lavin';
  const orderCount = 1;
  const items = '2 items';
  const expectedTime = '10:32 AM';
  const address = restaurant?.address || '1582 Queen St W, Toronto, ON M6R 1A6, Canada';
  const note = 'Park near restaurant. Go in the front entrance, say with FDS Driver. Verify order #230203';

  return (
    <View style={styles.container}>
      {/* Header Row: Chevron + ETA + Distance + Menu */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onChevronPress} style={styles.iconBtn} activeOpacity={0.7}>
          <RNAnimated.View style={{ transform: [{ rotate: chevronAngle }] }}>
            <ChevronIcon width={moderateScale(16)} height={moderateScale(16)} fill={colors.mediumGrey} />
          </RNAnimated.View>
        </TouchableOpacity>

        <View style={styles.etaRowCentered}>
          <Text style={styles.etaText}>{eta} min</Text>
          <LocationFilledIcon width={moderateScale(14)} height={moderateScale(14)} />
          <Text style={styles.distanceText}>{distance} km</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <VectorIcon width={moderateScale(18)} height={moderateScale(18)} fill={colors.mediumGrey} />
        </TouchableOpacity>
      </View>

      {/* Restaurant Section */}
      <View style={styles.restaurantSection}>
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant?.name || "Dave's Hot Chicken"}</Text>
            <Text style={styles.restaurantAddress}>{address}</Text>
          </View>
          <TouchableOpacity style={styles.phoneBtn} onPress={onCall} activeOpacity={0.7}>
            <View style={styles.phoneIconBg}>
              <CallIcon width={moderateScale(18)} height={moderateScale(18)} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Note from Business */}
      <View style={styles.noteSection}>
        <Text style={styles.noteTitle}>Note from Business</Text>
        <Text style={styles.noteText}>{note}</Text>
      </View>

      {/* Pick up order header */}
      <Text style={styles.pickupTitle}>Pick up {orderCount} order</Text>

      {/* Customer Card */}
      <View style={styles.customerCard}>
        <View style={styles.customerHeader}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customerName}</Text>
            <Text style={styles.orderDetails}>308YY • {items}</Text>
            <Text style={styles.expectedTime}>Expected time {expectedTime}</Text>
          </View>
          {isOrderVerified ? (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedCheck}>✓</Text>
            </View>
          ) : (
            <ChevronRight size={moderateScale(24)} color={colors.grey} />
          )}
        </View>

        {/* Verify Order Button - changes to verified state */}
        <ActionButton
          title={isOrderVerified ? 'Order verified' : 'Verify Order'}
          onPress={isOrderVerified ? null : onVerifyOrder}
          variant={isOrderVerified ? 'verified' : 'gray'}
          disabled={isOrderVerified}
        />
      </View>

      {/* Help & Support */}
      <TouchableOpacity style={styles.helpRow} activeOpacity={0.7}>
        <Text style={styles.helpText}>Help & Support</Text>
        <ChevronRight size={moderateScale(24)} color={colors.grey} />
      </TouchableOpacity>

      {/* Complete Pickup Button */}
      <ActionButton
        title="Complete Pickup"
        onPress={onShowConfirmation}
        variant="dark"
        style={{ marginBottom: verticalScale(20) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(8),
    marginTop: scale(8),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(8),
  },
  iconBtn: {
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },
  etaText: {
    fontSize: moderateScale(18),
    fontFamily: fonts.bold,
    color: colors.secondary,
  },
  distanceText: {
    fontSize: moderateScale(18),
    fontFamily: fonts.bold,
    color: colors.secondary,
  },
  dot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: colors.grey,
  },
  restaurantSection: {
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(8),
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
    fontFamily: fonts.bold,
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
  noteSection: {
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(8),
  },
  noteTitle: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: colors.secondary,
    marginBottom: verticalScale(6),
  },
  noteText: {
    fontSize: moderateScale(13),
    color: colors.grey,
    lineHeight: moderateScale(18),
  },
  pickupTitle: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: colors.secondary,
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(8),
  },
  customerCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(16),
    marginHorizontal: scale(8),
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
    fontFamily: fonts.bold,
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
  verifiedBadge: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheck: {
    color: colors.white,
    fontSize: moderateScale(14),
    fontFamily: fonts.bold,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(8),
  },
  helpText: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: colors.secondary,
  },
});
