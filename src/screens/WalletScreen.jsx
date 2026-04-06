import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../utils/colors';
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

const WalletScreen = ({ navigation }) => {
  const totalBalance = 172.81;

  return (
    <View style={styles.container}>
      <Header title="Wallet" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total balance</Text>
          <Text style={styles.balanceAmount}>${totalBalance.toFixed(2)}</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  balanceCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: scale(12),
    marginHorizontal: scale(16),
    marginTop: scale(16),
    paddingVertical: scale(24),
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#999',
    marginBottom: scale(8),
  },
  balanceAmount: {
    fontSize: moderateScale(32),
    fontWeight: '800',
    color: '#d4f935',
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
    marginTop: scale(16),
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
    fontWeight: '600',
    color: colors.darkText,
  },
  transactionsContainer: {
    marginHorizontal: scale(16),
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
    fontWeight: '500',
    color: colors.darkText,
    marginBottom: scale(4),
  },
  transactionDate: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },
  transactionAmount: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: colors.darkText,
  },
  debitAmount: {
    color: colors.darkText,
  },
});

export default WalletScreen;
