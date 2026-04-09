/**
 * RatingView.jsx
 * Rating stage view for trip completion
 */

import React, { useState } from 'react';
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

export default function RatingView({ customerName, onSubmit }) {
  const [rating, setRating] = useState(4);

  return (
    <View style={styles.container}>
      <Text style={styles.ratingTitle}>How was your trip?</Text>
      <Text style={styles.ratingCustomerName}>{customerName}</Text>

      {/* Star Rating */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            activeOpacity={0.7}
          >
            <Text style={styles.star}>
              {star <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.ratingDivider} />

      {/* Submit Button */}
      <ActionButton
        title="Submit"
        onPress={onSubmit}
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
  ratingTitle: {
    fontSize: moderateScale(16),
    fontFamily: fonts.medium,
    color: colors.grey,
    marginBottom: verticalScale(16),
  },
  ratingCustomerName: {
    fontSize: moderateScale(20),
    fontFamily: fonts.bold,
    color: colors.secondary,
    marginBottom: verticalScale(20),
  },
  starsRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(24),
  },
  star: {
    fontSize: moderateScale(32),
    color: '#FFD700',
  },
  ratingDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: verticalScale(20),
  },
});
