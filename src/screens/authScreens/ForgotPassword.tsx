import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { scale } from 'react-native-size-matters';

import AuthHeader from '../../components/AuthHeader';
import CommonButton from '../../components/CommonBtn';
import fonts from '../../utils/fonts/fontsList';
import Toast from 'react-native-toast-message';
import { ResetPasswordSendOTPController } from '../../MVC/controllers/authController';

const { width, height } = Dimensions.get('window');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const input = email.trim();

    const isEmail = /\S+@\S+\.\S+/.test(input);

    if (!input) {
      Toast.show({
        type: 'error',
        text1: 'Email Required',
        text2: 'Please enter your email address',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 50,
      });
      return;
    }

    if (!isEmail) { 
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 50,
      });
      return;
    }

    setLoading(true);
    const payload = { email: input };

    try {
      await ResetPasswordSendOTPController({ payload, navigation });
    } catch (err) {
      console.log('OTP Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Forgot Password?"
        subtitle="Please enter your registered email address"
        image={require('../../assets/food.png')}
        
      />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={{ marginTop: scale(10) }}>
          <CommonButton
            title="Submit Now"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          />
        </View>

        <View style={styles.signupContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signupLink}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: {
    flex: 1,
    paddingHorizontal: scale(30),
    paddingTop: scale(24),
  },
  inputContainer: { marginBottom: scale(10) },
  input: {
    fontFamily: fonts.regular,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
    fontSize: scale(16),
    color: '#333',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: scale(25),
  },
  signupLink: {
    fontFamily: fonts.semiBold,
    fontSize: scale(13),
    color: '#333',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default ForgotPassword;