import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

import AuthHeader from '../../components/AuthHeader';
import CommonButton from '../../components/CommonBtn';
import fonts from '../../utils/fonts/fontsList';
import { colors } from '../../utils/colors';

const { width } = Dimensions.get('window');

const OtpForgotPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { type, value } = route.params ?? { type: 'phone', value: '1234567890' };

  const otpLength = 6;
  const [otp, setOtp] = useState(new Array(otpLength).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // ── MASK HELPERS ─────────────────────────────────────
  const maskPhone = number => (number ? `******${number.slice(-4)}` : '');

  const maskEmail = email => {
    const [n, d] = email?.split('@') || [];
    return d ? `${n.slice(0, 2)}****@${d}` : '';
  };

  const subtitle =
    type === 'email'
      ? `Please type the code sent to ${maskEmail(value)}`
      : `Please type the code sent to ${maskPhone(value)}`;

  // ── AUTO FOCUS ────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // ── OTP HANDLERS ─────────────────────────────────────
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

  const handleVerify = () => {
    // plug in API logic here
    navigation.navigate('ResetPassword');
  };

  const handleResend = () => {
    // plug in resend API logic here
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <AuthHeader
        title="OTP Verification"
        subtitle={subtitle}
        image={require('../../assets/food.png')}

      />


      {/* BODY */}
      <View style={styles.formContainer}>

        {/* OTP BOXES */}
        <View style={styles.otpWrapper}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.otpBox,
                otp[index] !== '' && styles.otpFilled,
              ]}
              keyboardType="numeric"
              maxLength={1}
              value={otp[index]}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(otp[index], index);
                }
              }}
            />
          ))}
        </View>

        {/* VERIFY BUTTON */}
        <CommonButton
          title="Verify & Proceed"
          onPress={handleVerify}
          loading={loading}
          disabled={loading}
        />

        {/* RESEND */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive OTP code? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={handleResend}>
            <Text style={styles.resendLink}>Resend OTP</Text>
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

  // ── OTP BOXES ────────────────────────────────────────
  otpWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(25),
    marginBottom: scale(25),
  },
  otpBox: {
    fontFamily: fonts.semiBold,       // semiBold so digits feel prominent
    width: width * 0.123,
    height: scale(60),
    borderWidth: 1,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: scale(22),
    color: '#000',
    borderColor: '#dcdcdc',
  },
  otpFilled: {
    borderColor: '#00C27A',
    shadowColor: '#00C27A',
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  // ── RESEND ROW ───────────────────────────────────────
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: scale(25),
  },
  resendText: {
    fontFamily: fonts.medium,         // medium for supporting label
    fontSize: scale(13),
    color: '#666',
  },
  resendLink: {
    fontFamily: fonts.semiBold,       // semiBold for tappable action
    fontSize: scale(13),
    color: '#333',
    textDecorationLine: 'underline',
  },
});

export default OtpForgotPassword;