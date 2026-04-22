/**
 * TripDetailsScreen.jsx
 * Enhanced trip summary with improved UI and multi-order support
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  Award
} from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';

export default function TripDetailsScreen({ navigation, route: navRoute }) {
  // Get tripData from navigation params
  const { tripData } = navRoute?.params || {};

  // Extract trip details from tripData
  const {
    tripId = '',
    tripNumber = '#0001',
    tripStatus = 'completed',
    totalEarnings = 0,
    baseDeliveryAmount = 0,
    totalTips = 0,
    orderCount = 0,
    route: tripRoute = [],
    orderAmounts = {},
    earningDate = '',
  } = tripData || {};

  // Format date for display
  const formatDisplayDate = (isoDate) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-').map(Number);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[m - 1]} ${d}, ${y}`;
  };

  const formatTime = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const displayDate = formatDisplayDate(earningDate);
  const isCompleted = tripStatus === 'completed' || tripStatus === 'delivered';
  const isCancelled = tripStatus === 'cancelled';

  const handleBack = () => {
    navigation.goBack();
  };

  // Calculate additional metrics
  const avgEarningsPerOrder = orderCount > 0 ? totalEarnings / orderCount : 0;
  const tipPercentage = baseDeliveryAmount > 0 ? (totalTips / baseDeliveryAmount) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={moderateScale(22)} color={colors.darkText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trip Number & Status Card */}
        <View style={styles.tripHeaderCard}>
          <View style={styles.tripNumberRow}>
            <Text style={styles.tripNumberLabel}>Trip ID</Text>
            <View style={[
              styles.statusBadge, 
              isCompleted && styles.statusBadgeCompleted,
              isCancelled && styles.statusBadgeCancelled
            ]}>
              {isCompleted && <CheckCircle2 size={moderateScale(12)} color={colors.white} />}
              {isCancelled && <XCircle size={moderateScale(12)} color={colors.white} />}
              {!isCompleted && !isCancelled && <Clock size={moderateScale(12)} color={colors.white} />}
              <Text style={styles.statusBadgeText}>
                {isCompleted ? 'Completed' : isCancelled ? 'Cancelled' : tripStatus}
              </Text>
            </View>
          </View>
          <Text style={styles.tripNumber}>{tripNumber}</Text>
          <Text style={styles.tripDate}>{displayDate}</Text>
        </View>

        {/* Earnings Summary Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <DollarSign size={moderateScale(18)} color={colors.secondary} />
            <Text style={styles.earningsHeaderText}>Total Earnings</Text>
          </View>
          <Text style={styles.totalEarnings}>${totalEarnings.toFixed(2)}</Text>
          
          <View style={styles.earningsBreakdown}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsItemLabel}>Base Amount</Text>
              <Text style={styles.earningsItemValue}>${baseDeliveryAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.earningsDividerVertical} />
            <View style={styles.earningsItem}>
              <Text style={styles.earningsItemLabel}>Tips Earned</Text>
              <Text style={[styles.earningsItemValue, styles.tipsValue]}>
                ${totalTips.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Package size={moderateScale(18)} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{orderCount}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={moderateScale(18)} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>${avgEarningsPerOrder.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Avg/Order</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Award size={moderateScale(18)} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{tipPercentage.toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Tip Rate</Text>
          </View>
        </View>

        {/* Route Details Section */}
        <View style={styles.routeSection}>
          <Text style={styles.sectionTitle}>Delivery Route</Text>
          <View style={styles.routeCard}>
            {tripRoute.map((stop, index) => {
              const isPickup = stop.stop_type === 'pickup';
              const isLast = index === tripRoute.length - 1;
              const amounts = orderAmounts[stop.orderId];

              return (
                <View key={`${stop.id}-${index}`}>
                  <View style={styles.routeStopRow}>
                    {/* Timeline Column */}
                    <View style={styles.timelineColumn}>
                      <View style={[
                        styles.timelineDot,
                        isPickup ? styles.timelineDotPickup : styles.timelineDotDrop
                      ]}>
                        <Text style={styles.timelineDotText}>
                          {isPickup ? 'P' : 'D'}
                        </Text>
                      </View>
                      {!isLast && <View style={styles.timelineLine} />}
                    </View>

                    {/* Stop Content */}
                    <View style={styles.stopContent}>
                      <View style={styles.stopHeader}>
                        <View style={[
                          styles.stopTypeBadge,
                          isPickup ? styles.pickupBadge : styles.dropBadge
                        ]}>
                          <Text style={[
                            styles.stopTypeText,
                            isPickup ? styles.pickupText : styles.dropText
                          ]}>
                            {isPickup ? 'Pickup' : 'Drop-off'}
                          </Text>
                        </View>
                        {stop.status === 'completed' && (
                          <CheckCircle2 size={moderateScale(14)} color={colors.green} />
                        )}
                      </View>

                      {stop.place_name && (
                        <Text style={styles.placeName}>{stop.place_name}</Text>
                      )}
                      
                      <Text style={styles.stopAddress} numberOfLines={2}>
                        {stop.address}
                      </Text>

                      {/* Order Details for Drop-off */}
                      {!isPickup && amounts && (
                        <View style={styles.orderDetailsCard}>
                          <View style={styles.orderDetailRow}>
                            <Text style={styles.orderDetailLabel}>Order #{stop.orderId}</Text>
                            <Text style={styles.orderDetailValue}>
                              ${amounts.deliveryAmount.toFixed(2)}
                            </Text>
                          </View>
                          {amounts.tipAmount > 0 && (
                            <View style={styles.orderDetailRow}>
                              <Text style={styles.orderDetailLabel}>Tip Amount</Text>
                              <Text style={[styles.orderDetailValue, styles.tipColor]}>
                                +${amounts.tipAmount.toFixed(2)}
                              </Text>
                            </View>
                          )}
                          <View style={styles.orderTotalDivider} />
                          <View style={styles.orderDetailRow}>
                            <Text style={styles.orderTotalLabel}>Order Total</Text>
                            <Text style={styles.orderTotalValue}>
                              ${amounts.total.toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {!isLast && <View style={styles.stopSpacer} />}
                </View>
              );
            })}
          </View>
        </View>

    

        {/* Payment Summary */}
        <View style={styles.paymentSummarySection}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.paymentSummaryCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Base Delivery Fee</Text>
              <Text style={styles.paymentValue}>${baseDeliveryAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Customer Tips</Text>
              <Text style={[styles.paymentValue, styles.positiveValue]}>
                +${totalTips.toFixed(2)}
              </Text>
            </View>
            <View style={styles.paymentDivider} />
            <View style={styles.paymentRow}>
              <Text style={styles.paymentTotalLabel}>Total Earnings</Text>
              <Text style={styles.paymentTotalValue}>${totalEarnings.toFixed(2)}</Text>
            </View>
          </View>
        </View>


        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider || '#E8E8E8',
  },
  backBtn: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: fonts.bold,
    color: colors.darkText,
  },
  headerPlaceholder: {
    width: scale(40),
  },
  scrollView: {
    flex: 1,
  },

  // Trip Header Card
  tripHeaderCard: {
    backgroundColor: colors.white,
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: colors.divider || '#E8E8E8',
  },
  tripNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  tripNumberLabel: {
    fontSize: moderateScale(12),
    color: colors.grey,
    fontFamily: fonts.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: colors.grey,
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: moderateScale(12),
  },
  statusBadgeCompleted: {
    backgroundColor: colors.green,
  },
  statusBadgeCancelled: {
    backgroundColor: colors.red || '#FF4444',
  },
  statusBadgeText: {
    fontSize: moderateScale(11),
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  tripNumber: {
    fontSize: moderateScale(20),
    fontFamily: fonts.bold,
    color: colors.darkText,
    marginBottom: verticalScale(4),
  },
  tripDate: {
    fontSize: moderateScale(13),
    color: colors.grey,
    fontFamily: fonts.medium,
  },

  // Earnings Card
  earningsCard: {
    backgroundColor: colors.white,
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    padding: scale(18),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: colors.divider || '#E8E8E8',
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginBottom: verticalScale(8),
  },
  earningsHeaderText: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    color: colors.grey,
  },
  totalEarnings: {
    fontSize: moderateScale(36),
    fontFamily: fonts.bold,
    color: colors.green,
    marginBottom: verticalScale(16),
  },
  earningsBreakdown: {
    flexDirection: 'row',
    backgroundColor: colors.background || '#F8F9FA',
    borderRadius: moderateScale(8),
    padding: scale(12),
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsItemLabel: {
    fontSize: moderateScale(11),
    color: colors.grey,
    marginBottom: verticalScale(4),
  },
  earningsItemValue: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: colors.darkText,
  },
  tipsValue: {
    color: colors.green,
  },
  earningsDividerVertical: {
    width: 1,
    backgroundColor: colors.divider || '#E8E8E8',
    marginHorizontal: scale(12),
  },

  // Quick Stats
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    gap: scale(10),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: scale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider || '#E8E8E8',
  },
  statIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  statValue: {
    fontSize: moderateScale(18),
    fontFamily: fonts.bold,
    color: colors.darkText,
    marginBottom: verticalScale(2),
  },
  statLabel: {
    fontSize: moderateScale(11),
    color: colors.grey,
    textAlign: 'center',
  },

  // Route Section
  routeSection: {
    marginTop: verticalScale(20),
    paddingHorizontal: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
    color: colors.darkText,
    marginBottom: verticalScale(12),
  },
  routeCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: colors.divider || '#E8E8E8',
  },
  routeStopRow: {
    flexDirection: 'row',
  },
  timelineColumn: {
    alignItems: 'center',
    marginRight: scale(12),
    width: scale(28),
  },
  timelineDot: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotPickup: {
    backgroundColor: colors.lightgrey || '#E0E0E0',
  },
  timelineDotDrop: {
    backgroundColor: colors.primary,
  },
  timelineDotText: {
    fontSize: moderateScale(11),
    fontFamily: fonts.bold,
    color: colors.black,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.divider || '#E8E8E8',
    marginTop: scale(4),
    minHeight: scale(40),
  },
  stopContent: {
    flex: 1,
    paddingBottom: verticalScale(4),
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  stopTypeBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: moderateScale(6),
  },
  pickupBadge: {
    backgroundColor: colors.lightgrey || '#F0F0F0',
  },
  dropBadge: {
    backgroundColor: colors.secondary,
  },
  stopTypeText: {
    fontSize: moderateScale(11),
    fontFamily: fonts.semiBold,
  },
  pickupText: {
    color: colors.darkText,
  },
  dropText: {
    color: colors.primary,
  },
  placeName: {
    fontSize: moderateScale(14),
    fontFamily: fonts.bold,
    color: colors.darkText,
    marginBottom: verticalScale(4),
  },
  stopAddress: {
    fontSize: moderateScale(12),
    color: colors.grey,
    lineHeight: moderateScale(18),
  },
  orderDetailsCard: {
    backgroundColor: colors.background || '#F8F9FA',
    borderRadius: moderateScale(8),
    padding: scale(12),
    marginTop: verticalScale(10),
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  orderDetailLabel: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },
  orderDetailValue: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    color: colors.darkText,
  },
  tipColor: {
    color: colors.green,
  },
  orderTotalDivider: {
    height: 1,
    backgroundColor: colors.divider || '#E8E8E8',
    marginVertical: verticalScale(6),
  },
  orderTotalLabel: {
    fontSize: moderateScale(13),
    fontFamily: fonts.bold,
    color: colors.darkText,
  },
  orderTotalValue: {
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
    color: colors.secondary,
  },
  stopSpacer: {
    height: verticalScale(16),
  },

  // Order Breakdown Section (for multi-order trips)
  orderBreakdownSection: {
    marginTop: verticalScale(20),
    paddingHorizontal: scale(16),
  },
  orderBreakdownCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: colors.divider || '#E8E8E8',
  },
  orderBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  orderBreakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    flex: 1,
  },
  orderNumberBadge: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderNumberText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  orderBreakdownLabel: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    color: colors.darkText,
    marginBottom: verticalScale(2),
  },
  orderBreakdownTip: {
    fontSize: moderateScale(11),
    color: colors.grey,
  },
  orderBreakdownAmount: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  orderBreakdownDivider: {
    height: 1,
    backgroundColor: colors.divider || '#E8E8E8',
  },

  // Payment Summary
  paymentSummarySection: {
    marginTop: verticalScale(20),
    paddingHorizontal: scale(16),
  },
  paymentSummaryCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: colors.divider || '#E8E8E8',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  paymentLabel: {
    fontSize: moderateScale(13),
    color: colors.grey,
  },
  paymentValue: {
    fontSize: moderateScale(14),
    fontFamily: fonts.semiBold,
    color: colors.darkText,
  },
  positiveValue: {
    color: colors.green,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.divider || '#E8E8E8',
    marginVertical: verticalScale(8),
  },
  paymentTotalLabel: {
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
    color: colors.darkText,
  },
  paymentTotalValue: {
    fontSize: moderateScale(18),
    fontFamily: fonts.bold,
    color: colors.secondary,
  },

  // Footer
  footerNote: {
    marginTop: verticalScale(20),
    marginHorizontal: scale(16),
    padding: scale(16),
    backgroundColor: colors.background || '#F8F9FA',
    borderRadius: moderateScale(12),
  },
  footerText: {
    fontSize: moderateScale(13),
    color: colors.grey,
    textAlign: 'center',
    lineHeight: moderateScale(20),
    fontFamily: fonts.medium,
  },
  bottomSpace: {
    height: verticalScale(40),
  },
});