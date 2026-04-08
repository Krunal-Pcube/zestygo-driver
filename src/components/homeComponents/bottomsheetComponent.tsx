import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated as RNAnimated, Image } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Car, DollarSign } from 'lucide-react-native';
import ChevronIcon from '../../assets/homeIcons/chevron.svg';
import VectorIcon from '../../assets/homeIcons/Vector.svg';
import AcceptenceIcon from '../../assets/homeIcons/acceptence.svg';
import RatingIcon from '../../assets/homeIcons/rating.svg';
import CancellationIcon from '../../assets/homeIcons/cancellation.svg';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';
import Sound from 'react-native-sound';

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
      sound.play((success) => {
        sound.release();
      });
    }
  );
};

const OnlineToggleButton = ({ isOnline, onPress }) => {
  const pressScale = React.useRef(new RNAnimated.Value(1)).current;

  const handlePress = () => {
    // Play sound immediately (don't wait for animation)
    playToggleSound(!isOnline);
    
    RNAnimated.sequence([
      RNAnimated.timing(pressScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      RNAnimated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 150, friction: 6 }),
    ]).start();
    
    onPress();
  };

  // Go Offline UI - Red circle with hand icon and text below
  if (isOnline) {
    return (
      <RNAnimated.View style={{ transform: [{ scale: pressScale }] }}>
        <TouchableOpacity activeOpacity={1} onPress={handlePress} style={offlineStyles.container}>
          <View style={offlineStyles.circle}>
            <Image source={require('../../assets/homeIcons/hand.png')} style={offlineStyles.handIcon} resizeMode="contain" />
          </View> 
          <Text style={offlineStyles.text}>GO OFFLINE</Text>
        </TouchableOpacity>
      </RNAnimated.View>
    );
  }

  // Go Online UI - Green pill button
  return (
    <RNAnimated.View style={{ transform: [{ scale: pressScale }] }}>
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <View style={[onlineBtnStyles.pill, { backgroundColor: colors.secondary }]}>
          <Image source={require('../../assets/homeIcons/car-handle.png')} style={onlineBtnStyles.icon} resizeMode="contain" />
          <Text style={[onlineBtnStyles.label, { color: colors.primary }]}>
            Go Online
          </Text>
        </View>
      </TouchableOpacity>
    </RNAnimated.View>
  );
}

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
    width: scale(18),
    height: scale(18),
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
import LinearGradient from 'react-native-linear-gradient';

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

    // Ping-pong sweep
    const sweep = () => {
      RNAnimated.sequence([
        RNAnimated.timing(translateX, {
          toValue: endX,
          duration: 1200,
          useNativeDriver: true,
        }),
        RNAnimated.timing(translateX, {
          toValue: startX,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => sweep());
    };

    // Subtle pulse on the glow opacity
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
        {/* ── Static dim green tint across full track ── */}
        <LinearGradient
          colors={['transparent', 'rgba(0,230,118,0.08)', 'transparent']}
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
              'rgba(0,230,118,0.15)',
              'rgba(0,230,118,0.55)',
              'rgba(0,255,140,0.85)',
              'rgba(0,230,118,0.55)',
              'rgba(0,230,118,0.15)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={stripStyles.glowOuter}
          />

          {/* Mid layer — tighter green core */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(0,255,140,0.4)',
              'rgba(0,255,140,0.95)',
              'rgba(0,255,140,0.4)',
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
        colors={['transparent', 'rgba(0,255,140,0.25)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={stripStyles.topReflection}
      />

      {/* ── Bottom shadow bleed ── */}
      <LinearGradient
        colors={['rgba(0,230,118,0.12)', 'transparent']}
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

  // Main track
  track: {
    width: '100%',
    height: verticalScale(3),
    borderRadius: scale(3),
    overflow: 'hidden',
    // Neon ambient glow on track itself
    shadowColor: '#00e676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },

  // Moving glow container
  glowWrapper: {
    position: 'absolute',
    height: '100%',
  },

  // Wide soft bloom layer
  glowOuter: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: scale(3),
  },

  // Tighter green mid layer
  glowMid: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '15%',
    right: '15%',
    borderRadius: scale(3),
  },

  // White hot core
  glowCore: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '30%',
    right: '30%',
    borderRadius: scale(3),
  },

  // Thin top-edge reflection
  topReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(1),
    borderRadius: scale(3),
    opacity: 0.8,
  },

  // Soft green bleed below track
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
  children, // For custom content like stats
}) {
  // Track mount key to force re-render when location becomes ready
  const [mountKey, setMountKey] = React.useState(0);
  
  React.useEffect(() => {
    if (locationReady) {
      // Force remount of bottom sheet by changing key
      setMountKey(prev => prev + 1);
    }
  }, [locationReady]);

  // Initial snap + re-snap when location permission granted
  useEffect(() => {
    const timer = setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(0);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Re-snap after remount when location becomes ready
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
    outputRange: ['180deg', '0deg'], // Flipped: collapsed=down, expanded=up
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
      activeOffsetX={[-999, 999]}  // Disable horizontal pan
      activeOffsetY={[-5, 5]}      // Only vertical pan 
    >

      <BottomSheetView style={styles.sheetBody}>
        {/* ── Drag handle bar ── */}
        <View style={styles.dragBar} />

        {/* ── Main row: Chevron | Center Content | Menu ── */}
        <View style={styles.actionRow}>
          {/* Left: Chevron */}
          <TouchableOpacity onPress={handleChevron} style={styles.sideBtn} activeOpacity={0.7}>
            <RNAnimated.View style={{ transform: [{ rotate: chevronAngle }] }}>
              <ChevronIcon width={moderateScale(16)} height={moderateScale(16)} fill={colors.mediumGrey} />
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

          {/* Right: Vector icon */}
          <TouchableOpacity style={styles.sideBtn} activeOpacity={0.7}>
            <VectorIcon width={moderateScale(18)} height={moderateScale(18)} fill={colors.mediumGrey} />
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
    fontFamily: fonts.bold,
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

  /* Go Offline button wrapper below stats */
  goOfflineWrapper: {
    alignItems: 'center',
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(4),
  },
});