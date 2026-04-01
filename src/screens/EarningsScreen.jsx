import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function EarningsScreen() {
  const earnings = {
    today: 85.50,
    week: 540.25,
    month: 2150.00,
    total: 154.75,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Icon name="wallet" size={40} color="#4A90D9" />
          <Text style={styles.cardLabel}>Total Balance</Text>
          <Text style={styles.cardAmount}>${earnings.total.toFixed(2)}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statAmount}>${earnings.today.toFixed(2)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statAmount}>${earnings.week.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statAmount}>${earnings.month.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  cardAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90D9',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
});

export default EarningsScreen;
