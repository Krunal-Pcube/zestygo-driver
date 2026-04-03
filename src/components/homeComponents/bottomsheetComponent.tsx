import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated as RNAnimated } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { ChevronDown, List, Car, DollarSign } from 'lucide-react-native';
import { colors } from '../../utils/colors';

/* ════════════════════════════════════════════════════════════════
   Online Toggle Button
   ════════════════════════════════════════════════════════════════ */
function OnlineToggleButton({ isOnline, onPress }) {
  const pressScale = React.useRef(new RNAnimated.Value(1)).current;
  const bgProgress = React.useRef(new RNAnimated.Value(isOnline ? 1 : 0)).current;

  React.useEffect(() => {
    RNAnimated.spring(bgProgress, {
      toValue: isOnline ? 1 : 0,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
  }, [isOnline]);

  const handlePress = () => {
    RNAnimated.sequence([
      RNAnimated.timing(pressScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      RNAnimated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 150, friction: 6 }),
    ]).start();
    onPress();
  };

  const bgColor = bgProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.secondary, '#FF4444'],
  });

  const textColor = bgProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, colors.white],
  });

  return (
    <RNAnimated.View style={{ transform: [{ scale: pressScale }] }}>
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <RNAnimated.View style={[btnStyles.pill, { backgroundColor: bgColor }]}>
          <RNAnimated.Text style={[btnStyles.label, { color: textColor }]}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </RNAnimated.Text>
        </RNAnimated.View>
      </TouchableOpacity>
    </RNAnimated.View>
  );
}

const btnStyles = StyleSheet.create({
  pill: {
    paddingHorizontal: scale(36),
    paddingVertical: verticalScale(12),
    borderRadius: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});



function AnimatedOnlineStrip() {
  const translateX = React.useRef(new RNAnimated.Value(0)).current;
  const [trackWidth, setTrackWidth] = React.useState(0);
  const GLOW_WIDTH = scale(60);

  React.useEffect(() => {
    if (trackWidth === 0) return;

    translateX.setValue(-GLOW_WIDTH); // start fully off left

    const animate = () => {
      RNAnimated.sequence([
        // ← left to right →
        RNAnimated.timing(translateX, {
          toValue: trackWidth,      // sweep fully to right edge
          duration: 900,
          useNativeDriver: true,
        }),
        // → right to left ←
        RNAnimated.timing(translateX, {
          toValue: -GLOW_WIDTH,     // sweep fully back to left edge
          duration: 900,
          useNativeDriver: true,
        }),
      ]).start(() => animate());    // ping-pong forever
    };

    animate();
  }, [trackWidth]);

  return (
    <View
      style={stripStyles.track}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      <RNAnimated.View
        style={[stripStyles.glow, { transform: [{ translateX }] }]}
      />
    </View>
  );
}

const stripStyles = StyleSheet.create({
  track: {
    width: '100%',                  // full width of parent
    height: verticalScale(2),
    borderRadius: scale(4),
    backgroundColor: colors.lightgrey,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: verticalScale(2),
  },
  glow: {
    width: scale(100),               // short glow chip
    height: '100%',
    borderRadius: scale(4),
    backgroundColor: colors.lightGreen,
  },
});

/* ════════════════════════════════════════════════════════════════
   Stats Content
   ════════════════════════════════════════════════════════════════ */
function StatsContent({ styleSheet }) {
  const s = styleSheet;
  return (
    <View style={s.statsRow}>
      {/* Stats implementation can be customized or passed as props */}
    </View>
  );
}

/* ════════════════════════════════════════════════════════════════
   Bottom Sheet Component
   ════════════════════════════════════════════════════════════════ */
export default function BottomSheetComponent({
  bottomSheetRef,
  snapPoints,
  animatedPosition,
  handleSheetChange,
  isOnline,
  setIsOnline,
  sheetIndex,
  setSheetIndex,
  animateChevron,
  chevronRot,
  dotPulse,
  activeRide,
  children, // For custom content like stats
}) {
  const handleChevron = () => {
    const next = sheetIndex === 0 ? 1 : 0;
    bottomSheetRef.current?.snapToIndex(next);
  };

  const chevronAngle = chevronRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const toggleOnlineStatus = () => {
    setIsOnline(prev => !prev);
    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      animatedPosition={animatedPosition}
      onChange={handleSheetChange}
      handleComponent={null}
      backgroundStyle={styles.sheetBg}
      animateOnMount
      enablePanDownToClose={false}
    >
      <BottomSheetView style={styles.sheetBody}>
        {/* ── Drag handle bar ── */}
        <View style={styles.dragBar} />

        {/* ── Main row: Chevron | Center Content | Menu ── */}
        <View style={styles.actionRow}>
          {/* Left: Chevron */}
          <TouchableOpacity onPress={handleChevron} style={styles.sideBtn} activeOpacity={0.7}>
            <RNAnimated.View style={{ transform: [{ rotate: chevronAngle }] }}>
              <ChevronDown size={moderateScale(22)} color={colors.mediumGrey} />
            </RNAnimated.View>
          </TouchableOpacity>

          {/* Center: "Go Online" pill when offline — "You're Online" badge when online */}
          {isOnline ? (
            <View style={styles.onlineBadge}>

              <Text style={styles.onlineBadgeText}>You're Online</Text>

            </View>
          ) : (
            <OnlineToggleButton isOnline={isOnline} onPress={toggleOnlineStatus} />
          )}

          {/* Right: List icon */}
          <TouchableOpacity style={styles.sideBtn} activeOpacity={0.7}>
            <List size={moderateScale(22)} color={colors.mediumGrey} />
          </TouchableOpacity>
        </View>

        {isOnline && <AnimatedOnlineStrip />}

        <View style={{ height: scale(40) }} />
        {children}

        {/* Active Ride Info in Bottom Sheet */}
        {activeRide && (
          <View style={styles.activeRideSheetCard}>
            <View style={styles.activeRideSheetHeader}>
              <Car size={moderateScale(20)} color={colors.secondary} />
              <Text style={styles.activeRideSheetTitle}>Active Ride</Text>
              <View style={styles.farePill}>
                <DollarSign size={moderateScale(12)} color={colors.secondary} />
                <Text style={styles.farePillText}>{activeRide.fare}</Text>
              </View>
            </View>
            <View style={styles.activeRideRoute}>
              <Text style={styles.activeRideRouteText} numberOfLines={1}>
                {activeRide.pickup.address} → {activeRide.dropoff.address}
              </Text>
            </View>
          </View>
        )}

        {/* ── Go Offline button — only visible when online, sits below stats ── */}
        {isOnline && (
          <View style={styles.goOfflineWrapper}>
            <OnlineToggleButton isOnline={isOnline} onPress={toggleOnlineStatus} />
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  /* Bottom Sheet */
  sheetBg: {
    borderTopLeftRadius: moderateScale(22),
    borderTopRightRadius: moderateScale(22),
    backgroundColor: colors.white,
  },
  sheetBody: {
    paddingHorizontal: scale(16),
    paddingTop: scale(6),
    paddingBottom: Platform.OS === 'ios' ? verticalScale(34) : verticalScale(20),
  },

  /* Custom drag handle bar */
  dragBar: {
    alignSelf: 'center',
    width: scale(36),
    height: verticalScale(4),
    borderRadius: scale(2),
    backgroundColor: colors.veryLightGrey,
    marginBottom: verticalScale(6),
  },

  /* Main action row inside sheet */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(5),
    marginBottom: scale(0)

  },
  sideBtn: {
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* "You're Online" badge shown in actionRow center */
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
    borderColor: colors.green,
    backgroundColor: colors.white,
  },
  onlineBadgeText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.black
    ,
  },
  statusDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
  },

  /* Active ride in bottom sheet */
  activeRideSheetCard: {
    backgroundColor: colors.background,
    borderRadius: moderateScale(12),
    padding: scale(12),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(6),
  },
  activeRideSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(8),
  },
  activeRideSheetTitle: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.secondary,
  },
  farePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(2),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
    backgroundColor: colors.greenLight,
  },
  farePillText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.secondary,
  },
  activeRideRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeRideRouteText: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },

  /* Go Offline button wrapper below stats */
  goOfflineWrapper: {
    alignItems: 'center',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(4),
  },
});