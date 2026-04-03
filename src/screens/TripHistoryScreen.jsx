import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';

function TripHistoryScreen() {
  const trips = [
    {id: 1, date: 'Mar 30, 2026', from: 'Santa Clara', to: 'San Jose', fare: 24.50},
    {id: 2, date: 'Mar 29, 2026', from: 'Cupertino', to: 'Mountain View', fare: 18.75},
    {id: 3, date: 'Mar 28, 2026', from: 'Palo Alto', to: 'Menlo Park', fare: 15.00},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip History</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {trips.map(trip => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripDate}>{trip.date}</Text>
              <Text style={styles.tripFare}>${trip.fare.toFixed(2)}</Text>
            </View>
            <View style={styles.tripRoute}>
              <Icon name="location" size={16} color={colors.accentBlue} />
              <Text style={styles.routeText}>{trip.from}</Text>
              <Icon name="arrow-forward" size={16} color={colors.grey} />
              <Text style={styles.routeText}>{trip.to}</Text>
            </View>
          </View>
        ))}
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
    padding: 20,
    backgroundColor: colors.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.darkText,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    backgroundColor: colors.headerBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tripDate: {
    fontSize: 14,
    color: colors.mediumGrey,
  },
  tripFare: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.green,
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 14,
    color: colors.darkText,
  },
});

export default TripHistoryScreen;
