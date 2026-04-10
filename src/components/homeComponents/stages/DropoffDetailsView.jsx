/**
 * DropoffDetailsView.jsx
 * Stage view for GOING_TO_DROPOFF and ARRIVED_AT_DROPOFF steps
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
import { colors } from '../../../utils/colors';
import fonts from '../../../utils/fonts/fontsList';
import ChevronIcon from '../../../assets/homeIcons/chevron.svg';
import VectorIcon from '../../../assets/homeIcons/Vector.svg';
import LocationFilledIcon from '../../../assets/ridecardIcons/location_filled.svg';
import CallIcon from '../../../assets/ridecardIcons/call_icon.svg';
import ChatRestaurantIcon from '../../../assets/ridecardIcons/chat_restaurant.svg';
import HomeIcon from '../../../assets/ridecardIcons/home_icon.svg';
import ActionButton from '../../../components/common/ActionButton';
 
export default function DropoffDetailsView({
  ride, 
  eta,
  distance,
  chevronAngle,
  onChevronPress,
  onCall,
  onChat,
  onConfirmOrder,
}) {
  const customerName = ride?.passengerName || 'Kelsey Lavin';
  const address = ride?.dropoff?.address || '825 Caledonia Rd, North York, ON M6B 3X8, Canada';
  const dropoffType = 'Leave the door';
  const note = "Please don't ring the bell and when you reach at location then you call me.";
  const orderId = '308YY';
  const restaurantName = ride?.pickup?.name || "Dave's Hot Chicken";
  const items = '2 items';
  const expectedTime = '10:32 AM';

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

      {/* Status Text */}
      <Text style={styles.statusText}>Arriving Time</Text>

      {/* Customer Name with Action Buttons */}
      <View style={styles.customerHeaderRow}>
        <View style={styles.customerNameSection}>
          <Text style={styles.dropoffCustomerName}>{customerName}</Text>
          <Text style={styles.dropoffAddress}>{address}</Text>
          <View style={styles.homeTag}>
            <HomeIcon width={moderateScale(12)} height={moderateScale(12)} />
            <Text style={styles.homeTagText}>Home</Text>
          </View>
        </View>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionIconBtn} onPress={onChat} activeOpacity={0.7}>
            <View style={[styles.actionIconBgSmall, { backgroundColor: '#C8FF00' }]}>
              <ChatRestaurantIcon width={moderateScale(16)} height={moderateScale(16)} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtn} onPress={onCall} activeOpacity={0.7}>
            <View style={styles.actionIconBgSmall}>
              <CallIcon width={moderateScale(16)} height={moderateScale(16)} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Drop off type */}
      <View style={styles.dropoffSection}>
        <Text style={styles.dropoffLabel}>Drop off type</Text>
        <Text style={styles.dropoffValue}>{dropoffType}</Text>
      </View>

      {/* Note from customer */}
      <View style={styles.dropoffSection}>
        <Text style={styles.dropoffLabel}>Note from customer</Text>
        <Text style={styles.dropoffNoteText}>{note}</Text>
      </View>

      {/* Drop off order header */}
      <Text style={styles.dropoffOrderTitle}>Drop off 1 order</Text>

      {/* Order Card */}
      <TouchableOpacity style={styles.orderCard} activeOpacity={0.8}>
        <View style={styles.orderCardContent}>
          <Text style={styles.orderId}>{orderId}</Text>
          <Text style={styles.orderRestaurant}>{restaurantName} - {items}</Text>
          <Text style={styles.orderExpectedTime}>Expected time {expectedTime}</Text>
          <Text style={styles.orderVerifyText}>Verify - Take photos</Text>
        </View>
        <ChevronRight size={moderateScale(24)} color={colors.grey} />
      </TouchableOpacity>

      {/* Confirm Order Button */}
      <ActionButton
        title="Confirm Order"
        onPress={onConfirmOrder}
        variant="secondary"
        style={{ marginBottom: verticalScale(12) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: scale(8),
    paddingBottom: verticalScale(20),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
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
  statusText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.medium,
    color: colors.grey,
    textAlign: 'center',
    marginTop: verticalScale(-4),
    marginBottom: verticalScale(16),
  },
  customerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(16),
  },
  customerNameSection: {
    flex: 1,
    marginRight: scale(12),
  },
  dropoffCustomerName: {
    fontSize: moderateScale(18),
    fontFamily: fonts.bold,
    color: colors.secondary,
    marginBottom: verticalScale(4),
  },
  dropoffAddress: {
    fontSize: moderateScale(13),
    color: colors.grey,
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(6),
  },
  homeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: moderateScale(6),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    alignSelf: 'flex-start',
    gap: scale(4),
  },
  homeTagText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.medium,
    color: colors.grey,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: scale(8),
  },
  actionIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBgSmall: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropoffSection: {
    marginBottom: verticalScale(16),
  },
  dropoffLabel: {
    fontSize: moderateScale(14),
    fontFamily: fonts.semiBold,
    color: colors.secondary,
    marginBottom: verticalScale(4),
  },
  dropoffValue: {
    fontSize: moderateScale(13),
    color: colors.grey,
  },
  dropoffNoteText: {
    fontSize: moderateScale(13),
    color: colors.grey,
    lineHeight: moderateScale(18),
  },
  dropoffOrderTitle: {
    fontSize: moderateScale(14),
    fontFamily: fonts.semiBold,
    color: colors.secondary,
    marginBottom: verticalScale(12),
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(16),
  },
  orderCardContent: {
    flex: 1,
  },
  orderId: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: colors.secondary,
    marginBottom: verticalScale(2),
  },
  orderRestaurant: {
    fontSize: moderateScale(13),
    color: colors.grey,
    marginBottom: verticalScale(2),
  },
  orderExpectedTime: {
    fontSize: moderateScale(12),
    color: colors.grey,
    marginBottom: verticalScale(4),
  },
  orderVerifyText: {
    fontSize: moderateScale(13),
    fontFamily: fonts.medium,
    color: colors.secondary,
  },
});
