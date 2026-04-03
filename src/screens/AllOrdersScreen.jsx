import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ChevronLeft, Bike, MapPin, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../utils/colors';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

const dates = [
  { day: 'Wed', date: '24' },
  { day: 'Wed', date: '25' },
  { day: 'Thu', date: '26', active: true },
];

const orders = [
  {
    id: 1,
    type: 'Bike',
    amount: 18.05,
    pickup: '1582 Queen St W, Toronto, ON M6R 1A6,...',
    dropoff: '825 Caledonia Rd, North York, ON M6B 3X8,...',
    status: 'completed',
  },
  {
    id: 2,
    type: 'Bike',
    amount: 18.05,
    pickup: '1582 Queen St W, Toronto, ON M6R 1A6,...',
    dropoff: '825 Caledonia Rd, North York, ON M6B 3X8,...',
    status: 'completed',
  },
  {
    id: 3,
    type: 'Bike',
    amount: 18.05,
    pickup: '1582 Queen St W, Toronto, ON M6R 1A6,...',
    dropoff: '825 Caledonia Rd, North York, ON M6B 3X8,...',
    status: 'completed',
  },
];

function AllOrdersScreen({ navigation }) {
  const [periodTab, setPeriodTab] = useState('day');
  const [statusTab, setStatusTab] = useState('completed');
  const [selectedDate, setSelectedDate] = useState('26');

  return (
    <View style={styles.container}>
      <Header title="All Orders" navigation={navigation} showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Period Tabs */}
        <View style={styles.periodTabs}>
          <TouchableOpacity
            style={[styles.periodTab, periodTab === 'day' && styles.periodTabActive]}
            onPress={() => setPeriodTab('day')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodTabText, periodTab === 'day' && styles.periodTabTextActive]}>
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodTab, periodTab === 'week' && styles.periodTabActive]}
            onPress={() => setPeriodTab('week')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodTabText, periodTab === 'week' && styles.periodTabTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodTab, periodTab === 'month' && styles.periodTabActive]}
            onPress={() => setPeriodTab('month')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodTabText, periodTab === 'month' && styles.periodTabTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Selector */}
        <View style={styles.dateSelector}>
          {dates.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dateBox, selectedDate === item.date && styles.dateBoxActive]}
              onPress={() => setSelectedDate(item.date)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateDay, selectedDate === item.date && styles.dateTextActive]}>
                {item.day}
              </Text>
              <Text style={[styles.dateNum, selectedDate === item.date && styles.dateTextActive]}>
                {item.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>25</Text>
            <Text style={styles.statLabel}>Complete Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$78</Text>
            <Text style={styles.statLabel}>Order Earnings</Text>
          </View>
        </View>

        {/* Order History Section */}
        <View style={styles.orderHistorySection}>
          <Text style={styles.sectionTitle}>Order History</Text>
          
          {/* Status Tabs */}
          <View style={styles.statusTabs}>
            <TouchableOpacity
              style={[styles.statusTab, statusTab === 'completed' && styles.statusTabActive]}
              onPress={() => setStatusTab('completed')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusTabText, statusTab === 'completed' && styles.statusTabTextActive]}>
                Completed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusTab, statusTab === 'cancelled' && styles.statusTabActive]}
              onPress={() => setStatusTab('cancelled')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusTabText, statusTab === 'cancelled' && styles.statusTabTextActive]}>
                Cancelled
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Header */}
          <Text style={styles.dateHeader}>26 March 2026</Text>

          {/* Orders List */}
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderTypeRow}>
                  <Bike size={18} color={colors.darkText} />
                  <Text style={styles.orderType}>{order.type}</Text>
                </View>
                <View style={styles.orderAmountRow}>
                  <Text style={styles.orderAmount}>${order.amount.toFixed(2)}</Text>
                  <CheckCircle2 size={16} color={colors.green} />
                </View>
              </View>

              <View style={styles.addressRow}>
                <MapPin size={14} color={colors.grey} />
                <Text style={styles.addressText} numberOfLines={1}>
                  {order.pickup}
                </Text>
              </View>

              <View style={styles.addressRow}>
                <MapPin size={14} color={colors.grey} />
                <Text style={styles.addressText} numberOfLines={1}>
                  {order.dropoff}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  periodTabs: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    gap: scale(8),
  },
  periodTab: {
    flex: 1,
    backgroundColor: colors.veryLightGrey,
    paddingVertical: scale(10),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: colors.secondary,
  },
  periodTabText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.darkText,
  },
  periodTabTextActive: {
    color: colors.primary,
  },
  dateSelector: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    gap: scale(12),
  },
  dateBox: {
    backgroundColor: colors.veryLightGrey,
    borderRadius: scale(10),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    alignItems: 'center',
    minWidth: scale(60),
  },
  dateBoxActive: {
    backgroundColor: colors.secondary,
  },
  dateDay: {
    fontSize: moderateScale(12),
    color: colors.mediumGrey,
    marginBottom: scale(2),
  },
  dateNum: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.darkText,
  },
  dateTextActive: {
    color: colors.primary,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
    marginVertical: scale(16),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.divider,
    paddingVertical: scale(16),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: scale(4),
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: colors.mediumGrey,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  orderHistorySection: {
    paddingHorizontal: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: scale(12),
  },
  statusTabs: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: scale(16),
  },
  statusTab: {
    backgroundColor: colors.veryLightGrey,
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(8),
  },
  statusTabActive: {
    backgroundColor: colors.secondary,
  },
  statusTabText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: colors.darkText,
  },
  statusTabTextActive: {
    color: colors.primary,
  },
  dateHeader: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: scale(12),
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: colors.divider,
    padding: scale(16),
    marginBottom: scale(12),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  orderTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  orderType: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.darkText,
  },
  orderAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  orderAmount: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: colors.green,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(6),
  },
  addressText: {
    fontSize: moderateScale(13),
    color: colors.grey,
    flex: 1,
  },
});

export default AllOrdersScreen;
