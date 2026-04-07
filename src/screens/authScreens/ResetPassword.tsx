import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';;
import AuthHeader from '../../components/AuthHeader'; 
import CommonButton from '../../components/CommonBtn';
import fonts from '../../utils/fonts/fontsList';
import Toast from 'react-native-toast-message';
import { ResetPasswordController } from '../../MVC/controllers/authController';

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params; 

  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const handleLogin = async () => {
    // UI validation only
    if (!password || !confirmpassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter both passwords',
        position: 'top',
      });
      return;
    }

    if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 8 characters',
        position: 'top',
      });
      return;
    }

    if (password !== confirmpassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
        position: 'top',
      });
      return;
    }

    setLoading(true);

    const payload = {
      reset_token: token,
      new_password: password,
      confirm_password: confirmpassword,
    };

    try {
      await ResetPasswordController({
        payload,
        navigation,
      });
    } catch (error) {
      // Controller already handles toast
      console.log(
        'ResetPassword Screen Error :::',
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Reset Password"
        subtitle={'Use a new password not used before'}
        image={require('../../assets/food.png')}

      />

      <View style={styles.formContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: scale(12) }}>
            <TextInput
              style={styles.input}
              placeholder="Create a strong password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry={hidePassword}
            />

            {/* Eye Icon */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 20,
                top: 16,
              }}
              activeOpacity={0.7}
              onPress={() => setHidePassword(!hidePassword)}
            >
              <Ionicons
                name={hidePassword ? 'eye-off' : 'eye'}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: scale(12) }}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmpassword}
              onChangeText={setConfirmPassword}
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry={hideConfirmPassword}
            />

            {/* Eye Icon */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 20,
                top: 16,
              }}
              activeOpacity={0.7}
              onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
            >
              <Ionicons
                name={hideConfirmPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <CommonButton
            title={'Submit'}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />
        </ScrollView>
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
    paddingTop: scale(20),
  },

  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: scale(5),
    marginBottom: 20,
  },
  switchButton: {
    flex: 1,
    paddingVertical: scale(14),
    alignItems: 'center',
  },
  activeSwitch: {
    backgroundColor: '#000',
    borderRadius: 12,
  },
  switchText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeSwitchText: {
    color: '#fff',
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    fontFamily: fonts.regular,
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
    fontSize: scale(15),
    marginBottom: scale(5),
  },
});

export default ResetPassword;
