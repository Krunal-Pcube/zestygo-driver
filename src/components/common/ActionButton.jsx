import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';

/**
 * Reusable Action Button Component
 * 
 * Variants:
 * - 'gray' (default): Gray background (#E8E8E8), dark text
 * - 'secondary': Brand color background, primary color text
 * - 'dark': Black background (#1A1A1A), green text (#C8FF00)
 * - 'verified': Same as dark but with larger padding/bold text for verified state
 */
const ActionButton = ({ 
  title, 
  onPress,  
  variant = 'gray', 
  disabled = false,
  style = {},
  textStyle = {}
}) => { 
  const getButtonStyles = () => {
    switch (variant) {
      case 'dark':
        return { backgroundColor: '#1A1A1A' };
      case 'verified':
        return { backgroundColor: '#1A1A1A' };
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'gray':
      default:
        return { backgroundColor: '#E8E8E8' };
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'dark':
      case 'verified':
        return { color: '#C8FF00' };
      case 'secondary':
        return { color: colors.primary };
      case 'gray':
      default:
        return { color: colors.secondary };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.actionButton, getButtonStyles(), variant === 'verified' && styles.actionButtonVerified, style]}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
    >
      <Text style={[styles.actionButtonText, getTextStyles(), variant === 'verified' && styles.actionButtonTextVerified, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  actionButtonVerified: {
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
  },
  actionButtonText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
  },
  actionButtonTextVerified: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
  },
});

export default ActionButton;
