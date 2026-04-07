import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import { scale } from 'react-native-size-matters';
import fonts from '../utils/fonts/fontsList';

const icons = {
  success: <CheckCircle size={22} color="#2E7D32" />,
  error: <AlertCircle size={22} color="#C62828" />,
  info: <Info size={22} color="#1565C0" />,
};

const CustomToast = ({ type, text1, text2 }: any) => {
  return (
    <View style={[styles.container, styles[type]]}>
      <View style={styles.icon}>{icons[type]}</View>

      <View style={styles.textWrapper}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 999,
  },
  icon: {
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: scale(17),
    color: '#1C1C1C',
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: scale(14),
    marginTop: 4,
    color: '#555',
  },

  success: { backgroundColor: '#E8F5E9' },
  error: { backgroundColor: '#FDECEA' },
  info: { backgroundColor: '#E3F2FD' },
});

export default CustomToast;
