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
  TextInput,
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
export function EarningsModal({ visible, tripId, amount, customerName, onDone, onViewDetails }) {
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
              <TouchableOpacity onPress={onViewDetails} activeOpacity={0.7}>
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
   Cancel Confirmation Modal - First step when canceling
   ════════════════════════════════════════════════════════════════ */
export function CancelConfirmationModal({ visible, customerName, onYesCancel, onNo }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onNo}
    >
      <TouchableWithoutFeedback onPress={onNo}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Title */}
              <Text style={styles.cancelConfirmTitle}>
                Cancel {customerName} trip?
              </Text>

              <View style={styles.cancelDivider} />

              {/* Yes, Cancel Button */}
              <TouchableOpacity
                style={styles.yesCancelBtn}
                onPress={onYesCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.yesCancelBtnText}>Yes, cancel</Text>
              </TouchableOpacity>

              {/* No Button */}
              <TouchableOpacity
                style={styles.noBtn}
                onPress={onNo}
                activeOpacity={0.8}
              >
                <Text style={styles.noBtnText}>No</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   Cancel Reason Modal - Select reason for canceling
   ════════════════════════════════════════════════════════════════ */
const CANCEL_REASONS = [
  'Wrong address shown',
  "Don't charge rider",
  'Not ready',
  'Restaurant closed',
  'Order not found',
];

export function CancelReasonModal({ visible, onSelectReason, onClose }) {
  const [selectedReason, setSelectedReason] = React.useState(null);

  const handleDone = () => {
    if (selectedReason) {
      onSelectReason?.(selectedReason);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenBackdrop}>
        <View style={styles.reasonModalContainer}>
          {/* Header */}
          <View style={styles.reasonHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.reasonHeaderTitle}>Cancel Trip</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.reasonDivider} />

          {/* Reason List */}
          <View style={styles.reasonList}>
            {CANCEL_REASONS.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reasonItem}
                onPress={() => setSelectedReason(reason)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.radioCircle,
                  selectedReason === reason && styles.radioCircleSelected
                ]}>
                  {selectedReason === reason && (
                    <View style={styles.radioInner}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Done Button */}
          <TouchableOpacity
            style={[
              styles.doneReasonBtn,
              !selectedReason && styles.doneReasonBtnDisabled
            ]}
            onPress={handleDone}
            disabled={!selectedReason}
            activeOpacity={0.8}
          >
            <Text style={styles.doneReasonBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
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

  /* Cancel Confirmation Modal */
  cancelConfirmTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  cancelDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: verticalScale(16),
  },
  yesCancelBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: verticalScale(12),
  },
  yesCancelBtnText: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  noBtn: {
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  noBtnText: {
    color: colors.secondary,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  /* Cancel Reason Modal */
  fullScreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  reasonModalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(30),
    width: '100%',
    maxHeight: '80%',
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  closeBtn: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: moderateScale(20),
    color: colors.secondary,
    fontWeight: '600',
  },
  reasonHeaderTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.secondary,
  },
  headerPlaceholder: {
    width: scale(40),
  },
  reasonDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: verticalScale(16),
  },
  reasonList: {
    marginBottom: verticalScale(20),
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  radioCircle: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    borderWidth: 2,
    borderColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  radioCircleSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  radioInner: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: colors.white,
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  reasonText: {
    fontSize: moderateScale(16),
    color: colors.secondary,
    flex: 1,
  },
  doneReasonBtn: {
    backgroundColor: '#D3D3D3',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
  doneReasonBtnDisabled: {
    backgroundColor: '#E8E8E8',
  },
  doneReasonBtnText: {
    color: '#666666',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },

  /* Verify Order Modal */
  verifyModalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(30),
    width: '100%',
    maxHeight: '90%',
  },
  verifyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  verifyHeaderTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.secondary,
  },
  orderCardBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(16),
    alignItems: 'center',
  },
  orderCardName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(4),
  },
  orderCardId: {
    fontSize: moderateScale(13),
    color: colors.grey,
    marginBottom: verticalScale(2),
  },
  orderCardItems: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },
  verifyInstruction: {
    fontSize: moderateScale(13),
    color: colors.grey,
    textAlign: 'center',
    marginBottom: verticalScale(16),
    lineHeight: moderateScale(18),
  },
  itemsList: {
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(16),
  },
  itemText: {
    fontSize: moderateScale(14),
    color: colors.secondary,
    marginBottom: verticalScale(8),
  },
  verifyDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: verticalScale(16),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  optionIconBg: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  clockIcon: {
    fontSize: moderateScale(18),
  },
  warningIcon: {
    fontSize: moderateScale(18),
  },
  optionText: {
    fontSize: moderateScale(16),
    color: colors.secondary,
    fontWeight: '500',
  },
  issueBtn: {
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(12),
  },
  issueBtnText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.secondary,
  },
  verifyOrderBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyOrderBtnText: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },

  /* Drop Off Order Modal */
  dropOffModalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(30),
    width: '100%',
    maxHeight: '80%',
  },
  dropOffDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: verticalScale(16),
  },
  takePhotoBtn: {
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  takePhotoBtnText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.secondary,
  },

  /* Take Photo Modal */
  photoModalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  photoHeaderTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.secondary,
  },
  photoPreviewContainer: {
    flex: 1,
    padding: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreviewBox: {
    width: '100%',
    height: verticalScale(400),
    borderWidth: 2,
    borderColor: '#4A90D9',
    borderStyle: 'dashed',
    borderRadius: moderateScale(12),
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: moderateScale(48),
    marginBottom: verticalScale(8),
  },
  photoPlaceholderSubtext: {
    fontSize: moderateScale(14),
    color: colors.grey,
  },
  photoQuestion: {
    fontSize: moderateScale(14),
    color: colors.grey,
    textAlign: 'center',
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(16),
  },
  photoActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
    gap: scale(12),
  },
  retakeBtn: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeBtnText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.secondary,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.secondary,
  },

  /* Delivery Info Modal */
  deliveryInfoContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(30),
    width: '100%',
    maxHeight: '90%',
  },
  deliveryInfoTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(4),
  },
  deliveryInfoSubtitle: {
    fontSize: moderateScale(13),
    color: colors.grey,
    marginBottom: verticalScale(20),
  },
  sectionLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: verticalScale(8),
  },
  photoUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    padding: scale(12),
    marginBottom: verticalScale(16),
  },
  photoThumbnail: {
    width: scale(50),
    height: scale(50),
    borderRadius: moderateScale(8),
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  photoThumbText: {
    fontSize: moderateScale(24),
  },
  uploadedText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#4CAF50',
    fontWeight: '500',
  },
  deletePhotoBtn: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePhotoText: {
    fontSize: moderateScale(18),
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  charCount: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },
  notesInputBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    backgroundColor: '#F8F8F8',
    padding: scale(12),
    marginBottom: verticalScale(12),
    minHeight: verticalScale(80),
  },
  notesInput: {
    fontSize: moderateScale(14),
    color: colors.secondary,
    textAlignVertical: 'top',
    minHeight: verticalScale(60),
  },
  policyText: {
    fontSize: moderateScale(12),
    color: colors.grey,
    marginBottom: verticalScale(20),
  },
  deliveryDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: verticalScale(16),
  },
  completeDeliveryBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeDeliveryBtnText: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
});

/* ════════════════════════════════════════════════════════════════
   Verify Order Modal - Shows order details for verification
   ════════════════════════════════════════════════════════════════ */
export function VerifyOrderModal({ visible, ride, onVerify, onClose }) {
  const restaurantName = ride?.pickup?.name || "Dave's Hot Chicken";
  const orderId = ride?.id ? `#${ride.id}` : '#230203';
  const items = ride?.items || [
    { name: 'Garlic Stick', quantity: 2 },
    { name: 'Quarter Butter Chicken', quantity: 2 },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenBackdrop}>
        <View style={styles.verifyModalContainer}>
          {/* Header */}
          <View style={styles.verifyHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.verifyHeaderTitle}>Verify Order</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.reasonDivider} />

          {/* Order Card */}
          <View style={styles.orderCardBox}>
            <Text style={styles.orderCardName}>{restaurantName}</Text>
            <Text style={styles.orderCardId}>{orderId}</Text>
            <Text style={styles.orderCardItems}>{items.length} items</Text>
          </View>

          {/* Instruction Text */}
          <Text style={styles.verifyInstruction}>
            The customer name or order number should{'\n'}match the receipt
          </Text>

          {/* Items List */}
          <View style={styles.itemsList}>
            {items.map((item, index) => (
              <Text key={index} style={styles.itemText}>
                {item.quantity} x {item.name}
              </Text>
            ))}
          </View>

          <View style={styles.verifyDivider} />

          {/* Not Ready Option */}
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionIconBg}>
              <Text style={styles.clockIcon}>⏱</Text>
            </View>
            <Text style={styles.optionText}>Not ready</Text>
          </TouchableOpacity>

          {/* Report Issue Option */}
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={styles.optionIconBg}>
              <Text style={styles.warningIcon}>⚠</Text>
            </View>
            <Text style={styles.optionText}>Report issue</Text>
          </TouchableOpacity>

          {/* Issue with Order Button */}
          <TouchableOpacity 
            style={styles.issueBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.issueBtnText}>Issue with order</Text>
          </TouchableOpacity>

          {/* Verify Order Button */}
          <TouchableOpacity
            style={styles.verifyOrderBtn}
            onPress={onVerify}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyOrderBtnText}>Verify Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   Drop Off Order Modal - Shows order details for drop-off
   ════════════════════════════════════════════════════════════════ */
export function DropOffOrderModal({ visible, ride, onTakePhoto, onClose }) {
  const customerName = ride?.passengerName || 'Kelsey Lavin';
  const orderId = ride?.id ? `#${ride.id}` : '#230203';
  const restaurantName = ride?.pickup?.name || "Dave's Hot Chicken";
  const items = ride?.items || [
    { name: 'Garlic Stick', quantity: 2 },
    { name: 'Quarter Butter Chicken', quantity: 2 },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenBackdrop}>
        <View style={styles.dropOffModalContainer}>
          {/* Header */}
          <View style={styles.verifyHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.verifyHeaderTitle}>Drop off Order</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.reasonDivider} />

          {/* Order Card */}
          <View style={styles.orderCardBox}>
            <Text style={styles.orderCardName}>{customerName}</Text>
            <Text style={styles.orderCardId}>{orderId}</Text>
            <Text style={styles.orderCardItems}>{items.length} items</Text>
          </View>

          {/* Items List */}
          <View style={styles.itemsList}>
            {items.map((item, index) => (
              <Text key={index} style={styles.itemText}>
                {item.quantity} x {item.name}
              </Text>
            ))}
          </View>

          <View style={styles.dropOffDivider} />

          {/* Take Photo Button */}
          <TouchableOpacity
            style={styles.takePhotoBtn}
            onPress={onTakePhoto}
            activeOpacity={0.8}
          >
            <Text style={styles.takePhotoBtnText}>Take photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   Take Photo Modal - Full screen camera interface
   ════════════════════════════════════════════════════════════════ */
export function TakePhotoModal({ visible, onPhotoTaken, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.photoModalContainer}>
        {/* Header */}
        <View style={styles.photoHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.photoHeaderTitle}>Take photo</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Photo Preview Area */}
        <View style={styles.photoPreviewContainer}>
          <View style={styles.photoPreviewBox}>
            <Text style={styles.photoPlaceholderText}>📷</Text>
            <Text style={styles.photoPlaceholderSubtext}>Camera Preview</Text>
          </View>
        </View>

        {/* Question */}
        <Text style={styles.photoQuestion}>
          Will customer be able to find their order?
        </Text>

        {/* Action Buttons */}
        <View style={styles.photoActionRow}>
          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.retakeBtnText}>Retake ↻</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={onPhotoTaken}
            activeOpacity={0.8}
          >
            <Text style={styles.nextBtnText}>Next ✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   Delivery Info Modal - Shows photo preview and notes input
   ════════════════════════════════════════════════════════════════ */
export function DeliveryInfoModal({ visible, onCompleteDelivery, onClose }) {
  const [notes, setNotes] = useState('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenBackdrop}>
        <View style={styles.deliveryInfoContainer}>
          {/* Header */}
          <View style={styles.verifyHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Title */}
          <Text style={styles.deliveryInfoTitle}>Information to share with customer</Text>
          <Text style={styles.deliveryInfoSubtitle}>
            This is optional but can help the customer find their order.
          </Text>

          {/* Photo Section */}
          <Text style={styles.sectionLabel}>Photo</Text>
          <View style={styles.photoUploadBox}>
            <View style={styles.photoThumbnail}>
              <Text style={styles.photoThumbText}>📷</Text>
            </View>
            <Text style={styles.uploadedText}>✓ Uploaded</Text>
            <TouchableOpacity style={styles.deletePhotoBtn} activeOpacity={0.7}>
              <Text style={styles.deletePhotoText}>🗑</Text>
            </TouchableOpacity>
          </View>

          {/* Notes Section */}
          <View style={styles.notesHeader}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.charCount}>{notes.length}/160</Text>
          </View>
          <View style={styles.notesInputBox}>
            <TextInput
              style={styles.notesInput}
              placeholder="Where did you leave the order?"
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
              multiline
              maxLength={160}
            />
          </View>

          {/* Policy Text */}
          <Text style={styles.policyText}>
            Photos and notes are sent to the customer per FDA Content policy.
          </Text>

          <View style={styles.deliveryDivider} />

          {/* Complete Delivery Button */}
          <TouchableOpacity
            style={styles.completeDeliveryBtn}
            onPress={onCompleteDelivery}
            activeOpacity={0.8}
          >
            <Text style={styles.completeDeliveryBtnText}>Complete Delivery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
