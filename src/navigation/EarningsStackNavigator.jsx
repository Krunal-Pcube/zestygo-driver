import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EarningsScreen from '../screens/EarningsScreen';
import AllOrdersScreen from '../screens/AllOrdersScreen';
import WalletScreen from '../screens/WalletScreen';
import AddMoneyScreen from '../screens/AddMoneyScreen';
import WithdrawScreen from '../screens/WithdrawScreen';
import LastOrderEarningsScreen from '../screens/LastOrderEarningsScreen';

const Stack = createStackNavigator();

const EarningsStackNavigator = () => {
  return (
    <Stack.Navigator id="earningsStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EarningsMain" component={EarningsScreen} />
      <Stack.Screen name="AllOrders" component={AllOrdersScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Withdraw" component={WithdrawScreen} />
      <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
      <Stack.Screen name="LastOrderEarnings" component={LastOrderEarningsScreen} />
    </Stack.Navigator>
  );
}

export default EarningsStackNavigator;
