import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../../components/Header';

const tripsData = [
  { id: 1, date: 'Mon, 26 March', trips: 25, amount: 78 },
  { id: 2, date: 'Mon, 24 March', trips: 25, amount: 78 },
  { id: 3, date: 'Sat, 23 March', trips: 25, amount: 60 },
  { id: 4, date: 'Fri, 22 March', trips: 25, amount: 110 },
  { id: 5, date: 'Thu, 21 March', trips: 25, amount: 50 },
  { id: 6, date: 'Wed, 20 March', trips: 25, amount: 40 },
  { id: 7, date: 'Tue, 19 March', trips: 25, amount: 45 },
  { id: 8, date: 'Mon, 18 March', trips: 25, amount: 40 },
  { id: 9, date: 'Sun, 17 March', trips: 28, amount: 40 },
  { id: 10, date: 'Sat, 16 March', trips: 45, amount: 40 },
  { id: 11, date: 'Fri, 15 March', trips: 225, amount: 40 },
];

const TripHistoryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header title="Trips History" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {tripsData.map((item) => (
          <View key={item.id} style={styles.tripItem}>
            <View style={styles.tripLeft}>
              <Text style={styles.tripDate}>{item.date}</Text>
              <Text style={styles.tripCount}>{item.trips} Trips</Text>
            </View>
            <Text style={styles.tripAmount}>${item.amount}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tripLeft: {
    flex: 1,
  },
  tripDate: {
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
    color: colors.darkText,
    marginBottom: scale(4),
  },
  tripCount: {
    fontSize: moderateScale(13),
    color: colors.grey,
  },
  tripAmount: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: colors.darkText,
  },
});

export default TripHistoryScreen;
