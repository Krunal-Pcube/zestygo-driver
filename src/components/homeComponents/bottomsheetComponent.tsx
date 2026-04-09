
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated as RNAnimated,
  Image,
  Easing,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Car, DollarSign } from 'lucide-react-native';
import ChevronIcon from '../../assets/homeIcons/chevron.svg';
import VectorIcon from '../../assets/homeIcons/Vector.svg';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';

/* ════════════════════════════════════════════════════════════════
   Online Toggle Button
   ════════════════════════════════════════════════════════════════ */
const playToggleSound = (isGoingOnline) => {
  const soundFile = isGoingOnline ? 'go_online.mp3' : 'go_offline.mp3';

  const sound = new Sound(
    soundFile,
    Platform.OS === 'ios' ? Sound.MAIN_BUNDLE : '',
    (error) => {
      if (error) {
        console.log(`Failed to load ${soundFile}`, error);
        return;
      }
      sound.setVolume(1.0);
      sound.play(() => {
        sound.release();
      });
    }
  );
};

const OnlineToggleButton = ({ isOnline, onPress }) => {
  const pressScale = React.useRef(new RNAnimated.Value(1)).current;

  // Idle: gentle steering wheel wobble rotation
  const steerRot = React.useRef(new RNAnimated.Value(0)).current;

  // On-press: full spin (2 rotations)
  const spinRot = React.useRef(new RNAnimated.Value(0)).current;

  // Guard to prevent double-tap during spin
  const isSpinning = React.useRef(false);

  // Start wobble loop when in "Go Online" (offline) state
  React.useEffect(() => {
    if (isOnline) return;

    const wobbleLoop = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(steerRot, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        RNAnimated.timing(steerRot, {
          toValue: -1,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        RNAnimated.timing(steerRot, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    );

    wobbleLoop.start();
    return () => wobbleLoop.stop();
  }, [isOnline]);

  const handlePress = () => {
    if (isSpinning.current) return;
    isSpinning.current = true;

    // Play sound immediately
    playToggleSound(!isOnline);

    // Stop wobble and reset
    steerRot.stopAnimation(() => {
      steerRot.setValue(0);
    });

    // Button press-scale bounce (runs in parallel with spin)
    RNAnimated.sequence([
      RNAnimated.timing(pressScale, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      RNAnimated.spring(pressScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 6,
      }),
    ]).start();

    // Full spin → then trigger onPress after animation completes
    spinRot.setValue(0);
    RNAnimated.timing(spinRot, {
      toValue: 1,
      duration: 550,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      isSpinning.current = false;
      spinRot.setValue(0);
      onPress();
    });
  };

  // Wobble: −14° ↔ +14°
  const wobbleAngle = steerRot.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-14deg', '0deg', '14deg'],
  });

  // Spin: 0° → 720° (two full rotations)
  const spinAngle = spinRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ── Go Offline UI ── red circle + hand icon
  if (isOnline) {
    return (
      <RNAnimated.View style={{ transform: [{ scale: pressScale }] }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handlePress}
          style={offlineStyles.container}
        >
          <View style={offlineStyles.circle}>
            <Image
              source={require('../../assets/homeIcons/hand.png')}
              style={offlineStyles.handIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={offlineStyles.text}>GO OFFLINE</Text>
        </TouchableOpacity>
      </RNAnimated.View>
    );
  }

  // ── Go Online UI ── green pill with animated steering wheel
  return (
    <RNAnimated.View style={{ transform: [{ scale: pressScale }] }}>
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <View style={[onlineBtnStyles.pill, { backgroundColor: colors.secondary }]}>

          {/*
            Wobble wraps Spin so both transforms compose cleanly.
            Wobble animates during idle; Spin fires on press.
          */}
          <RNAnimated.View style={{ transform: [{ rotate: wobbleAngle }] }}>
            <RNAnimated.Image
              source={require('../../assets/homeIcons/car-handle.png')}
              style={[onlineBtnStyles.icon, { transform: [{ rotate: spinAngle }] }]}
              resizeMode="contain"
            />
          </RNAnimated.View>

          <Text style={[onlineBtnStyles.label, { color: colors.primary }]}>
            Go Online
          </Text>
        </View>
      </TouchableOpacity>
    </RNAnimated.View>
  );
};

// Go Online button styles (pill)
const onlineBtnStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(36),
    paddingVertical: verticalScale(12),
    borderRadius: scale(32),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
    letterSpacing: 0.3,
  },
  icon: {
    width: scale(22),
    height: scale(22),
    tintColor: colors.primary,
  },
});

// Go Offline button styles (red circle with hand)
const offlineStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(4),
    borderColor: '#FFCDD2',
  },
  handIcon: {
    width: scale(32),
    height: scale(32),
    tintColor: '#FFFFFF',
  },
  text: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(14),
    fontFamily: fonts.bold,
    color: '#333',
    letterSpacing: 0.5,
  },
});

/* ════════════════════════════════════════════════════════════════
   Animated Online Strip
   ════════════════════════════════════════════════════════════════ */
const AnimatedOnlineStrip = () => {
  const translateX = React.useRef(new RNAnimated.Value(0)).current;
  const glowOpacity = React.useRef(new RNAnimated.Value(0.7)).current;
  const [trackWidth, setTrackWidth] = React.useState(0);

  const GLOW_WIDTH = scale(120);

  React.useEffect(() => {
    if (trackWidth === 0) return;

    const startX = -(GLOW_WIDTH / 2);
    const endX = trackWidth - GLOW_WIDTH / 2;

    translateX.setValue(startX);

    const sweep = () => {
      RNAnimated.sequence([
        RNAnimated.timing(translateX, {
          toValue: endX,
          duration: 800,
          useNativeDriver: true,
        }),
        RNAnimated.timing(translateX, {
          toValue: startX,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => sweep());
    };

    const pulse = () => {
      RNAnimated.sequence([
        RNAnimated.timing(glowOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        RNAnimated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    sweep();
    pulse();
  }, [trackWidth]);

  return (
    <View
      style={stripStyles.wrapper}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      {/* ── Dark base track ── */}
      <LinearGradient
        colors={['#0a0a0a', '#111', '#0a0a0a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={stripStyles.track}
      >
        {/* ── Static dim tint across full track ── */}
        <LinearGradient
          colors={['transparent', 'rgba(207,255,4,0.08)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        {/* ── Moving neon glow ── */}
        <RNAnimated.View
          style={[
            stripStyles.glowWrapper,
            {
              width: GLOW_WIDTH,
              opacity: glowOpacity,
              transform: [{ translateX }],
            },
          ]}
        >
          {/* Outer wide bloom — feathered edges */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(207,255,4,0.15)',
              'rgba(207,255,4,0.55)',
              'rgba(207,255,4,0.85)',
              'rgba(207,255,4,0.55)',
              'rgba(207,255,4,0.15)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={stripStyles.glowOuter}
          />

          {/* Mid layer — tighter core */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(207,255,4,0.4)',
              'rgba(207,255,4,0.95)',
              'rgba(207,255,4,0.4)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={stripStyles.glowMid}
          />

          {/* Inner white-hot core */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255,255,255,0.6)',
              'rgba(255,255,255,0.98)',
              'rgba(255,255,255,0.6)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={stripStyles.glowCore}
          />
        </RNAnimated.View>
      </LinearGradient>

      {/* ── Top edge reflection line ── */}
      <LinearGradient
        colors={['transparent', 'rgba(207,255,4,0.25)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={stripStyles.topReflection}
      />

      {/* ── Bottom shadow bleed ── */}
      <LinearGradient
        colors={['rgba(207,255,4,0.12)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={stripStyles.bottomBleed}
      />
    </View>
  );
};

const stripStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: verticalScale(4),
    marginBottom: verticalScale(2),
  },
  track: {
    width: '100%',
    height: verticalScale(3),
    borderRadius: scale(3),
    overflow: 'hidden',
    shadowColor: '#CFFF04',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  glowWrapper: {
    position: 'absolute',
    height: '100%',
  },
  glowOuter: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: scale(3),
  },
  glowMid: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '15%',
    right: '15%',
    borderRadius: scale(3),
  },
  glowCore: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '30%',
    right: '30%',
    borderRadius: scale(3),
  },
  topReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(1),
    borderRadius: scale(3),
    opacity: 0.8,
  },
  bottomBleed: {
    width: '80%',
    alignSelf: 'center',
    height: verticalScale(4),
    borderBottomLeftRadius: scale(4),
    borderBottomRightRadius: scale(4),
    opacity: 0.6,
  },
});

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
  locationReady,
  children,
}) {
  const [mountKey, setMountKey] = React.useState(0);

  React.useEffect(() => {
    if (locationReady) {
      setMountKey(prev => prev + 1);
    }
  }, [locationReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(0);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (locationReady && mountKey > 0) {
      const timer = setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [locationReady, mountKey, bottomSheetRef]);

  const handleChevron = () => {
    const next = sheetIndex === 0 ? 1 : 0;
    bottomSheetRef.current?.snapToIndex(next);
  };

  const chevronAngle = chevronRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  const toggleOnlineStatus = () => {
    setIsOnline(prev => !prev);
    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <BottomSheet
      key={mountKey}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      animatedPosition={animatedPosition}
      onChange={handleSheetChange}
      handleComponent={null}
      backgroundStyle={styles.sheetBg}
      enablePanDownToClose={false}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={false}
      enableOverDrag={false}
      activeOffsetX={[-999, 999]}
      activeOffsetY={[-5, 5]}
    >
      <BottomSheetView style={styles.sheetBody}>
        {/* ── Drag handle bar ── */}
        <View style={styles.dragBar} />

        {/* ── Main row: Chevron | Center Content | Menu ── */}
        <View style={styles.actionRow}>
          {/* Left: Chevron */}
          <TouchableOpacity
            onPress={handleChevron}
            style={styles.sideBtn}
            activeOpacity={0.7}
          >
            <RNAnimated.View style={{ transform: [{ rotate: chevronAngle }] }}>
              <ChevronIcon
                width={moderateScale(16)}
                height={moderateScale(16)}
                fill={colors.mediumGrey}
              />
            </RNAnimated.View>
          </TouchableOpacity>

          {/* Center */}
          {isOnline ? (
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineBadgeText}>You're Online</Text>
            </View>
          ) : (
            <OnlineToggleButton isOnline={isOnline} onPress={toggleOnlineStatus} />
          )}

          {/* Right: Vector icon */}
          <TouchableOpacity style={styles.sideBtn} activeOpacity={0.7}>
            <VectorIcon
              width={moderateScale(18)}
              height={moderateScale(18)}
              fill={colors.mediumGrey}
            />
          </TouchableOpacity>
        </View>

        {isOnline && <AnimatedOnlineStrip />}

        <View style={{ height: scale(40) }} />
        {children}

        {/* Active Ride Info */}
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

        {/* Go Offline button — only visible when online */}
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
  dragBar: {
    alignSelf: 'center',
    width: scale(36),
    height: verticalScale(4),
    borderRadius: scale(2),
    backgroundColor: colors.veryLightGrey,
    marginBottom: verticalScale(6),
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(5),
    marginBottom: scale(0),
  },
  sideBtn: {
    width: scale(44),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    fontFamily: fonts.bold,
    color: colors.black,
  },
  statusDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
  },
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
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
  goOfflineWrapper: {
    alignItems: 'center',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(4),
  },
});