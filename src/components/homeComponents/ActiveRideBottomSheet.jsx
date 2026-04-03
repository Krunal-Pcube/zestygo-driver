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
import { MapPin, Navigation, ChevronDown, ChevronRight, Phone, MessageSquare, X, Clock, ChevronUp, Home } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import { RIDE_STEPS, STEP_CONFIG } from '../../hooks/useRideState';
import { CancelConfirmationModal, CancelReasonModal, VerifyOrderModal, DropOffOrderModal, TakePhotoModal, DeliveryInfoModal } from './TripCompletionModals';

/* ════════════════════════════════════════════════════════════════
   Navigation FAB
   ════════════════════════════════════════════════════════════════ */
function NavigationFAB({ onPress }) {
  return (
    <TouchableOpacity style={styles.navFab} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.navFabInner}>
        <Navigation size={moderateScale(18)} color={colors.blue} />
      <Text style={styles.navFabText}>Navigation</Text>

      </View>
    </TouchableOpacity>
  );
}

/* ════════════════════════════════════════════════════════════════
   Pickup Confirmation View - Shows after Complete Pickup clicked
   ════════════════════════════════════════════════════════════════ */
function PickupConfirmationView({ onContinue, onGoBack }) {
  return (
    <View style={styles.confirmationContainer}>
      {/* Title */}
      <Text style={styles.confirmationTitle}>Ready for the next stop?</Text>

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
  );
}

/* ════════════════════════════════════════════════════════════════
   Dropoff Details View - Shows after Continue to next stop clicked
   ════════════════════════════════════════════════════════════════ */
function DropoffDetailsView({ ride, onCall, onChat, onConfirmOrder, onCompleteDelivery }) {
  const customerName = ride?.passengerName || 'Kelsey Lavin';
  const address = ride?.dropoff?.address || '825 Caledonia Rd, North York, ON M6B 3X8, Canada';
  const dropoffType = 'Leave the door';
  const note = "Please don't ring the bell and when you reach at location then you call me.";
  const orderId = '308YY';
  const restaurantName = ride?.pickup?.name || "Dave's Hot Chicken";
  const items = '2 items';
  const expectedTime = '10:32 AM';

  return (
    <View style={styles.dropoffContainer}>
      {/* Customer Name with Action Buttons */}
      <View style={styles.customerHeaderRow}>
        <View style={styles.customerNameSection}>
          <Text style={styles.dropoffCustomerName}>{customerName}</Text>
          <Text style={styles.dropoffAddress}>{address}</Text>
          <View style={styles.homeTag}>
            <Home size={moderateScale(12)} color={colors.grey} />
            <Text style={styles.homeTagText}>Home</Text>
          </View>
        </View> 
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionIconBtn} onPress={onChat} activeOpacity={0.7}>
            <View style={[styles.actionIconBgSmall, { backgroundColor: '#C8FF00' }]}>
              <MessageSquare size={moderateScale(16)} color={colors.secondary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconBtn} onPress={onCall} activeOpacity={0.7}>
            <View style={styles.actionIconBgSmall}>
              <Phone size={moderateScale(16)} color={colors.white} />
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
      <TouchableOpacity 
        style={styles.confirmOrderBtn} 
        onPress={onConfirmOrder}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmOrderBtnText}>Confirm Order</Text>
      </TouchableOpacity>



    </View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Rating View - Shows after Complete Delivery clicked
   ════════════════════════════════════════════════════════════════ */
function RatingView({ customerName, onSubmit }) {
  const [rating, setRating] = useState(4);

  return (
    <View style={styles.ratingContainer}>
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
        onPress={onSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.submitBtnText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Earnings View - Shows after Rating submitted
   ════════════════════════════════════════════════════════════════ */
function EarningsView({ tripId, amount, customerName, onDone }) {
  return (
    <View style={styles.earningsContainer}>
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
  );
}

/* ════════════════════════════════════════════════════════════════
   Arrived At Pickup View - Shows restaurant details like screenshot
   ════════════════════════════════════════════════════════════════ */
function ArrivedAtPickupView({ ride, onCall, onShowConfirmation, onVerifyOrder, isOrderVerified }) {
  const restaurant = ride?.pickup;
  const customerName = ride?.passengerName || 'Kelsey Lavin';
  const orderCount = 1;
  const items = '2 items';
  const expectedTime = '10:32 AM';
  const address = restaurant?.address || '1582 Queen St W, Toronto, ON M6R 1A6, Canada';
  const note = 'Park near restaurant. Go in the front entrance, say with FDS Driver. Verify order #230203';

  return (
    <View style={styles.arrivedContainer}>
      {/* Restaurant Section */}
      <View style={styles.restaurantSection}>
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant?.name || "Dave's Hot Chicken"}</Text>
            <Text style={styles.restaurantAddress}>{address}</Text>
          </View>
          <TouchableOpacity style={styles.phoneBtn} onPress={onCall} activeOpacity={0.7}>
            <View style={styles.phoneIconBg}>
              <Phone size={moderateScale(18)} color={colors.white} />
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
        <TouchableOpacity 
          style={[
            styles.verifyBtn, 
            isOrderVerified && styles.verifyBtnVerified
          ]} 
          onPress={isOrderVerified ? null : onVerifyOrder}
          activeOpacity={isOrderVerified ? 1 : 0.8}
        >
          <Text style={[
            styles.verifyBtnText,
            isOrderVerified && styles.verifyBtnTextVerified
          ]}>
            {isOrderVerified ? 'Order verified' : 'Verify Order'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Help & Support */}
      <TouchableOpacity style={styles.helpRow} activeOpacity={0.7}>
        <Text style={styles.helpText}>Help & Support</Text>
        <ChevronRight size={moderateScale(24)} color={colors.grey} />
      </TouchableOpacity>

      {/* Complete Pickup Button */}
      <TouchableOpacity 
        style={styles.completeButton} 
        onPress={onShowConfirmation}
        activeOpacity={0.8}
      >
        <Text style={styles.completeButtonText}>Complete Pickup</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Active Ride Bottom Sheet Component
   ════════════════════════════════════════════════════════════════ */
export default function ActiveRideBottomSheet({
  ride,
  driverLocation,
  rideStep,
  onArrived,
  onNavigate,
  onCall,
  onChat,
  onCancel,
  onStartDropoff,
  onCompleteRide,
  onShowRating,  // New callback to show rating modal
  isVisible,
}) {
  const bottomSheetRef = useRef(null);
  const chevronRot = useRef(new RNAnimated.Value(0)).current;
  const [sheetIndex, setSheetIndex] = useState(0);
  const [showPickupConfirmation, setShowPickupConfirmation] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [showVerifyOrder, setShowVerifyOrder] = useState(false);
  const [isOrderVerified, setIsOrderVerified] = useState(false);
  // Drop-off flow modals
  const [showDropOffOrder, setShowDropOffOrder] = useState(false);
  const [showTakePhoto, setShowTakePhoto] = useState(false);
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);

  // Get config based on current step
  const stepConfig = STEP_CONFIG[rideStep] || STEP_CONFIG[RIDE_STEPS.GOING_TO_PICKUP];
  const snapPoints = useMemo(() => [stepConfig.bottomSheetHeight], [stepConfig.bottomSheetHeight]);

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

  // Handle primary button press based on step
  const handlePrimaryAction = () => {
    console.log('[ActiveRideBottomSheet] Primary action pressed, rideStep:', rideStep);
    switch (rideStep) {
      case RIDE_STEPS.GOING_TO_PICKUP:
        onArrived?.();
        break;
      case RIDE_STEPS.ARRIVED_AT_PICKUP:
        onStartDropoff?.();
        break;
      case RIDE_STEPS.GOING_TO_DROPOFF:
        onArrived?.();
        break;
      case RIDE_STEPS.ARRIVED_AT_DROPOFF:
        onCompleteRide?.();
        break;
      default:
        onArrived?.();
    }
  };

  // Handle showing pickup confirmation
  const handleShowConfirmation = () => {
    setShowPickupConfirmation(true);
  };

  // Handle continue to next stop
  const handleContinueToNextStop = () => {
    setShowPickupConfirmation(false);
    onStartDropoff?.();
  };

  // Handle go back - preserve order verification state
  const handleGoBack = () => {
    setShowPickupConfirmation(false);
    // Note: isOrderVerified is intentionally preserved
  };

  // Handle complete delivery - show delivery info modal instead of rating directly
  const handleCompleteDelivery = () => {
    setShowDeliveryInfo(true);
  };

  // Handle confirm order - show drop off order modal
  const handleConfirmOrder = () => {
    setShowDropOffOrder(true);
  };

  // Handle take photo - show take photo modal
  const handleTakePhoto = () => {
    setShowDropOffOrder(false);
    setShowTakePhoto(true);
  };

  // Handle photo taken - close take photo and show delivery info
  const handlePhotoTaken = () => {
    setShowTakePhoto(false);
    setShowDeliveryInfo(true);
  };

  // Handle close drop off modal
  const handleCloseDropOff = () => {
    setShowDropOffOrder(false);
  };

  // Handle close take photo
  const handleCloseTakePhoto = () => {
    setShowTakePhoto(false);
  };

  // Handle close delivery info
  const handleCloseDeliveryInfo = () => {
    setShowDeliveryInfo(false);
  };

  // Handle final complete delivery - trigger rating modal
  const handleFinalCompleteDelivery = () => {
    setShowDeliveryInfo(false);
    onShowRating?.();
  };

  // Handle cancel button press - show confirmation first
  const handleCancelPress = () => {
    setShowCancelConfirm(true);
  };

  // Handle yes cancel - show reason modal
  const handleYesCancel = () => {
    setShowCancelConfirm(false);
    setShowCancelReason(true);
  };

  // Handle cancel close
  const handleCancelClose = () => {
    setShowCancelConfirm(false);
    setShowCancelReason(false);
  };

  // Handle reason selected - actually cancel the ride
  const handleReasonSelected = (reason) => {
    setShowCancelReason(false);
    onCancel?.(reason);
  };

  // Handle verify order button press
  const handleVerifyPress = () => {
    setShowVerifyOrder(true);
  };

  // Handle order verified
  const handleOrderVerified = () => {
    setShowVerifyOrder(false);
    setIsOrderVerified(true);
  };

  // Handle close verify modal
  const handleCloseVerify = () => {
    setShowVerifyOrder(false);
  };

  // Snap bottom sheet when visibility changes
  useEffect(() => {
    if (isVisible && ride) {
      setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 100);
    }
  }, [isVisible, ride, snapPoints]);

  if (!isVisible || !ride) return null;

  const distance = ride?.pickup?.distance || '0.0';
  const eta = ride?.pickup?.eta || '0';

  return (
    <>
      {/* Navigation FAB - only show when configured */}
      {stepConfig.showNavigationButton && (
        <NavigationFAB onPress={onNavigate} />
      )}

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
        {rideStep === RIDE_STEPS.ARRIVED_AT_PICKUP ? (
          <BottomSheetScrollView style={styles.arrivedScrollView} showsVerticalScrollIndicator={false}>
            {/* Header Row: Chevron + ETA + Distance + Menu */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleChevron} style={styles.iconBtn} activeOpacity={0.7}>
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

              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <View style={styles.menuIcon}>
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Scrollable content - show either pickup view or confirmation */}
            {showPickupConfirmation ? (
              <PickupConfirmationView 
                onContinue={handleContinueToNextStop}
                onGoBack={handleGoBack}
              />
            ) : (
              <ArrivedAtPickupView 
                ride={ride} 
                onCall={onCall} 
                onShowConfirmation={handleShowConfirmation}
                onVerifyOrder={handleVerifyPress}
                isOrderVerified={isOrderVerified}
              />
            )}
          </BottomSheetScrollView>
        ) : rideStep === RIDE_STEPS.GOING_TO_DROPOFF || rideStep === RIDE_STEPS.ARRIVED_AT_DROPOFF ? (
          <BottomSheetScrollView style={styles.arrivedScrollView} showsVerticalScrollIndicator={false}>
            {/* Header Row: Chevron + ETA + Distance + Menu */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleChevron} style={styles.iconBtn} activeOpacity={0.7}>
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

              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <View style={styles.menuIcon}>
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Status Text */}
            <Text style={styles.statusText}>Arriving Time</Text>

            {/* Dropoff Details View - with confirm order flow */}
            <DropoffDetailsView
              ride={ride}
              onCall={onCall}
              onChat={onChat}
              onConfirmOrder={handleConfirmOrder}
              onCompleteDelivery={handleCompleteDelivery}
            />
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView style={styles.sheetBody}>
            {/* Header Row: Chevron + ETA + Distance + Menu */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleChevron} style={styles.iconBtn} activeOpacity={0.7}>
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

              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <View style={styles.menuIcon}>
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                </View>
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
                <TouchableOpacity style={styles.actionBtn} onPress={handleCancelPress} activeOpacity={0.7}>
                  <View style={styles.actionIconBg}>
                    <X size={moderateScale(22)} color={colors.secondary} />
                  </View>
                  <Text style={styles.actionText}>Cancel Trip</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Primary Action Button */}
            <View style={styles.buttonWrapper}>
              <TouchableOpacity 
                style={styles.arrivedBtn} 
                onPress={handlePrimaryAction}
                activeOpacity={0.8}
              >
                <Text style={styles.arrivedBtnText}>{stepConfig.primaryButtonText}</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        )}
      </BottomSheet>

      {/* Cancel Confirmation Modal */}
      <CancelConfirmationModal
        visible={showCancelConfirm}
        customerName={ride?.passengerName || 'Kelsey'}
        onYesCancel={handleYesCancel}
        onNo={handleCancelClose}
      />

      {/* Cancel Reason Modal */}
      <CancelReasonModal
        visible={showCancelReason}
        onSelectReason={handleReasonSelected}
        onClose={handleCancelClose}
      />

      {/* Verify Order Modal */}
      <VerifyOrderModal
        visible={showVerifyOrder}
        ride={ride}
        onVerify={handleOrderVerified}
        onClose={handleCloseVerify}
      />

      {/* Drop Off Order Modal */}
      <DropOffOrderModal
        visible={showDropOffOrder}
        ride={ride}
        onTakePhoto={handleTakePhoto}
        onClose={handleCloseDropOff}
      />

      {/* Take Photo Modal */}
      <TakePhotoModal
        visible={showTakePhoto}
        onPhotoTaken={handlePhotoTaken}
        onClose={handleCloseTakePhoto}
      />

      {/* Delivery Info Modal */}
      <DeliveryInfoModal
        visible={showDeliveryInfo}
        onCompleteDelivery={handleFinalCompleteDelivery}
        onClose={handleCloseDeliveryInfo}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  /* Arrived View Container */
  arrivedContainer: {
    flex: 1,
  },

  /* Arrived ScrollView */
  arrivedScrollView: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: scale(8),
    paddingBottom: verticalScale(20),
  },

  /* Navigation FAB - positioned just above 20% bottom sheet */
  navFab: {
    position: 'absolute',
    bottom: verticalScale(120),
    right: scale(16),
    alignItems: 'center',
    zIndex: 0,
    elevation: 0,
  },
  navFabInner: {
    borderRadius: scale(8),
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  navFabText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    marginLeft: scale(4),
    color: colors.secondary,
    overflow: 'hidden',
  },

  /* Bottom Sheet */
  sheetBg: {
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    backgroundColor: colors.white,
  },
  sheetBody: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: scale(8),
    paddingBottom: verticalScale(20),
  },

  /* Header Row */
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
  menuIcon: {
    width: scale(20),
    height: scale(16),
    justifyContent: 'space-between',
  },
  menuLine: {
    width: scale(20),
    height: scale(2),
    backgroundColor: colors.mediumGrey,
    borderRadius: scale(1),
  },

  /* Status Text */
  statusText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.grey,
    textAlign: 'center',
    marginTop: verticalScale(-4),
    marginBottom: verticalScale(16),
  },

  /* Action Buttons Row */
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
    fontWeight: '500',
    color: colors.secondary,
  },

  /* Arrived Button */
  arrivedBtn: {
    backgroundColor: colors.secondary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(4),
    minHeight: scale(48),
    zIndex: 100,
    elevation: 10,
  },
  arrivedBtnText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.primary,
  },

  /* Button Wrapper */
  buttonWrapper: {
    zIndex: 100,
    elevation: 10,
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
  verifyBtnVerified: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
  },
  verifyBtnText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: colors.secondary,
  },
  verifyBtnTextVerified: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontWeight: '700',
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
    fontWeight: '700',
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

  /* Pickup Confirmation View */
  confirmationContainer: {
    flex: 1,
    paddingTop: verticalScale(8),
  },
  confirmationTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  infoList: {
    marginBottom: verticalScale(24),
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
    fontWeight: '700',
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
    marginBottom: verticalScale(12),
  },
  continueButtonText: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  goBackButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  goBackButtonText: {
    color: colors.secondary,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  /* Dropoff Details View */
  dropoffContainer: {
    flex: 1,
    paddingTop: verticalScale(8),
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
    fontWeight: '700',
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
    fontWeight: '500',
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
    fontWeight: '600',
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
    fontWeight: '600',
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
    fontWeight: '700',
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
    fontWeight: '500',
    color: colors.secondary,
  },
  confirmOrderBtn: {
    backgroundColor: colors.secondary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  confirmOrderBtnText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: colors.primary,
  },
  completeDeliveryBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  completeDeliveryBtnText: {
    color: '#C8FF00',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },

  /* Rating View */
  ratingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(20),
  },
  ratingTitle: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: colors.grey,
    marginBottom: verticalScale(16),
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
    paddingVertical: verticalScale(16),
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
  earningsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(20),
  },
  tripIdText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
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
    fontWeight: '700',
  },
  earningsAmount: {
    fontSize: moderateScale(32),
    fontWeight: '700',
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
    fontWeight: '600',
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
  doneBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
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
