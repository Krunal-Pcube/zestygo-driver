import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import AuthHeader from '../components/AuthHeader';
import CommonButton from '../components/CommonBtn';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { verifyForgotPasswordOtp } from '../MVC/Model/authApi';
import { ForgotPasswordVerifyOTPController } from '../MVC/controllers/authController';
import { getPhoneCode } from '../utils/countryCode';
import fonts from '../utils/fonts/fontsList';

const { width } = Dimensions.get('window');

const OtpForgotPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type, value } = route.params;

  const otpLength = 6;
  const [otp, setOtp] = useState(new Array(otpLength).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const phoneCode = getPhoneCode();

  // ✅ Auto focus first box
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
  }, []);

  const maskPhone = number => (number ? `******${number.slice(-4)}` : '');

  const maskEmail = email => {
    const [n, d] = email?.split('@') || [];
    return d ? `${n.slice(0, 2)}****@${d}` : '';
  };

  const subtitle =
    type === 'email'
      ? `Please type the code sent to ${maskEmail(value)}`
      : `Please type the code sent to ${maskPhone(value)}`;

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter 6 digit OTP',
        position: 'top',
      });
      return;
    }

    setLoading(true);

    const payload = {
      otp: enteredOtp,
      ...(type === 'email'
        ? { email: value }
        : { country_code: phoneCode, contact_number: value }),
    };

    try {
      await ForgotPasswordVerifyOTPController({
        payload,
        navigation,
      });
    } catch (error) {
      // ✅ Controller already shows toast
      console.log(
        'OtpForgotPassword Screen Error :::',
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= OTP INPUT HANDLERS =================
  const handleChange = (text, index) => {
    if (text.length > 1) text = text.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="OTP Verification"
        subtitle={subtitle}
        image={require('../../src/assets/icons/food.png')}
      />

      <View style={styles.formContainer}>
        {/* OTP BOXES */}
        <View style={styles.otpWrapper}>
          {otp.map((val, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[styles.otpBox, otp[index] && styles.otpFilled]}
              keyboardType="numeric"
              maxLength={1}
              value={otp[index]}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                nativeEvent.key === 'Backspace' &&
                handleBackspace(otp[index], index)
              }
            />
          ))}
        </View>

        {/* BUTTON */}
        <CommonButton
          title="Verify & Proceed"
          onPress={handleVerifyOtp}
          loading={loading}
          disabled={loading}
        />

        {/* RESEND */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Didn't receive OTP code? </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.signupLink}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  formContainer: {
    flex: 1,
    paddingHorizontal: scale(30),
    paddingTop: scale(24),
  },

  otpWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(25),
    marginBottom: scale(25),
  },

  otpBox: {
    width: width * 0.123,
    height: scale(60),
    fontFamily: fonts.medium,
    borderWidth: 1,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: scale(22),
    borderColor: '#dcdcdc',
  },

  otpFilled: {
    borderColor: '#00C27A',
    shadowColor: '#00C27A',
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: scale(25),
  },

  signupText: {
    fontFamily: fonts.medium,
    fontSize: scale(13),
    color: '#666',
  },

  signupLink: {
    fontFamily: fonts.semiBold,
    fontSize: scale(13),
    color: '#333',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default OtpForgotPassword;
