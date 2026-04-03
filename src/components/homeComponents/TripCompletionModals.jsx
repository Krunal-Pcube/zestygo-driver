/**
 * TripCompletionModals.jsx
 * Centered modal dialogs for rating and earnings (not bottom sheet style)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../utils/colors';

/* ════════════════════════════════════════════════════════════════
   Rating Modal - Centered modal with backdrop
   ════════════════════════════════════════════════════════════════ */
export function RatingModal({ visible, customerName, onSubmit, onClose }) {
  const [rating, setRating] = useState(4);

  const handleSubmit = () => {
    onSubmit?.(rating);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
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
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   Earnings Modal - Centered modal with backdrop
   ════════════════════════════════════════════════════════════════ */
export function EarningsModal({ visible, tripId, amount, customerName, onDone }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDone}
    >
      <TouchableWithoutFeedback onPress={onDone}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
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
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={onDone}
                activeOpacity={0.8}
              >
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  /* Backdrop overlay - pushes content to bottom */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
  },

  /* Modal card - positioned at bottom with rounded top corners */
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(30),
    width: '100%',
    alignItems: 'center',
  },

  /* Rating View */
  ratingTitle: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: colors.grey,
    marginBottom: verticalScale(12),
  },
  ratingCustomerName: {
    fontSize: moderateScale(20),
    fontWeight: '700',
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
  submitBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  submitBtnText: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },

  /* Earnings View */
  tripIdText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: verticalScale(16),
  },
  successBadge: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  checkMark: {
    fontSize: moderateScale(28),
    color: colors.white,
    fontWeight: '700',
  },
  earningsAmount: {
    fontSize: moderateScale(32),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(4),
  },
  collectText: {
    fontSize: moderateScale(14),
    color: colors.grey,
    marginBottom: verticalScale(12),
  },
  viewDetailsText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#4CAF50',
    textTransform: 'uppercase',
    marginBottom: verticalScale(16),
  },
  earningsDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: verticalScale(16),
  },
  doneBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  doneBtnText: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});
