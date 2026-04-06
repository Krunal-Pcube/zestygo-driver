import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthHeader from '../../components/AuthHeader';
import CommonButton from '../../components/CommonBtn';
import fonts from '../../utils/fonts/fontsList';
import { colors } from '../../utils/colors';

const ResetPassword = () => {
  const navigation = useNavigation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // plug in API logic here
    navigation.navigate('ResetPasswordSuccess');
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <AuthHeader
        title="Reset Password"
        subtitle="Use a new password not used before"
        image={require('../../assets/food.png')}

      />

      {/* BODY */}
      <View style={styles.formContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* NEW PASSWORD */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Create a strong password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry={hidePassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
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

          {/* CONFIRM PASSWORD */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              secureTextEntry={hideConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
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

          {/* SUBMIT BUTTON */}
          <View style={{ marginTop: scale(10) }}>
            <CommonButton
              title="Submit"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />
          </View>

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

  // ── INPUT ────────────────────────────────────────────
  inputWrapper: {
    marginBottom: scale(12),
  },
  input: {
    fontFamily: fonts.regular,          // regular for input text
    backgroundColor: colors.background2,
    borderRadius: 12,
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
    fontSize: scale(15),
    color: '#333',
    marginBottom: scale(2),
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
});

export default ResetPassword;