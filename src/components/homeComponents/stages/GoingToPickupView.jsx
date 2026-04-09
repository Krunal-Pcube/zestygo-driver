/**
 * GoingToPickupView.jsx
 * Default stage view for GOING_TO_PICKUP step
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated as RNAnimated,
} from 'react-native';
import { MapPin, Phone, MessageSquare, X } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../../utils/colors';
import fonts from '../../../utils/fonts/fontsList';
import ChevronIcon from '../../../assets/homeIcons/chevron.svg';
import VectorIcon from '../../../assets/homeIcons/Vector.svg';
import SwipeToConfirm from '../../../components/common/SwipeToConfirm';

export default function GoingToPickupView({
  eta,
  distance,
  stepConfig,
  chevronAngle,
  onChevronPress,
  onCall,
  onChat,
  onCancel,
  onArrived,
}) {
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
          <View style={styles.dot} />
          <MapPin size={moderateScale(14)} color={colors.secondary} />
          <Text style={styles.distanceText}>{distance} km</Text>
        </View>

        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <VectorIcon width={moderateScale(18)} height={moderateScale(18)} fill={colors.mediumGrey} />
        </TouchableOpacity>
      </View>

      {/* Status Text */}
      <Text style={styles.statusText}>{stepConfig.statusText}</Text>

      <View style={{ height: scale(10) }} />

      {/* Action Buttons Row: Call, Chat, Cancel */}
      <View style={styles.actionsRow}>
        {stepConfig.actions.includes('call') && (
          <TouchableOpacity style={styles.actionBtn} onPress={onCall} activeOpacity={0.7}>
            <View style={styles.actionIconBg}>
              <Phone size={moderateScale(22)} color={colors.secondary} />
            </View>
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
        )}

        {stepConfig.actions.includes('chat') && (
          <TouchableOpacity style={styles.actionBtn} onPress={onChat} activeOpacity={0.7}>
            <View style={styles.actionIconBg}>
              <MessageSquare size={moderateScale(22)} color={colors.secondary} />
            </View>
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
        )}

        {stepConfig.actions.includes('cancel') && (
          <TouchableOpacity style={styles.actionBtn} onPress={onCancel} activeOpacity={0.7}>
            <View style={styles.actionIconBg}>
              <X size={moderateScale(22)} color={colors.secondary} />
            </View>
            <Text style={styles.actionText}>Cancel Trip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Primary Action Slider */}
      <View style={{ marginTop: verticalScale(20), marginBottom: verticalScale(20), alignItems: 'center' }}>
        <SwipeToConfirm
          title={`Swipe to ${stepConfig.primaryButtonText}`}
          onConfirm={onArrived}
          resetKey={stepConfig.primaryButtonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(8),
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBg: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(6),
  },
  actionText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.medium,
    color: colors.secondary,
  },
});
