import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../utils/colors';
import { scale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const Header = ({
  title, 
  showBack = true,
}) => {

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container]}>
      {showBack ? (
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.darkText} strokeWidth={2.5} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={[styles.title]}>{title}</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    borderColor: colors.divider,
    borderBottomWidth: 1,
    backgroundColor: colors.white,
  },
  backBtn: {
    padding: scale(8),
    marginLeft: -scale(10),
    marginRight: scale(10),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.darkText,
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
