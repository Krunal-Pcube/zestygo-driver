import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../utils/colors';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

const EarningsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('earnings');

  const earningsData = {
    today: 172.81,
    lastOrder: {
      amount: 18.05,
      type: 'Parcel Delivery',
      date: 'Mar 26 2026',
    },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        title="Earnings" 
        showBack={true}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'earnings' && styles.tabActive]}
          onPress={() => setActiveTab('earnings')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'earnings' && styles.tabTextActive]}>
            All Earnings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'wallet' && styles.tabActive]}
          onPress={() => navigation.navigate('Wallet')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'wallet' && styles.tabTextActive]}>
            Wallet
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Today's Earnings Card */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Today's Earnings</Text>
          <Text style={styles.earningsAmount}>${earningsData.today.toFixed(2)}</Text>
        </View>

        {/* All Orders Section */}
        <TouchableOpacity 
          style={styles.sectionItem} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AllOrders')}
        >
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>All Orders</Text>
            <Text style={styles.sectionSubtitle}>Order history and Order Earnings</Text>
          </View>
          <ChevronRight size={20} color={colors.grey} />
        </TouchableOpacity>

        {/* Last Order Earnings Section */}
        <TouchableOpacity style={styles.sectionItem} activeOpacity={0.7} onPress={() => navigation.navigate('LastOrderEarnings')}>
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>Last Order Earnings</Text>
            <Text style={styles.orderDetail}>
              <Text style={styles.orderAmount}>${earningsData.lastOrder.amount.toFixed(2)}</Text>
              <Text style={styles.orderInfo}> - {earningsData.lastOrder.type} - {earningsData.lastOrder.date}</Text>
            </Text>
          </View>
          <ChevronRight size={20} color={colors.grey} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: scale(8),
  },
  tabActive: {
    // Active tab indicator
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.mediumGrey,
  },
  tabTextActive: {
    color: colors.darkText,
    fontWeight: '700',
  },
  tabDivider: {
    width: 1,
    height: scale(20),
    backgroundColor: colors.divider,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
  },
  earningsCard: {
    backgroundColor: colors.secondary,
    borderRadius: scale(12),
    paddingVertical: scale(24),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    marginBottom: scale(24),
  },
  earningsLabel: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: colors.mediumGrey,
    marginBottom: scale(4),
  },           
  earningsAmount: {
    fontSize: moderateScale(32),
    fontWeight: '800',
    color: colors.primary,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sectionLeft: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: scale(2),
  },
  sectionSubtitle: {
    fontSize: moderateScale(12),
    color: colors.mediumGrey,
  },
  orderDetail: {
    flexDirection: 'row',
  },
  orderAmount: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: colors.green,
  },
  orderInfo: {
    fontSize: moderateScale(13),
    color: colors.mediumGrey,
  },
});

export default EarningsScreen;
