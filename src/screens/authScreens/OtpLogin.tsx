import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';


import AuthHeader from '../../components/AuthHeader';
import CommonButton from '../../components/CommonBtn';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList'; 
import { AuthContext } from '../../MVC/context/AuthContext';
import { getDeviceInfo } from '../../utils/deviceInfo';
import { LoginSendOTPController, LoginverifyOTPController } from '../../MVC/controllers/authController';
const { width } = Dimensions.get('window');

const OtpLogin = () => {
  const navigation = useNavigation(); 
  const route = useRoute();
  const { login } = useContext(AuthContext);

  const { value } = route.params; // ✅ only email value, no type

  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);

  const maskEmail = email => {
    const [n, d] = email?.split('@') || [];
    return d ? `${n.slice(0, 2)}****@${d}` : '';
  };

  const otpLength = 6;
  const [otp, setOtp] = useState(new Array(otpLength).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
    const deviceInfo = await getDeviceInfo();

    const payload = {
      email: value, // ✅ always email
      otp: enteredOtp,
      device_type: deviceInfo?.device_type,
      os_type: deviceInfo?.os_type,
      device_name: deviceInfo?.device_name,
      fcm_token: deviceInfo?.fcm_token,
    };

    try {
      await LoginverifyOTPController({
        payload,
        navigation,
        onLoginSuccess: login,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoadingResend(true);

    const payload = { email: value }; // ✅ always email

    try {
      await LoginSendOTPController({ payload, navigation: null });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message || 'Failed to resend OTP',
        position: 'top',
      });
    } finally {
      setLoadingResend(false);
    }
  };

  const handleChange = (text, index) => {
    if (text.length > 1) text = text.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== '' && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (text === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="OTP Verification"
        subtitle={`Please type the code sent to ${maskEmail(value)}`}
        image={require('../../assets/food.png')}

      />

      <View style={styles.formContainer}>
        <View style={styles.otpWrapper}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[styles.otpBox, otp[index] !== '' && styles.otpFilled]}
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

        <CommonButton
          title="Verify & Proceed"
          onPress={handleVerifyOtp}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Didn't receive OTP code? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={handleResendOtp}>
            {loadingResend ? (
              <View style={{ marginLeft: scale(4) }}>
                <ActivityIndicator size="small" color={colors.secondary} />
              </View>
            ) : (
              <Text style={styles.signupLink}>Resend OTP</Text>
            )}
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
  otpWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(25),
    marginBottom: scale(25),
  },
  otpBox: {
    fontFamily: fonts.semiBold,
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
    fontSize: scale(13),
    color: '#333',
    fontFamily: fonts.medium,
    textDecorationLine: 'underline',
  },
});

export default OtpLogin;