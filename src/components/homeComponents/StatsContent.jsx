import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import AcceptenceIcon from '../../assets/homeIcons/acceptence.svg';
import RatingIcon from '../../assets/homeIcons/rating.svg';
import CancellationIcon from '../../assets/homeIcons/cancellation.svg';
import fonts from '../../utils/fonts/fontsList';

const StatCell = ({ icon, value, label, colors }) => (
  <View style={styles.statCell}>
    {icon}
    <Text style={[styles.statValue, { color: colors.secondary }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.grey }]}>{label}</Text>
  </View>
);

const StatsContent = ({ colors }) => (
  <View style={styles.statsRow}>
    <StatCell
      icon={<AcceptenceIcon width={moderateScale(24)} height={moderateScale(24)} fill={colors.blue} />}
      value="95.0%"
      label="Acceptance"
      colors={colors}
    />
    <View style={[styles.statDivider, { backgroundColor: colors.veryLightGrey }]} />
    <StatCell
      icon={<RatingIcon width={moderateScale(24)} height={moderateScale(24)} fill={colors.orange} />}
      value="4.75"
      label="Rating"
      colors={colors}
    />
    <View style={[styles.statDivider, { backgroundColor: colors.veryLightGrey }]} />
    <StatCell
      icon={<CancellationIcon width={moderateScale(24)} height={moderateScale(24)} fill={colors.red} />}
      value="2.0%"
      label="Cancellation"
      colors={colors}
    />
  </View>
);

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: verticalScale(12),
  },
  statCell: { alignItems: 'center', gap: verticalScale(4), flex: 1 },
  statValue: { fontSize: moderateScale(16), fontFamily: fonts.bold },
  statLabel: { fontSize: moderateScale(11), fontFamily: fonts.regular },
  statDivider: { width: 1, height: verticalScale(40) },
});

export default StatsContent;
