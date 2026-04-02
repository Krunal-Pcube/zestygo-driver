/**
 * DeliveryBottomSheet.jsx
 * Food Delivery Bottom Sheet - Step-based UI
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated as RNAnimated,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { MapPin, Navigation, ChevronDown, Phone, MessageSquare, X, Store, Home, Package } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import { DELIVERY_STEPS, STEP_CONFIG } from '../../hooks/useDeliveryState';

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
   Delivery Bottom Sheet Component
   ════════════════════════════════════════════════════════════════ */
export default function DeliveryBottomSheet({
  order,
  driverLocation,
  deliveryStep,
  onArriveRestaurant,
  onPickUpFood,
  onArriveCustomer,
  onCompleteDelivery,
  onNavigate,
  onCallRestaurant,
  onCallCustomer,
  onChatSupport,
  onCancel,
  isVisible,
}) {
  const bottomSheetRef = useRef(null);
  const chevronRot = useRef(new RNAnimated.Value(0)).current;
  const [sheetIndex, setSheetIndex] = useState(0);

  // Get config based on current step
  const stepConfig = STEP_CONFIG[deliveryStep] || STEP_CONFIG[DELIVERY_STEPS.ORDER_ASSIGNED];
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
    switch (deliveryStep) {
      case DELIVERY_STEPS.ORDER_ASSIGNED:
        onArriveRestaurant?.();
        break;
      case DELIVERY_STEPS.ARRIVED_AT_RESTAURANT:
        onPickUpFood?.();
        break;
      case DELIVERY_STEPS.PICKED_UP_FOOD:
      case DELIVERY_STEPS.GOING_TO_CUSTOMER:
        onArriveCustomer?.();
        break;
      case DELIVERY_STEPS.ARRIVED_AT_CUSTOMER:
        onCompleteDelivery?.();
        break;
      case DELIVERY_STEPS.DELIVERED:
        // Already completed
        break;
      default:
        onArriveRestaurant?.();
    }
  };

  // Snap bottom sheet when visibility changes
  useEffect(() => {
    if (isVisible && order) {
      setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 100);
    }
  }, [isVisible, order, snapPoints]);

  if (!isVisible || !order) return null;

  // Determine which location to show ETA for
  const isGoingToRestaurant = deliveryStep === DELIVERY_STEPS.ORDER_ASSIGNED;
  const targetLocation = isGoingToRestaurant ? order?.pickup : order?.dropoff;
  const distance = targetLocation?.distance || '0.0';
  const eta = targetLocation?.eta || '0';

  // Get action handlers based on step
  const getActionHandlers = () => {
    switch (deliveryStep) {
      case DELIVERY_STEPS.ORDER_ASSIGNED:
      case DELIVERY_STEPS.ARRIVED_AT_RESTAURANT:
        return {
          call: onCallRestaurant,
          chat: onChatSupport,
          cancel: onCancel,
        };
      case DELIVERY_STEPS.PICKED_UP_FOOD:
      case DELIVERY_STEPS.GOING_TO_CUSTOMER:
      case DELIVERY_STEPS.ARRIVED_AT_CUSTOMER:
        return {
          call: onCallCustomer,
          chat: onChatSupport,
        };
      default:
        return {};
    }
  };

  const actionHandlers = getActionHandlers();
  const actions = stepConfig.actions || [];

  // Info Card Component
  const InfoCard = () => {
    if (stepConfig.showRestaurantInfo) {
      return (
        <View style={styles.infoCard}>
          <View style={styles.infoIconBg}>
            <Store size={moderateScale(24)} color={colors.green} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>{order?.pickup?.name || 'Restaurant'}</Text>
            <Text style={styles.infoSubtitle} numberOfLines={2}>{order?.pickup?.address}</Text>
          </View>
          <TouchableOpacity style={styles.infoAction} onPress={onCallRestaurant}>
            <Phone size={moderateScale(20)} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      );
    }
    
    if (stepConfig.showCustomerInfo) {
      return (
        <View style={styles.infoCard}>
          <View style={[styles.infoIconBg, { backgroundColor: colors.orange + '20' }]}>
            <Home size={moderateScale(24)} color={colors.orange} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Customer Location</Text>
            <Text style={styles.infoSubtitle} numberOfLines={2}>{order?.dropoff?.address}</Text>
          </View>
          <TouchableOpacity style={styles.infoAction} onPress={onCallCustomer}>
            <Phone size={moderateScale(20)} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

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

            {/* Menu Icon */}
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

          {/* Info Card (Restaurant or Customer) */}
          <InfoCard />

          <View style={{ height: scale(10) }} />

          {/* Action Buttons Row */}
          <View style={styles.actionsRow}>
            {actions.includes('call_restaurant') && actionHandlers.call && (
              <TouchableOpacity style={styles.actionBtn} onPress={actionHandlers.call} activeOpacity={0.7}>
                <View style={styles.actionIconBg}>
                  <Phone size={moderateScale(22)} color={colors.green} />
                </View>
                <Text style={styles.actionText}>Call Restaurant</Text>
              </TouchableOpacity>
            )}

            {actions.includes('call_customer') && actionHandlers.call && (
              <TouchableOpacity style={styles.actionBtn} onPress={actionHandlers.call} activeOpacity={0.7}>
                <View style={styles.actionIconBg}>
                  <Phone size={moderateScale(22)} color={colors.orange} />
                </View>
                <Text style={styles.actionText}>Call Customer</Text>
              </TouchableOpacity>
            )}

            {actions.includes('chat_support') && actionHandlers.chat && (
              <TouchableOpacity style={styles.actionBtn} onPress={actionHandlers.chat} activeOpacity={0.7}>
                <View style={styles.actionIconBg}>
                  <MessageSquare size={moderateScale(22)} color={colors.secondary} />
                </View>
                <Text style={styles.actionText}>Support</Text>
              </TouchableOpacity>
            )}

            {actions.includes('cancel') && actionHandlers.cancel && (
              <TouchableOpacity style={styles.actionBtn} onPress={actionHandlers.cancel} activeOpacity={0.7}>
                <View style={styles.actionIconBg}>
                  <X size={moderateScale(22)} color={colors.red} />
                </View>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity 
            style={[styles.primaryBtn, 
              deliveryStep === DELIVERY_STEPS.DELIVERED && { backgroundColor: colors.green }
            ]} 
            onPress={handlePrimaryAction}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>{stepConfig.primaryButtonText}</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  /* Navigation FAB */
  navFab: {
    position: 'absolute',
    bottom: verticalScale(120),
    right: scale(16),
    alignItems: 'center',
    zIndex: 0,
    elevation: 0,
  },
  navFabInner: {
    borderRadius: scale(24),
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(10),
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
    marginBottom: verticalScale(12),
  },

  /* Info Card */
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: moderateScale(12),
    padding: scale(12),
    marginBottom: verticalScale(12),
  },
  infoIconBg: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: colors.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(2),
  },
  infoSubtitle: {
    fontSize: moderateScale(13),
    color: colors.grey,
    lineHeight: moderateScale(18),
  },
  infoAction: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

  /* Primary Button */
  primaryBtn: {
    backgroundColor: '#D3D3D3',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(4),
  },
  primaryBtnText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#666666',
  },
});
