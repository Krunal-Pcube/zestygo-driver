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
import { MapPin, ChevronRight } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import { RIDE_STEPS, STEP_CONFIG } from '../../hooks/useRideState';
import { CancelConfirmationModal, CancelReasonModal, VerifyOrderModal, DropOffOrderModal, TakePhotoModal, DeliveryInfoModal, PickupConfirmationModal } from './TripCompletionModals';
import {
  NavigationFAB,
  GoingToPickupView,
  ArrivedAtPickupView,
  DropoffDetailsView,
} from './stages';


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
  const [capturedPhotoUri, setCapturedPhotoUri] = useState(null);

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
    outputRange: ['180deg', '0deg'], // Flipped: collapsed=down, expanded=up
  });

  // Handle primary button press based on step
  const handlePrimaryAction = () => {
    console.log('[ActiveRideBottomSheet] Primary action PRESSED, rideStep:', rideStep);
    console.log('[ActiveRideBottomSheet] Button onArrived:', onArrived);
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

  // Handle photo taken - store photo URI and show delivery info
  const handlePhotoTaken = (photoUri) => {
    setCapturedPhotoUri(photoUri);
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

        enableContentPanningGesture={true}
        enableHandlePanningGesture={false}
        enableOverDrag={false}
        activeOffsetX={[-999, 999]}  // Disable horizontal pan
        activeOffsetY={[-5, 5]}      // Only vertical pan
      >
        {rideStep === RIDE_STEPS.ARRIVED_AT_PICKUP ? (
          <BottomSheetScrollView style={styles.arrivedScrollView} showsVerticalScrollIndicator={false}>
            <ArrivedAtPickupView
              ride={ride}
              eta={eta}
              distance={distance}
              isOrderVerified={isOrderVerified}
              chevronAngle={chevronAngle}
              onChevronPress={handleChevron}
              onCall={onCall}
              onShowConfirmation={handleShowConfirmation}
              onVerifyOrder={handleVerifyPress}
            />
          </BottomSheetScrollView>
        ) : rideStep === RIDE_STEPS.GOING_TO_DROPOFF || rideStep === RIDE_STEPS.ARRIVED_AT_DROPOFF ? (
          <BottomSheetScrollView style={styles.arrivedScrollView} showsVerticalScrollIndicator={false}>
            <DropoffDetailsView
              ride={ride}
              eta={eta}
              distance={distance}
              chevronAngle={chevronAngle}
              onChevronPress={handleChevron}
              onCall={onCall}
              onChat={onChat}
              onConfirmOrder={handleConfirmOrder}
            />
          </BottomSheetScrollView>
        ) : (
          <BottomSheetScrollView style={styles.scrollViewBody} showsVerticalScrollIndicator={false}>
            <GoingToPickupView
              eta={eta}
              distance={distance}
              stepConfig={stepConfig}
              chevronAngle={chevronAngle}
              onChevronPress={handleChevron}
              onCall={onCall}
              onChat={onChat}
              onCancel={handleCancelPress}
              onArrived={handlePrimaryAction}
            />
          </BottomSheetScrollView>
        )}
      </BottomSheet>

      {/* Pickup Confirmation Modal */}
      <PickupConfirmationModal
        visible={showPickupConfirmation}
        onContinue={handleContinueToNextStop}
        onGoBack={handleGoBack}
      />

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
        photoUri={capturedPhotoUri}
      />
    </>
  );
}

const styles = StyleSheet.create({
  /* Arrived ScrollView */
  arrivedScrollView: {
    flex: 1,
    paddingTop: scale(8),
    paddingBottom: verticalScale(20),
  },

  /* ScrollView Body for default case */
  scrollViewBody: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: scale(8),
    paddingBottom: verticalScale(20),
  },

  /* Bottom Sheet */
  sheetBg: {
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    backgroundColor: colors.white,
  },
});
