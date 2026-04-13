import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Phone, User, Heart, Shield, Flame, Siren } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Header from '../components/Header';

const EmergencyContactScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  const isValid = name.trim() && phone.trim().length >= 10;

  const emergencyNumbers = [
    { icon: <Shield size={22} color="#FFFFFF" />, label: 'Police', number: '100', color: '#1a73e8' },
    { icon: <Heart size={22} color="#FFFFFF" />, label: 'Ambulance', number: '108', color: '#d93025' },
    { icon: <Flame size={22} color="#FFFFFF" />, label: 'Fire', number: '101', color: '#ea4335' },
    { icon: <Siren size={22} color="#FFFFFF" />, label: 'Emergency', number: '112', color: '#f9ab00' },
  ];

  const handleEmergencyCall = (label, number) => {
    Alert.alert(
      'Emergency Call',
      `Call ${label} (${number})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title="Emergency Contact" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >
    
        {/* Emergency Services Section */}
        <Text style={[styles.emergencySectionTitle, { color: colors.grey }]}>Emergency Services</Text>
        <View style={styles.emergencyGrid}>
          {emergencyNumbers.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.emergencyButton, { backgroundColor: item.color }]}
              onPress={() => handleEmergencyCall(item.label, item.number)}
              activeOpacity={0.8}
            >
              {item.icon}
              <Text style={styles.emergencyLabel}>{item.label}</Text>
              <Text style={styles.emergencyNumber}>{item.number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.emergencyNote}>
          Tap any button to call emergency services immediately
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: verticalScale(20),
  },
  infoCard: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(20),
    borderRadius: scale(12),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  infoText: {
    flex: 1,
    fontSize: moderateScale(13),
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  inputCard: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
    borderRadius: scale(12),
    padding: scale(16),
  },
  label: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    marginBottom: verticalScale(10),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(15),
    fontFamily: fonts.regular,
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
  },
  saveButton: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(30),
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#EDEDED',
  },
  saveButtonText: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
  },
  saveButtonTextDisabled: {
    color: '#767774',
  },
  emergencySectionTitle: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: scale(16),
    gap: scale(10),
  },
  emergencyButton: {
    width: (scale(360) - scale(52)) / 2,
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    gap: verticalScale(6),
  },
  emergencyLabel: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    color: '#FFFFFF',
    marginTop: verticalScale(4),
  },
  emergencyNumber: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
  emergencyNote: {
    fontSize: moderateScale(11),
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(30),
  },
});

export default EmergencyContactScreen;
