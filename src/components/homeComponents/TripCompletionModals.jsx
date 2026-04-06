/**
 * TripCompletionModals.jsx
 * Centered modal dialogs for rating and earnings (not bottom sheet style)
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';

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
    fontFamily: fonts.medium,
    color: colors.grey,
    marginBottom: verticalScale(12),
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
    fontFamily: fonts.bold,
  },

  /* Earnings View */
  tripIdText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.bold,
  },
  earningsAmount: {
    fontSize: moderateScale(32),
    fontFamily: fonts.bold,
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
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.bold,
  },

  /* Cancel Confirmation Modal */
  cancelConfirmTitle: {
    fontSize: moderateScale(18),
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.semiBold,
  },
  reasonHeaderTitle: {
    fontSize: moderateScale(18),
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.medium,
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
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.semiBold,
    color: colors.secondary,
  },

  /* Take Photo Modal Additional Styles */
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  capturedPhotoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedPhoto: {
    width: '90%',
    height: verticalScale(350),
    borderRadius: moderateScale(12),
  },
  cameraNote: {
    fontSize: moderateScale(11),
    color: colors.grey,
    textAlign: 'center',
    marginTop: verticalScale(12),
    paddingHorizontal: scale(20),
  },
  captureBtn: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnText: {
    fontSize: moderateScale(16),
    fontFamily: fonts.semiBold,
    color: colors.secondary,
  },
  capturedPhotoThumb: {
    width: scale(50),
    height: scale(50),
    borderRadius: moderateScale(8),
  },
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.medium,
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
    fontFamily: fonts.bold,
  },

  /* Pickup Confirmation Modal */
  pickupConfirmTitle: {
    fontSize: moderateScale(18),
    fontFamily: fonts.bold,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  infoList: {
    marginBottom: verticalScale(24),
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  infoIconBg: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
    position: 'relative',
  },
  handIcon: {
    fontSize: moderateScale(20),
  },
  personIcon: {
    fontSize: moderateScale(20),
  },
  checkBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  checkText: {
    color: colors.white,
    fontSize: moderateScale(10),
    fontFamily: fonts.bold,
  },
  infoText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: colors.secondary,
    lineHeight: moderateScale(20),
  },
  continueButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: verticalScale(12),
  },
  continueButtonText: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
  },
  goBackButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  goBackButtonText: {
    color: colors.secondary,
    fontSize: moderateScale(16),
    fontFamily: fonts.semiBold,
  },
});

/* ════════════════════════════════════════════════════════════════
   Pickup Confirmation Modal - Shows after Complete Pickup clicked
   ════════════════════════════════════════════════════════════════ */
export function PickupConfirmationModal({ visible, onContinue, onGoBack }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onGoBack}
    >
      <TouchableWithoutFeedback onPress={onGoBack}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Title */}
              <Text style={styles.pickupConfirmTitle}>Ready for the next stop?</Text>

              {/* Info Items */}
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconBg}>
                    <Text style={styles.handIcon}>✋</Text>
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  </View>
                  <Text style={styles.infoText}>Confirm that the order has been Collected</Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.infoIconBg}>
                    <Text style={styles.personIcon}>👤</Text>
                  </View>
                  <Text style={styles.infoText}>We'll let the customer know you have their order</Text>
                </View>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={onContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>Continue to next stop</Text>
              </TouchableOpacity>

              {/* Go Back Button */}
              <TouchableOpacity
                style={styles.goBackButton}
                onPress={onGoBack}
                activeOpacity={0.8}
              >
                <Text style={styles.goBackButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

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
   Take Photo Modal - Full screen camera with react-native-vision-camera
   ════════════════════════════════════════════════════════════════ */
// Create a safe camera hook wrapper that always returns valid values
const useVisionCamera = () => {
  const [state, setState] = React.useState({
    device: null,
    hasPermission: false,
    requestPermission: () => {},
    Camera: null,
    available: false,
  });

  React.useEffect(() => {
    try {
      const VisionCamera = require('react-native-vision-camera');
      setState({
        device: null, // Will be set by hook below
        hasPermission: false, // Will be set by hook below
        requestPermission: () => {},
        Camera: VisionCamera.Camera,
        available: true,
      });
    } catch (error) {
      // Library not available
    }
  }, []);

  return state;
};

export function TakePhotoModal({ visible, onPhotoTaken, onClose }) {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const cameraRef = useRef(null);
  
  // Always call hooks at top level - never conditionally
  let cameraDevice = null;
  let hasPermission = false;
  let requestPermissionFn = () => {};
  
  try {
    const VisionCamera = require('react-native-vision-camera');
    cameraDevice = VisionCamera.useCameraDevice('back');
    const permission = VisionCamera.useCameraPermission();
    hasPermission = permission.hasPermission;
    requestPermissionFn = permission.requestPermission;
  } catch (error) {
    // Hooks still called (return default values), library not available
  }

  // Reset state when modal opens
  React.useEffect(() => {
    if (visible) {
      setCapturedPhoto(null);
      setCameraError(null);
      // Auto-request permission if needed
      if (!hasPermission && requestPermissionFn) {
        requestPermissionFn();
      }
    }
  }, [visible, hasPermission]);

  // Take photo using react-native-vision-camera
  const takePhoto = async () => {
    try {
      if (cameraRef.current && cameraDevice) {
        const photo = await cameraRef.current.takePhoto();
        setCapturedPhoto(photo.path);
      } else {
        // Fallback: simulate capture for testing
        setCapturedPhoto('mock_photo');
      }
    } catch (error) {
      console.log('Take photo error:', error);
      Alert.alert('Error', 'Failed to capture photo: ' + error.message);
    }
  };

  // Confirm and send photo back
  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoTaken?.(capturedPhoto);
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  // Render camera component
  const renderCamera = () => {
    if (!cameraDevice) {
      return (
        <View style={styles.photoPreviewBox}>
          <Text style={styles.photoPlaceholderText}>📷</Text>
          <Text style={styles.photoPlaceholderSubtext}>
            {hasPermission ? 'No camera device found' : 'Camera Preview'}
          </Text>
          {!hasPermission && (
            <Text style={styles.cameraNote}>
              Camera ready - press Capture to test
            </Text>
          )}
        </View>
      );
    }

    if (!hasPermission) {
      return (
        <View style={[styles.photoPreviewBox, { backgroundColor: '#000' }]}>
          <Text style={[styles.photoPlaceholderText, { color: '#fff' }]}>📷</Text>
          <Text style={[styles.photoPlaceholderSubtext, { color: '#fff' }]}>
            Requesting camera permission...
          </Text>
        </View>
      );
    }

    try {
      const { Camera } = require('react-native-vision-camera');
      return (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={cameraDevice}
          isActive={visible && !capturedPhoto}
          photo={true}
        />
      );
    } catch (error) {
      return (
        <View style={styles.photoPreviewBox}>
          <Text style={styles.photoPlaceholderText}>📷</Text>
          <Text style={styles.photoPlaceholderSubtext}>Camera Preview</Text>
        </View>
      );
    }
  };

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
          <Text style={styles.photoHeaderTitle}>
            {capturedPhoto ? 'Review Photo' : 'Take Photo'}
          </Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Camera Preview or Captured Photo */}
        <View style={styles.photoPreviewContainer}>
          {capturedPhoto ? (
            // Show captured photo
            <View style={styles.capturedPhotoContainer}>
              {capturedPhoto === 'mock_photo' ? (
                <View style={[styles.photoPreviewBox, { backgroundColor: '#E8F4FD' }]}>
                  <Text style={styles.photoPlaceholderText}>📷</Text>
                  <Text style={styles.photoPlaceholderSubtext}>Mock Photo Captured</Text>
                </View>
              ) : (
                <Image 
                  source={{ uri: 'file://' + capturedPhoto }} 
                  style={styles.capturedPhoto}
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            // Camera preview - no permission check, just show camera
            <View style={styles.cameraContainer}>
              {renderCamera()}
            </View>
          )}
        </View>

        {/* Question */}
        <Text style={styles.photoQuestion}>
          Will customer be able to find their order?
        </Text>

        {/* Action Buttons */}
        <View style={styles.photoActionRow}>
          {capturedPhoto ? (
            // Review mode buttons
            <>
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={handleRetake}
                activeOpacity={0.8}
              >
                <Text style={styles.retakeBtnText}>Retake ↻</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: '#1A1A1A' }]}
                onPress={handleConfirmPhoto}
                activeOpacity={0.8}
              >
                <Text style={[styles.nextBtnText, { color: '#C8FF00' }]}>Use Photo ✓</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Camera mode buttons
            <>
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.retakeBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.captureBtn, { backgroundColor: '#1A1A1A' }]}
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <Text style={[styles.captureBtnText, { color: '#C8FF00' }]}>📸 Capture</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   Delivery Info Modal - Shows photo preview and notes input
   ════════════════════════════════════════════════════════════════ */
export function DeliveryInfoModal({ visible, onCompleteDelivery, onClose, photoUri }) {
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
              {photoUri ? (
                photoUri === 'mock_photo' ? (
                  <Text style={styles.photoThumbText}>📷</Text>
                ) : (
                  <Image 
                    source={{ uri: photoUri }} 
                    style={styles.capturedPhotoThumb}
                    resizeMode="cover"
                  />
                )
              ) : (
                <Text style={styles.photoThumbText}>📷</Text>
              )}
            </View>
            <Text style={styles.uploadedText}>
              {photoUri ? '✓ Photo attached' : 'No photo attached'}
            </Text>
            {photoUri && (
              <TouchableOpacity style={styles.deletePhotoBtn} activeOpacity={0.7}>
                <Text style={styles.deletePhotoText}>🗑</Text>
              </TouchableOpacity>
            )}
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
