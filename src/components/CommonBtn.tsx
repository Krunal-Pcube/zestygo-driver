import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../utils/colors';
import { scale } from 'react-native-size-matters';
import fonts from '../utils/fonts/fontsList';

const CommonButton = ({
  title,
  onPress,
  bgColor = colors.secondary,
  textColor = colors.primary,
  borderRadius = 30,
  paddingVertical = 12,
  style = {}, 
  loading = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={loading || disabled}
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          borderRadius,
          paddingVertical,
          opacity: loading || disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.indicator} // ← fix: match text height
        />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  text: {
    fontSize: scale(16),
    fontFamily: fonts.semiBold,
    lineHeight: scale(22), // ← explicit lineHeight
  },
  indicator: {
    height: scale(22), // ← same as text lineHeight so button doesn't shrink
  },
});

export default CommonButton;