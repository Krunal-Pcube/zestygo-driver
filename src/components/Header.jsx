import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import BackArrow from '../assets/drawerIcons/back_arrow.svg';
import { useTheme } from '../context/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import fonts from '../utils/fonts/fontsList';

const Header = ({
  title, 
  showBack = true,
}) => {

  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.divider }]}>
      {showBack ? (
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <BackArrow width={scale(24)} height={scale(24)} color={colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: scale(22),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: scale(8),
    marginLeft: -scale(10),
    marginRight: scale(10),
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: fonts.bold,
  },
  placeholder: {
    width: 0,
  },
  rightContainer: {
    width: scale(38),
    alignItems: 'flex-end',
  },
});

export default Header;
