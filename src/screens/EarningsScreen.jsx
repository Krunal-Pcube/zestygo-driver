import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { ChevronRight, Banknote, PlusCircle } from 'lucide-react-native';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

const INDICATOR_WIDTH = scale(80);
const TABS = ['earnings', 'wallet'];

const transactions = [
  { id: 1, title: 'Added to Wallet',    date: 'Mon, 26 March', reference: '#123467', amount: 40,  type: 'credit' },
  { id: 2, title: 'Trip Deducted',      date: 'Mon, 26 March', reference: '#123467', amount: 50,  type: 'debit'  },
  { id: 3, title: 'Withdraw to Wallet', date: 'Sat, 23 March', reference: '#123467', amount: 110, type: 'credit' },
  { id: 4, title: 'Added to Wallet',    date: 'Thu, 21 March', reference: '#123467', amount: 60,  type: 'credit' },
  { id: 5, title: 'Added to Wallet',    date: 'Wed, 20 March', reference: '#123467', amount: 78,  type: 'credit' },
  { id: 6, title: 'Added to Wallet',    date: 'Tue, 19 March', reference: '#123467', amount: 60,  type: 'credit' },
];

const EarningsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabWidth, setTabWidth] = useState(0);
  const pagerRef = useRef(null);
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const earningsData = {
    today: 172.81,
    lastOrder: { amount: 18.05, type: 'Parcel Delivery', date: 'Mar 26 2026' },
  };

  const animateIndicator = (index, resolvedTabWidth) => {
    const tw = resolvedTabWidth ?? tabWidth;
    if (tw === 0) return;
    Animated.spring(indicatorAnim, {
      toValue: index * tw + (tw / 2) - (INDICATOR_WIDTH / 2),
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  };

  const handleTabContainerLayout = (e) => {
    const containerWidth = e.nativeEvent.layout.width;
    const computed = containerWidth / TABS.length;
    setTabWidth(computed);
    // Set initial indicator position without animation
    indicatorAnim.setValue((computed / 2) - (INDICATOR_WIDTH / 2));
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
    pagerRef.current?.setPage(index);
    animateIndicator(index);
  };

  const handlePageSelected = (e) => {
    const index = e.nativeEvent.position;
    setActiveTab(index);
    animateIndicator(index);
  };

  return (
    <View style={styles.container}>
      <Header title="Earnings" showBack={true} />

      {/* ── Tabs ── */}
      <View
        style={styles.tabContainer}
        onLayout={handleTabContainerLayout}
      >
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {tab === 'earnings' ? 'Earnings' : 'Wallet'}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Single sliding indicator */}
        <Animated.View
          style={[
            styles.tabIndicator,
            { transform: [{ translateX: indicatorAnim }] },
          ]}
        />
      </View>

      {/* ── Swipeable Pages ── */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {/* ── Page 0: Earnings ── */}
        <ScrollView
          key="earnings"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
        >
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>Today's Earnings</Text>
            <Text style={styles.earningsAmount}>${earningsData.today.toFixed(2)}</Text>
          </View>

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

          <TouchableOpacity
            style={styles.sectionItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('LastOrderEarnings')}
          >
            <View style={styles.sectionLeft}>
              <Text style={styles.sectionTitle}>Last Order Earnings</Text>
              <Text>
                <Text style={styles.orderAmount}>${earningsData.lastOrder.amount.toFixed(2)}</Text>
                <Text style={styles.orderInfo}> - {earningsData.lastOrder.type} - {earningsData.lastOrder.date}</Text>
              </Text>
            </View>
            <ChevronRight size={20} color={colors.grey} />
          </TouchableOpacity>
        </ScrollView>

        {/* ── Page 1: Wallet ── */}
        <ScrollView
          key="wallet"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
        >
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total balance</Text>
            <Text style={styles.balanceAmount}>${earningsData.today.toFixed(2)}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Withdraw')}
            >
              <Banknote size={moderateScale(18)} color={colors.darkText} strokeWidth={2} />
              <Text style={styles.actionButtonText}>Withdraw</Text>
            </TouchableOpacity>
       
          </View>

          <View style={styles.transactionsContainer}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDate}>
                    {transaction.date} • {transaction.reference}
                  </Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'debit' && styles.debitAmount,
                ]}>
                  {transaction.type === 'debit' ? '-' : '+'}${transaction.amount}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: scale(12),
    marginHorizontal: scale(8),
    marginTop: scale(8),
    paddingVertical: scale(8),
    position: 'relative',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: scale(12),
  },
  tabText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  tabTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: INDICATOR_WIDTH,
    height: scale(3),
    backgroundColor: colors.primary,
    borderRadius: scale(10),
  },

  // ── Pager ─────────────────────────────────────────────────────────────────
  pager: { flex: 1 },
  pageContent: {
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
    paddingBottom: scale(40),
  },

  // ── Earnings Tab ──────────────────────────────────────────────────────────
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
  sectionLeft: { flex: 1 },
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
  orderAmount: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    color: colors.green,
  },
  orderInfo: {
    fontSize: moderateScale(13),
    color: colors.mediumGrey,
  },

  // ── Wallet Tab ────────────────────────────────────────────────────────────
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
    color: colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: scale(8),
    borderWidth: 1,
    padding: scale(6),
    borderColor: colors.divider,
    borderRadius: scale(8),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    paddingVertical: scale(12),
  },
  buttonDivider: { width: 1, backgroundColor: colors.divider },
  actionButtonText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.semiBold,
    color: colors.darkText,
  },

  // ── Transactions ──────────────────────────────────────────────────────────
  transactionsContainer: { marginTop: scale(8) },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(14),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  transactionLeft: { flex: 1 },
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
    color: colors.green,
  },
  debitAmount: { color: colors.red ?? '#FF4444' },
});

export default EarningsScreen;