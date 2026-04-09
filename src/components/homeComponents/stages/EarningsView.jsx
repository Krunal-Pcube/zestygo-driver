/**
 * EarningsView.jsx
 * Earnings stage view after trip completion
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../../utils/colors';
import fonts from '../../../utils/fonts/fontsList';
import ActionButton from '../../../components/common/ActionButton';

export default function EarningsView({ tripId, amount, customerName, onDone }) {
  return (
    <View style={styles.container}>
      <Text style={styles.tripIdText}>Trip {tripId}</Text>

      {/* Success Badge */}
      <View style={styles.successBadge}>
        <Text style={styles.checkMark}>✓</Text>
      </View>

      {/* Amount */}
      <Text style={styles.earningsAmount}>${amount}</Text>

      {/* Collect cash text */}
      <Text style={styles.collectText}>Collect cash from {customerName}</Text>

      {/* View More Details Link */}
      <TouchableOpacity activeOpacity={0.7}>
        <Text style={styles.viewDetailsText}>VIEW MORE DETAILS</Text>
      </TouchableOpacity>

      <View style={styles.earningsDivider} />

      {/* Done Button */}
      <ActionButton
        title="Done"
        onPress={onDone}
        variant="dark"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(20),
  },
  tripIdText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.semiBold,
    color: colors.secondary,
    marginBottom: verticalScale(20),
  },
  successBadge: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
  },
  checkMark: {
    fontSize: moderateScale(28),
    color: colors.white,
    fontFamily: fonts.bold,
  },
  earningsAmount: {
    fontSize: moderateScale(32),
    fontFamily: fonts.bold,
    color: colors.secondary,
    marginBottom: verticalScale(8),
  },
  collectText: {
    fontSize: moderateScale(14),
    color: colors.grey,
    marginBottom: verticalScale(16),
  },
  viewDetailsText: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    color: '#4CAF50',
    textTransform: 'uppercase',
    marginBottom: verticalScale(20),
  },
  earningsDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: verticalScale(20),
  },
});
