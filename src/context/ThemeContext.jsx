import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const lightColors = {
  primary: '#CFFF04',
  secondary: '#1F1F1F',
  primaryLight: '#E9FF9A',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#767774',
  mediumGrey: '#A5A5A5',
  lightgrey: '#D2D2D2',
  veryLightGrey: '#EDEDED',
  background: '#F9FBF3',
  background2: '#f5f5f5',
  red: '#E23744',
  blue: '#3369FF',
  green: '#469843',
  lightGreen: '#6DB554',
  greenLight: '#E6F6EE',
  orange: '#FFCB40',
  errorColor: '#FF6B6B',
  comboheaderBlack: '#4D4D4D',
  muted: '#AAAAAA',
  placeholder: '#BBBBBB',
  divider: '#F0F0F0',
  inputBg: '#F5F5F5',
  inputBorder: '#E8E8E8',
  success: '#00C27A',
  headerBg: '#F8F9FA',
  border: '#E0E0E0',
  darkText: '#333333',
  dark: '#1A1A1A',
  cardBgBlue: '#F0F8FF',
  switchTrackOff: '#D3D3D3',
  accentBlue: '#4A90D9',
  cardBackground: '#FFFFFF',
  textPrimary: '#1F1F1F',
  textSecondary: '#767774',
};

export const darkColors = {
  primary: '#CFFF04',
  secondary: '#FFFFFF',
  primaryLight: '#2A2A2A',
  white: '#1F1F1F',
  black: '#FFFFFF',
  grey: '#999999',
  mediumGrey: '#888888',
  lightgrey: '#444444',
  veryLightGrey: '#333333',
  background: '#121212',
  background2: '#1A1A1A',
  red: '#FF6B6B',
  blue: '#4A90D9',
  green: '#6DB554',
  lightGreen: '#8BC48A',
  greenLight: '#1A3A2A',
  orange: '#FFD96E',
  errorColor: '#FF8E8E',
  comboheaderBlack: '#CCCCCC',
  muted: '#777777',
  placeholder: '#555555',
  divider: '#333333',
  inputBg: '#2A2A2A',
  inputBorder: '#444444',
  success: '#4CD97E',
  headerBg: '#1F1F1F',
  border: '#333333',
  darkText: '#FFFFFF',
  dark: '#FFFFFF',
  cardBgBlue: '#1A2A3A',
  switchTrackOff: '#555555',
  accentBlue: '#6BA3E0',
  cardBackground: '#1F1F1F',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = async (value) => {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem('darkMode', JSON.stringify(value));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
