
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
  Alert,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Car, DollarSign } from 'lucide-react-native';
import ChevronIcon from '../../assets/homeIcons/chevron.svg';
import VectorIcon from '../../assets/homeIcons/Vector.svg';
import { useTheme } from '../../context/ThemeContext';
import fonts from '../../utils/fonts/fontsList';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';
import { changeStatusController } from '../../MVC/controllers/driverStatusController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/storage/asyncStorageKeys';

/* ════════════════════════════════════════════════════════════════
   Sound helper
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
      sound.play(() => sound.release());
    }
  );
};

/* ════════════════════════════════════════════════════════════════
   Online Toggle Button
   ════════════════════════════════════════════════════════════════ */
const OnlineToggleButton = ({ isOnline, onPress, isLoading }) => {
  const { colors } = useTheme();

  const pressScale = React.useRef(new RNAnimated.Value(1)).current;

  // Idle wobble rotation (offline, not loading)
  const steerRot = React.useRef(new RNAnimated.Value(0)).current;

  // Single press spin (offline → tap)
  const spinRot = React.useRef(new RNAnimated.Value(0)).current;

  // Continuous loader spin for Go Online pill
  const loaderRot = React.useRef(new RNAnimated.Value(0)).current;

  // Continuous ring rotation for Go Offline circle
  const ringRot = React.useRef(new RNAnimated.Value(0)).current;

  // Guard against double-tap during animation
  const isSpinning = React.useRef(false);

  // ── Idle wobble: only when offline and not loading ──
  React.useEffect(() => {
    if (isOnline || isLoading) return;

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
  }, [isOnline, isLoading]);

  // ── Continuous spin: "Going Online" pill loader ──
  React.useEffect(() => {
    if (!isLoading || isOnline) return;

    loaderRot.setValue(0);
    const loop = RNAnimated.loop(
      RNAnimated.timing(loaderRot, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isLoading, isOnline]);

  // ── Rotating arc ring: "Going Offline" circle loader ──
  React.useEffect(() => {
    if (!isLoading || !isOnline) return;

    ringRot.setValue(0);
    const loop = RNAnimated.loop(
      RNAnimated.timing(ringRot, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isLoading, isOnline]);

  const handlePress = () => {
    if (isSpinning.current || isLoading) return;
    isSpinning.current = true;

    playToggleSound(!isOnline);

    // Stop wobble and reset
    steerRot.stopAnimation(() => steerRot.setValue(0));

    // Button bounce
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

    // Single press spin → then trigger onPress (API call starts)
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

  // Interpolations
  const wobbleAngle = steerRot.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-14deg', '0deg', '14deg'],
  });

  const spinAngle = spinRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loaderAngle = loaderRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ringAngle = ringRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  /* ── Go Offline UI (red circle + hand + optional ring loader) ── */
  if (isOnline) {
    return (
      <RNAnimated.View style={{ transform: [{ scale: pressScale }] }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handlePress}
          style={offlineStyles.container}
          disabled={isLoading}
        >
          {/* Ring wrapper — positions the rotating arc perfectly outside the circle */}
          <View style={offlineStyles.ringWrapper}>

            {/* Rotating arc — only visible while loading */}
            {isLoading && (
              <RNAnimated.View
                style={[
                  offlineStyles.loaderRing,
                  { transform: [{ rotate: ringAngle }] },
                ]}
              />
            )}

            {/* Red circle with hand icon */}
            <View style={[
              offlineStyles.circle,
              isLoading && offlineStyles.circleDimmed,
            ]}>
              <Image
                source={require('../../assets/homeIcons/hand.png')}
                style={offlineStyles.handIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={[offlineStyles.text, { color: colors.black }]}>
            {isLoading ? 'Going Offline…' : 'GO OFFLINE'}
          </Text>
        </TouchableOpacity>
      </RNAnimated.View>
    );
  }

  /* ── Go Online UI (green pill with steering wheel) ── */
  return (
    <RNAnimated.View style={{ transform: [{ scale: pressScale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        disabled={isLoading}
      >
        <View style={[
          onlineBtnStyles.pill,
          { backgroundColor: colors.secondary, shadowColor: colors.black },
          isLoading && onlineBtnStyles.pillLoading,
        ]}>

          {/*
            When loading  → outer view applies continuous loaderAngle spin.
            When idle     → outer view applies wobble, inner image applies tap spinAngle.
          */}
          <RNAnimated.View
            style={{
              transform: [{ rotate: isLoading ? loaderAngle : wobbleAngle }],
            }}
          >
            <RNAnimated.Image
              source={require('../../assets/homeIcons/car-handle.png')}
              style={[
                onlineBtnStyles.icon,
                {
                  tintColor: colors.primary,
                  transform: [{ rotate: isLoading ? '0deg' : spinAngle }],
                },
              ]}
              resizeMode="contain"
            />
          </RNAnimated.View>

          <Text style={[onlineBtnStyles.label, { color: colors.primary }]}>
            {isLoading ? 'Going Online…' : 'Go Online'}
          </Text>
        </View>
      </TouchableOpacity>
    </RNAnimated.View>
  );
};

/* ── Go Online button styles (pill) ── */
const onlineBtnStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(36),
    paddingVertical: verticalScale(12),
    borderRadius: scale(32),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  pillLoading: {
    opacity: 0.85,
  },
  label: {
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
    letterSpacing: 0.3,
  },
  icon: {
    width: scale(22),
    height: scale(22),
  },
});

/* ── Go Offline button styles (red circle with hand) ── */
const offlineStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Outer wrapper: sized to accommodate the ring + circle
  ringWrapper: {
    width: scale(78),
    height: scale(78),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Spinning arc — sits outside the circle, rotates as loader
  loaderRing: {
    position: 'absolute',
    width: scale(78),
    height: scale(78),
    borderRadius: scale(39),
    borderWidth: scale(3),
    borderColor: 'transparent',
    borderTopColor: '#E53935',               // leading solid arc
    borderRightColor: 'rgba(229,57,53,0.3)', // fading tail — natural sweep look
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
  circleDimmed: {
    opacity: 0.8,
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
    letterSpacing: 0.5,
  },
});

/* ════════════════════════════════════════════════════════════════
   Animated Online Text — "You're Online" → "Finding Trips"
   ════════════════════════════════════════════════════════════════ */
const AnimatedOnlineText = () => {
  const { colors } = useTheme();
  const [showFindingTrips, setShowFindingTrips] = React.useState(false);
  const slideAnim = React.useRef(new RNAnimated.Value(0)).current;
  const opacityAnim = React.useRef(new RNAnimated.Value(1)).current;

  React.useEffect(() => {
    const initialDelay = setTimeout(() => {
      RNAnimated.parallel([
        RNAnimated.timing(slideAnim, {
          toValue: -1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
        RNAnimated.timing(opacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowFindingTrips(true);
        slideAnim.setValue(1);
        opacityAnim.setValue(0);

        RNAnimated.parallel([
          RNAnimated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          RNAnimated.timing(opacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, []);

  const translateY = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 20],
  });

  return (
    <View style={animatedTextStyles.container}>
      <RNAnimated.View
        style={[
          animatedTextStyles.textWrapper,
          { transform: [{ translateY }], opacity: opacityAnim },
        ]}
      >
        <Text style={[animatedTextStyles.text, { color: colors.black }]}>
          {showFindingTrips ? 'Finding Trips' : "You're Online"}
        </Text>
      </RNAnimated.View>
    </View>
  );
};

const animatedTextStyles = StyleSheet.create({
  container: {
    height: verticalScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
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
      <LinearGradient
        colors={['#0a0a0a', '#111', '#0a0a0a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={stripStyles.track}
      >
        <LinearGradient
          colors={['transparent', 'rgba(207,255,4,0.08)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

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

      <LinearGradient
        colors={['transparent', 'rgba(207,255,4,0.25)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={stripStyles.topReflection}
      />
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
  gpsReady,
  location,
  children,
}) {
  const { colors } = useTheme();

  // ── Loading state: true while API call is in-flight ──
  const [isLoading, setIsLoading] = React.useState(false);

  // Snap on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(0);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Snap when location becomes ready
  useEffect(() => {
    if (locationReady) {
      const timer = setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [locationReady]);

  // Snap when GPS becomes ready
  useEffect(() => {
    if (gpsReady) {
      const timer = setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gpsReady]);

  const handleChevron = () => {
    const next = sheetIndex === 0 ? 1 : 0;
    bottomSheetRef.current?.snapToIndex(next);
  };

  const chevronAngle = chevronRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  const toggleOnlineStatus = async () => {
    if (isLoading) return; // prevent double-tap while loading

    if (!location || !gpsReady) {
      Alert.alert('GPS Required', 'Please enable GPS to go online');
      return;
    }

    const newStatus = !isOnline;

    const payload = {
      current_status: newStatus ? 'online' : 'offline',
      accepting_new_orders: newStatus ? '1' : '0',
      current_latitude: location?.latitude?.toString() || '',
      current_longitude: location?.longitude?.toString() || '',
    };

    setIsLoading(true); // ← start loader BEFORE API call

    try {
      const success = await changeStatusController({
        payload,
        onStatusChange: (updatedStatus) => {
          console.log('Updated driver status:', updatedStatus);
        },
      });

      if (success) {
        setIsOnline(newStatus);              // ✅ Only update state on success
        // Store status in AsyncStorage after successful API call
        await AsyncStorage.setItem(STORAGE_KEYS.DRIVER_ONLINE_STATUS, JSON.stringify(newStatus));
        console.log('[Status] Saved to AsyncStorage:', newStatus);
        bottomSheetRef.current?.snapToIndex(0);
      }
      // If success === false, toast is already shown by controller
    } catch (error) {
      console.log('Toggle status failed:', error);
    } finally {
      setIsLoading(false); // ← always stop loader, success or failure
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      animatedPosition={animatedPosition}
      onChange={handleSheetChange}
      handleComponent={null}
      backgroundStyle={[styles.sheetBg, { backgroundColor: colors.white }]}
      enablePanDownToClose={false}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={false}
      enableOverDrag={false}
      activeOffsetX={[-999, 999]}
      activeOffsetY={[-5, 5]}
    >
      <BottomSheetView style={styles.sheetBody}>
        {/* Drag handle bar */}
        <View style={[styles.dragBar, { backgroundColor: colors.veryLightGrey }]} />

        {/* Main row: Chevron | Center Content | Menu */}
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
              />
            </RNAnimated.View>
          </TouchableOpacity>

          {/* Center: animated text when online, toggle button when offline */}
          {isOnline ? (
            <AnimatedOnlineText />
          ) : (
            <OnlineToggleButton
              isOnline={isOnline}
              onPress={toggleOnlineStatus}
              isLoading={isLoading}
            />
          )}

          {/* Right: Vector icon */}
          <TouchableOpacity style={styles.sideBtn} activeOpacity={0.7}>
            <VectorIcon
              width={moderateScale(18)}
              height={moderateScale(18)}
            />
          </TouchableOpacity>
        </View>

        {/* Neon sweep strip — only when online */}
        {isOnline && <AnimatedOnlineStrip />}

        <View style={{ height: scale(40) }} />
        {children}

        {/* Active Ride Info */}
        {activeRide && (
          <View style={[styles.activeRideSheetCard, { backgroundColor: colors.background }]}>
            <View style={styles.activeRideSheetHeader}>
              <Car size={moderateScale(20)} color={colors.secondary} />
              <Text style={[styles.activeRideSheetTitle, { color: colors.secondary }]}>Active Ride</Text>
              <View style={[styles.farePill, { backgroundColor: colors.greenLight }]}>
                <DollarSign size={moderateScale(12)} color={colors.secondary} />
                <Text style={[styles.farePillText, { color: colors.secondary }]}>{activeRide.fare}</Text>
              </View>
            </View>
            <View style={styles.activeRideRoute}>
              <Text style={[styles.activeRideRouteText, { color: colors.grey }]} numberOfLines={1}>
                {activeRide.pickup.address} → {activeRide.dropoff.address}
              </Text>
            </View>
          </View>
        )}

        {/* Go Offline button — only visible when online */}
        {isOnline && (
          <View style={styles.goOfflineWrapper}>
            <OnlineToggleButton
              isOnline={isOnline}
              onPress={toggleOnlineStatus}
              isLoading={isLoading}
            />
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
  },
  onlineBadgeText: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
  },
  statusDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
  },
  activeRideSheetCard: {
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
  },
  farePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(2),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
  },
  farePillText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.bold,
  },
  activeRideRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeRideRouteText: {
    fontSize: moderateScale(12),
  },
  goOfflineWrapper: {
    alignItems: 'center',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(4),
  },
});