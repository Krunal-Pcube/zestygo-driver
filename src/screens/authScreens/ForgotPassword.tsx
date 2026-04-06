import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

import AuthHeader from '../../components/AuthHeader';
import CommonButton from '../../components/CommonBtn';
import fonts from '../../utils/fonts/fontsList';
import { colors } from '../../utils/colors';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // plug in API logic here
    navigation.navigate('OtpForgotPassword');
  }
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <AuthHeader
        title="Forgot Password?"
        subtitle="Please enter your existing phone/email address"
        image={require('../../assets/food.png')}

      />

      {/* BODY */}
      <View style={styles.formContainer}>

        {/* INPUT */}
        <TextInput
          style={styles.input}
          placeholder="Enter email or phone"
          placeholderTextColor="#999"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* SUBMIT BUTTON */}
        <View style={{ marginTop: scale(10) }}>
          <CommonButton
            title="Submit Now"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          />
        </View>

        {/* BACK TO LOGIN */}
        <View style={styles.backContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backLink}>Back to login</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: scale(30),
    paddingTop: scale(24),
  },

  // ── INPUT ────────────────────────────────────────────
  input: {
    fontFamily: fonts.regular,          // regular for input text
    backgroundColor: colors.background2,
    borderRadius: 12,
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
    fontSize: scale(16),
    color: '#333',
    marginBottom: scale(10),
  },

  // ── BACK TO LOGIN ────────────────────────────────────
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(4),
  },
  backLink: {
    fontFamily: fonts.semiBold,         // semiBold for tappable link
    fontSize: scale(13),
    color: '#333',
    textDecorationLine: 'underline',
  },
});

export default ForgotPassword;