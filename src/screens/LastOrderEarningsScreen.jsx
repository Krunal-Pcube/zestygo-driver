import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CheckCircle2, Bike, MapPin, Clock, DollarSign } from 'lucide-react-native';
import { colors } from '../utils/colors';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

const LastOrderEarningsScreen = ({ navigation }) => {
  const orderDetails = {
    orderAmount: 18.05,
    type: 'Parcel Delivery',
    date: 'Mar 26 2026',
    orderId: '#ORD-230203',
    pickup: '1582 Queen St W, Toronto, ON M6R 1A6',
    dropoff: '825 Caledonia Rd, North York, ON M6B 3X8',
    distance: '4.2 km',
    duration: '22 min',
    baseFare: 12.00,
    distanceFare: 4.50,
    timeFare: 1.55,
    totalEarnings: 18.05,
    status: 'completed',
  };

  return (
    <View style={styles.container}>
      <Header title="Last Order Earnings" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <CheckCircle2 size={24} color={colors.green} />
            <Text style={styles.statusText}>Completed</Text>
          </View>
          <Text style={styles.orderId}>{orderDetails.orderId}</Text>
        </View>

        {/* Order Type & Date */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Bike size={18} color={colors.darkText} />
            <Text style={styles.infoLabel}>Order Type</Text>
            <Text style={styles.infoValue}>{orderDetails.type}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Clock size={18} color={colors.darkText} />
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{orderDetails.date}</Text>
          </View>
        </View>

        {/* Location Details */}
        <View style={styles.locationCard}>
          <View style={styles.locationItem}>
            <MapPin size={16} color={colors.green} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationValue} numberOfLines={2}>
                {orderDetails.pickup}
              </Text>
            </View>
          </View>
          <View style={styles.locationLine} />
          <View style={styles.locationItem}>
            <MapPin size={16} color={colors.orange} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Dropoff</Text>
              <Text style={styles.locationValue} numberOfLines={2}>
                {orderDetails.dropoff}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{orderDetails.distance}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{orderDetails.duration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>Earnings Breakdown</Text>
          
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Base Fare</Text>
            <Text style={styles.earningsValue}>${orderDetails.baseFare.toFixed(2)}</Text>
          </View>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Distance Fare</Text>
            <Text style={styles.earningsValue}>${orderDetails.distanceFare.toFixed(2)}</Text>
          </View>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Time Fare</Text>
            <Text style={styles.earningsValue}>${orderDetails.timeFare.toFixed(2)}</Text>
          </View>
          
          <View style={styles.earningsDivider} />
          
          <View style={styles.earningsRow}>
            <Text style={styles.totalLabel}>Total Earnings</Text>
            <Text style={styles.totalValue}>${orderDetails.totalEarnings.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  statusCard: {
    backgroundColor: colors.secondary,
    marginHorizontal: scale(16),
    marginTop: scale(16),
    borderRadius: scale(12),
    padding: scale(16),
    alignItems: 'center',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(8),
  },
  statusText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.green,
  },
  orderId: {
    fontSize: moderateScale(14),
    color: colors.mediumGrey,
  },
  infoRow: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
    marginTop: scale(16),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.divider,
    padding: scale(16),
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    gap: scale(6),
  },
  infoDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  infoLabel: {
    fontSize: moderateScale(12),
    color: colors.grey,
    marginTop: scale(4),
  },
  infoValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.darkText,
  },
  locationCard: {
    marginHorizontal: scale(16),
    marginTop: scale(16),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.divider,
    padding: scale(16),
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(12),
  },
  locationLine: {
    width: 1,
    height: scale(30),
    backgroundColor: colors.divider,
    marginLeft: scale(7),
    marginVertical: scale(8),
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: moderateScale(12),
    color: colors.grey,
    marginBottom: scale(2),
  },
  locationValue: {
    fontSize: moderateScale(14),
    color: colors.darkText,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginHorizontal: scale(16),
    marginTop: scale(16),
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.divider,
    padding: scale(16),
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: scale(4),
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },
  earningsCard: {
    marginHorizontal: scale(16),
    marginTop: scale(16),
    marginBottom: scale(16),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.divider,
    padding: scale(16),
  },
  earningsTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: scale(16),
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },
  earningsLabel: {
    fontSize: moderateScale(14),
    color: colors.mediumGrey,
  },
  earningsValue: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.darkText,
  },
  earningsDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: scale(12),
  },
  totalLabel: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.darkText,
  },
  totalValue: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    color: colors.green,
  },
});

export default LastOrderEarningsScreen;
