import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../utils/colors';
import { scale } from 'react-native-size-matters';
import fonts from '../utils/fonts/fontsList';

const { width, height } = Dimensions.get('window');

const AuthHeader = ({ title, subtitle, image }) => {
  return (
    <ImageBackground
      source={image}
      style={styles.headerBackground}
      imageStyle={styles.headerImage}
    >
      <View style={styles.overlay} />
      <View style={styles.headerContent}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    width: width,
    height: height * 0.26,
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },
  headerImage: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  headerContent: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: scale(24),
    fontFamily: fonts.bold,         // bold for the screen title
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: scale(16),
    fontFamily: fonts.regular,      // regular for the descriptive subtitle
    color: '#ddd',
    flexWrap: 'wrap',
    width: '62%',
  },
});

export default AuthHeader;