import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  {
    id: 1,
    category: 'Account',
    question: 'I forgot my password',
    answer:
      'You can reset your password by going to the login screen and tapping "Forgot Password". Follow the instructions sent to your registered email or phone number to create a new password.',
  },
  {
    id: 2,
    category: 'Account',
    question: 'How do I verify my documents?',
    answer:
      'Navigate to Profile → Documents. Upload clear photos of your driving license, vehicle registration, and identity proof. Verification usually takes 24–48 hours. You will receive a notification once approved.',
  },
  {
    id: 3,
    category: 'Earnings & Payments',
    question: 'How do I withdraw my balance?',
    answer:
      'Go to Wallet → Withdraw. Enter the amount and select your linked bank account. Funds are transferred within 1–3 business days. Make sure your bank details are verified before requesting a withdrawal.',
  },
  {
    id: 4,
    category: 'Earnings & Payments',
    question: 'How are my earnings calculated?',
    answer:
      'Your earnings include a base pickup fee, per-kilometre distance fare, and a time-based fare during active deliveries. Surge pricing applies during peak hours, bad weather, or high-demand zones and is shown before you accept an order.',
  },
  {
    id: 5,
    category: 'Earnings & Payments',
    question: 'Why was my payment delayed?',
    answer:
      'Payments may be delayed due to bank processing times, public holidays, or a pending account review. If your payment is delayed by more than 5 business days, please contact support with your transaction ID.',
  },
  {
    id: 6,
    category: 'Orders & Deliveries',
    question: 'What should I do if a restaurant is closed?',
    answer:
      'If you arrive and the restaurant is closed or not accepting orders, tap "Report Issue" on the order screen and select "Restaurant Closed". The order will be cancelled without affecting your completion rate.',
  },
  {
    id: 7,
    category: 'Orders & Deliveries',
    question: 'What if a customer is not available at delivery?',
    answer:
      'Wait at least 5 minutes and attempt to call the customer. If there is no response, tap "Customer Unavailable", take a photo proof of the location, and follow the on-screen steps. Your earnings for the trip will still be processed.',
  },
  {
    id: 8,
    category: 'Orders & Deliveries',
    question: 'Can I cancel an order after accepting it?',
    answer:
      'You can cancel before picking up the order, but frequent cancellations will negatively affect your acceptance rate and may result in fewer order requests. To cancel, tap the order and select "Cancel Order" with a reason.',
  },
  {
    id: 9,
    category: 'Ratings & Performance',
    question: 'How is my rating calculated?',
    answer:
      'Your rating is an average of the last 100 customer reviews. Ratings below 4.2 may temporarily limit your access to high-value orders. Focus on timely deliveries, polite communication, and handling food carefully to maintain a high score.',
  },
  {
    id: 10,
    category: 'App & Technical',
    question: 'The app is not showing orders near me',
    answer:
      'Ensure your location permissions are set to "Always Allow", your internet connection is stable, and you are marked as "Online". If the issue persists, force-close the app, clear the cache, and reopen it.',
  },
];

const AccordionItem = ({ item, isExpanded, onToggle }) => {
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  const handleToggle = () => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    onToggle();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        style={[styles.questionRow, isExpanded && styles.questionRowExpanded]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.questionText, isExpanded && styles.questionTextExpanded]}>
          {item.question}
        </Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <ChevronDown size={20} color={isExpanded ? colors.primary : colors.grey} />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.answerContainer}>
          <View style={styles.answerDivider} />
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

const HelpScreen = ({ navigation }) => {
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Help" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {faqData.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isExpanded={expandedIds.includes(item.id)}
            onToggle={() => toggleExpand(item.id)}
          />
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
  listContent: {
    paddingBottom: scale(24),
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(18),
  },
  questionRowExpanded: {
    paddingBottom: scale(14),
    backgroundColor: colors.secondary,

  },
  questionText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.medium,
    color: colors.darkText, 
    flex: 1,
    marginRight: scale(8),
  },
  questionTextExpanded: {
    color: colors.primary,
  },
  answerContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
  },
  answerDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: scale(12),
  },
  answerText: {
    fontSize: moderateScale(14),
    color: colors.mediumGrey,
    lineHeight: moderateScale(22),
    fontFamily: fonts.regular,
  },
});

export default HelpScreen;