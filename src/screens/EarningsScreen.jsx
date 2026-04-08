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
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

const transactions = [
  {
    id: 1,
    title: 'Added to Wallet',
    date: 'Mon, 26 March',
    reference: '#123467',
    amount: 40,
    type: 'credit',
  },
  {
    id: 2,
    title: 'Trip Deducted',
    date: 'Mon, 26 March',
    reference: '#123467',
    amount: -50,
    type: 'debit',
  },
  {
    id: 3,
    title: 'Withdraw to Wallet',
    date: 'Sat, 23 March',
    reference: '#123467',
    amount: 110,
    type: 'credit',
  },
  {
    id: 4,
    title: 'Added to Wallet',
    date: 'Thu, 21 March',
    reference: '#123467',
    amount: 60,
    type: 'credit',
  },
  {
    id: 5,
    title: 'Added to Wallet',
    date: 'Wed, 20 March',
    reference: '#123467',
    amount: 78,
    type: 'credit',
  },
  {
    id: 6,
    title: 'Added to Wallet',
    date: 'Tue, 19 March',
    reference: '#123467',
    amount: 60,
    type: 'credit',
  },
];

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
          style={styles.tab}
          onPress={() => setActiveTab('earnings')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'earnings' && styles.tabTextActive]}>
            All Earnings
          </Text>
          {activeTab === 'earnings' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => setActiveTab('wallet')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'wallet' && styles.tabTextActive]}>
            Wallet
          </Text>
          {activeTab === 'wallet' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'earnings' ? (
          <>
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
          </>
        ) : (
          <>
            {/* Wallet Balance Card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Total balance</Text>
              <Text style={styles.balanceAmount}>${earningsData.today.toFixed(2)}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => navigation.navigate('Withdraw')}>
                <Text style={styles.actionButtonText}>Withdraw</Text>
              </TouchableOpacity>
              <View style={styles.buttonDivider} />
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => navigation.navigate('AddMoney')}>
                <Text style={styles.actionButtonText}>Add Money</Text>
              </TouchableOpacity>
            </View>

            {/* Transactions List */}
            <View style={styles.transactionsContainer}>
              {transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionDate}>
                      {transaction.date} • {transaction.reference}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.type === 'debit' && styles.debitAmount,
                    ]}
                  >
                    {transaction.type === 'debit' ? '-' : ''}
                    ${Math.abs(transaction.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
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
    paddingVertical: scale(12),
    position: 'relative',
  },
  tabActive: {
    // Active tab indicator
  },
  tabText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.medium,
    color: colors.mediumGrey,
  },
  tabTextActive: {
    color: colors.darkText,
    fontFamily: fonts.bold,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: scale(80),
    height: scale(3),
    backgroundColor: colors.primary,
    borderRadius: scale(2),
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
    fontFamily: fonts.medium,
    color: colors.mediumGrey,
    marginBottom: scale(4),
  },           
  earningsAmount: {
    fontSize: moderateScale(32),
    fontFamily: fonts.bold,
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
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.semiBold,
    color: colors.green,
  },
  orderInfo: {
    fontSize: moderateScale(13),
    color: colors.mediumGrey,
  },
  balanceCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: scale(12),
    paddingVertical: scale(24),
    alignItems: 'center',
    marginBottom: scale(16),
  },
  balanceLabel: {
    fontSize: moderateScale(14),
    fontFamily: fonts.medium,
    color: '#999',
    marginBottom: scale(8),
  },
  balanceAmount: {
    fontSize: moderateScale(32),
    fontFamily: fonts.bold,
    color: '#d4f935',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: scale(8),
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: scale(8),
  },
  actionButton: {
    flex: 1,
    paddingVertical: scale(12),
    alignItems: 'center',
  },
  buttonDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  actionButtonText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.semiBold,
    color: colors.darkText,
  },
  transactionsContainer: {
    marginTop: scale(8),
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(14),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: moderateScale(14),
    fontFamily: fonts.medium,
    color: colors.darkText,
    marginBottom: scale(4),
  },
  transactionDate: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },
  transactionAmount: {
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
    color: colors.darkText,
  },
  debitAmount: {
    color: colors.darkText,
  },
});

export default EarningsScreen;
