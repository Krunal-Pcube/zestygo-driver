/**
 * TripDetailsScreen.jsx
 * Detailed trip summary showing earnings breakdown and route info
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
import { ArrowLeft, MapPin, Circle } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../utils/colors';

export default function TripDetailsScreen({ navigation, route }) {
  const {
    tripId = '#0001',
    amount = '18.05',
    customerName = 'Kelsey',
    date = 'March 26, 2026',
    time = '10:28 AM',
    duration = '40 min 25 sec',
    distance = '11 km',
    vehicleType = 'Bike',
    paymentMethod = 'Cash',
    pickup = {
      address: '1582 Queen St W, Toronto,',
      city: 'ON M6R 1A6, Canada',
    },
    dropoff = {
      address: '825 Caledonia Rd, North York,',
      city: 'ON M6B 3X8, Canada',
    },
    fare = '18.06',
    taxes = '0.1',
    totalEarning = '18.05',
    payouts = '18.05',
  } = route?.params || {};

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={moderateScale(24)} color={colors.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trip Info */}
        <View style={styles.tripInfoSection}>
          <Text style={styles.tripMeta}>
            {vehicleType} • {date} • {time}
          </Text>
          <Text style={styles.amount}>${amount}</Text>
          <Text style={styles.paymentStatus}>
            Payment made successfully by {paymentMethod}
          </Text>
        </View>

        {/* Duration & Distance */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{duration}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{distance}</Text>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>🗺️</Text>
            <Text style={styles.mapSubtext}>Route Map</Text>
          </View>
        </View>

        {/* Route Info */}
        <View style={styles.routeSection}>
          {/* Pickup */}
          <View style={styles.routeItem}>
            <View style={styles.routeIconBg}>
              <MapPin size={moderateScale(14)} color={colors.white} />
            </View>
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeAddress}>{pickup.address}</Text>
              <Text style={styles.routeCity}>{pickup.city}</Text>
            </View>
          </View>

          {/* Connector */}
          <View style={styles.connector}>
            <View style={styles.dottedLine} />
          </View>

          {/* Dropoff */}
          <View style={styles.routeItem}>
            <View style={[styles.routeIconBg, styles.dropoffIconBg]}>
              <Circle size={moderateScale(10)} color={colors.white} fill={colors.white} />
            </View>
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeAddress}>{dropoff.address}</Text>
              <Text style={styles.routeCity}>{dropoff.city}</Text>
            </View>
          </View>
        </View>

        {/* Earnings Section */}
        <View style={styles.earningsSection}>
          <Text style={styles.sectionTitle}>Your Earning</Text>
          
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Fare</Text>
            <Text style={styles.earningsValue}>${fare}</Text>
          </View>
          
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Taxes</Text>
            <Text style={[styles.earningsValue, styles.negativeValue]}>-${taxes}</Text>
          </View>
          
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Total Earning</Text>
            <Text style={styles.earningsValue}>${totalEarning}</Text>
          </View>
          
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Payouts</Text>
            <Text style={styles.earningsValue}>${payouts}</Text>
          </View>
        </View>

        {/* Payments Section */}
        <View style={styles.paymentsSection}>
          <View style={styles.paymentsHeader}>
            <Text style={styles.sectionTitle}>Your payments</Text>
            <Text style={styles.paymentsAmount}>${payouts}</Text>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            This trip was towards your destination you received Guaranteed fare
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: scale(40),
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.secondary,
  },
  headerPlaceholder: {
    width: scale(40),
  },
  scrollView: {
    flex: 1,
  },
  tripInfoSection: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
  },
  tripMeta: {
    fontSize: moderateScale(13),
    color: colors.grey,
    marginBottom: verticalScale(8),
  },
  amount: {
    fontSize: moderateScale(32),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(4),
  },
  paymentStatus: {
    fontSize: moderateScale(13),
    color: colors.grey,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: colors.grey,
    marginBottom: verticalScale(4),
  },
  statValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.secondary,
  },
  statDivider: {
    width: 1,
    height: verticalScale(30),
    backgroundColor: '#E0E0E0',
  },
  mapContainer: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(20),
  },
  mapPlaceholder: {
    height: verticalScale(200),
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mapText: {
    fontSize: moderateScale(48),
    marginBottom: verticalScale(8),
  },
  mapSubtext: {
    fontSize: moderateScale(14),
    color: colors.grey,
  },
  routeSection: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(24),
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeIconBg: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
    marginTop: verticalScale(2),
  },
  dropoffIconBg: {
    backgroundColor: '#4CAF50',
  },
  routeTextContainer: {
    flex: 1,
  },
  routeAddress: {
    fontSize: moderateScale(14),
    color: colors.secondary,
    fontWeight: '500',
    lineHeight: moderateScale(20),
  },
  routeCity: {
    fontSize: moderateScale(13),
    color: colors.grey,
    lineHeight: moderateScale(18),
  },
  connector: {
    paddingLeft: scale(14),
    marginVertical: verticalScale(8),
  },
  dottedLine: {
    width: 1,
    height: verticalScale(24),
    borderLeftWidth: 1,
    borderLeftColor: '#C0C0C0',
    borderStyle: 'dashed',
    marginLeft: scale(0),
  },
  earningsSection: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: verticalScale(12),
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  earningsLabel: {
    fontSize: moderateScale(14),
    color: colors.grey,
  },
  earningsValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.secondary,
  },
  negativeValue: {
    color: '#666',
  },
  paymentsSection: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  paymentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentsAmount: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.secondary,
  },
  footerNote: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
  },
  footerText: {
    fontSize: moderateScale(12),
    color: colors.grey,
    textAlign: 'center',
    lineHeight: moderateScale(18),
  },
  bottomSpace: {
    height: verticalScale(40),
  },
});
