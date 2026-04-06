import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '../utils/colors';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  {
    id: 1,
    question: 'I Forgot my password',
    answer: 'You can reset your password by going to the login screen and clicking on "Forgot Password". Follow the instructions sent to your registered email or phone number to create a new password.',
  },
  {
    id: 2,
    question: 'How to withdraw balance',
    answer: 'To withdraw your balance, go to Wallet → Withdraw. Enter the amount you want to withdraw and select your bank account. The money will be transferred to your bank account within 1-3 business days.',
  },
  {
    id: 3,
    question: 'What is summary',
    answer: 'The summary shows your complete earnings breakdown including base fare, distance fare, time fare, and any bonuses or incentives you have earned during a specific period.',
  },
  {
    id: 4,
    question: 'How to earn extra money',
    answer: 'You can earn extra money by completing more trips during peak hours, accepting more delivery requests, maintaining high ratings, and participating in special promotions and bonus programs.',
  },
  {
    id: 5,
    question: "Don't charge rider",
    answer: 'If you need to cancel a charge for a rider, please contact customer support immediately through the Help section. Provide the trip details and reason for not charging the rider.',
  },
];

const AccordionItem = ({ item, isExpanded, onToggle }) => {
  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        style={styles.questionRow}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{item.question}</Text>
        <ChevronDown
          size={20}
          color={colors.grey}
          style={[styles.chevron, isExpanded && styles.chevronExpanded]}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

const HelpScreen = ({ navigation }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Header title="Help" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {faqData.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isExpanded={expandedId === item.id}
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
  questionText: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: colors.darkText,
    flex: 1,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  answerContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
    paddingTop: 0,
  },
  answerText: {
    fontSize: moderateScale(14),
    color: colors.mediumGrey,
    lineHeight: moderateScale(20),
  },
});

export default HelpScreen;
