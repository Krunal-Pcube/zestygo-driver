import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors } from '../utils/colors';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

const quickAmounts = [10, 100, 500];

const WithdrawScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const availableBalance = 172.81;

  const handleQuickAdd = (value) => {
    const currentAmount = parseFloat(amount) || 0;
    const newAmount = (currentAmount + value).toFixed(2);
    setAmount(newAmount);
  };

  const handleSubmit = () => {
    // Handle submit logic
    console.log('Withdrawing money:', amount);
  };

  return (
    <View style={styles.container}>
      <Header title="Withdraw" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Available Balance */}
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <Text style={styles.balanceValue}>${availableBalance.toFixed(2)}</Text>
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.grey}
          />
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmountsRow}>
          {quickAmounts.map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.quickAmountButton}
              onPress={() => handleQuickAdd(value)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickAmountText}>+{value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bank Account Section */}
        <View style={styles.bankSection}>
          <Text style={styles.bankLabel}>To Bank Account</Text>
          <View style={styles.bankCard}>
            <Text style={styles.bankName}>Standard Chartered Bank</Text>
            <Text style={styles.bankNumber}>**** 3315</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: scale(20),
    paddingBottom: scale(8),
  },
  balanceLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.darkText,
  },
  balanceValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.darkText,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: scale(8),
    marginHorizontal: scale(16),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  dollarSign: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: colors.darkText,
    marginRight: scale(4),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: colors.darkText,
    padding: 0,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginHorizontal: scale(16),
    marginTop: scale(16),
  },
  quickAmountButton: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    backgroundColor: colors.white,
  },
  quickAmountText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.darkText,
  },
  bankSection: {
    marginTop: scale(32),
    paddingHorizontal: scale(16),
  },
  bankLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.darkText,
    marginBottom: scale(12),
  },
  bankCard: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
  },
  bankName: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.darkText,
  },
  bankNumber: {
    fontSize: moderateScale(13),
    color: colors.grey,
    marginTop: scale(2),
  },
  bottomContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  submitButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: scale(8),
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#d4f935',
  },
});

export default WithdrawScreen;
