
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { UtensilsCrossed, Zap, X, MapPin, Navigation } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';

/* ─── Badge row ─────────────────────────────────────────────────── */
const BadgeRow = ({ type, onClose }) => (
  <View style={s.badgeRow}>
    <View style={s.badgeDelivery}>
      <UtensilsCrossed size={scale(11)} color={colors.primary} strokeWidth={2.5} />
      <Text style={s.badgeDeliveryText}>
        Delivery
      </Text>
    </View>

    <View style={s.badgeExclusive}>
      <Zap size={scale(10)} color="#555555" strokeWidth={2.5} />
      <Text style={s.badgeExclusiveText}>Exclusive</Text>
    </View>

    <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
      <X size={scale(13)} color="#555555" strokeWidth={2.5} />
    </TouchableOpacity>
  </View>
);

/* ─── Route row ──────────────────────────────────────────────────── */
const RouteRow = ({ dotColor, time, name, isLast, isPickup }) => (
  <View style={[s.routeRow, !isLast && s.routeRowBorder]}>
    <View style={[s.dotIconWrap, { backgroundColor: dotColor + '15', borderColor: dotColor + '40' }]}>
      {isPickup
        ? <MapPin     size={scale(11)} color={dotColor} strokeWidth={2.5} />
        : <Navigation size={scale(11)} color={dotColor} strokeWidth={2.5} />
      }
    </View>

    <View style={s.routeText}>
      <Text style={s.routeTime}>{time}</Text>
      <Text style={s.routeName} numberOfLines={2}>{name}</Text>
    </View>
  </View>
);

/* ─── Countdown button ───────────────────────────────────────────── */
const CountdownButton = ({ remaining, total, onPress, accepted }) => {
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: remaining / total,
      duration: 950,
      useNativeDriver: false,
    }).start();
  }, [remaining]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      style={s.acceptBtn}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={s.acceptBtnText}>
        {accepted ? 'Accepted!' : `Tap to Accept (${remaining}s)`}
      </Text>
      <Animated.View style={[s.progressBar, { width: barWidth }]} />
    </TouchableOpacity>
  );
};

/* ─── Main component ─────────────────────────────────────────────── */
export default function RideRequestCard({
  ride,
  onAccept,
  onDecline,
  visible,
  duration = 14,
}) {
  const [remaining, setRemaining] = useState(duration);
  const [accepted, setAccepted] = useState(false);
  const intervalRef = useRef(null);
  const slideY  = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);

  /* ── Sound ──────────────────────────────────────────────────────
     A single effect handles both play and cleanup.
     The `cancelled` flag prevents a late async callback from
     calling play() after the effect has already been torn down
     (new ride arrived, card hidden, or user accepted mid-load).
  ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!visible || accepted) return;

    let cancelled = false;

    const sound = new Sound(
      'ride_arriving.mp3',
      Platform.OS === 'ios' ? Sound.MAIN_BUNDLE : '',
      (error) => {
        if (cancelled) {
          // Effect already cleaned up — free memory and do NOT play
          sound.release();
          return;
        }
        if (error) {
          console.log('Failed to load sound', error);
          return;
        }
        soundRef.current = sound;
        sound.setNumberOfLoops(-1);
        sound.setVolume(1.0);
        sound.play((success) => {
          if (!success) console.log('Sound playback failed');
        });
      },
    );

    return () => {
      cancelled = true; // stop async callback from playing a stale sound
      if (soundRef.current) {
        soundRef.current.stop(() => soundRef.current?.release());
        soundRef.current = null;
      }
    };
  }, [visible, accepted, ride?.id]);

  /* ── Slide in/out ───────────────────────────────────── */
  useEffect(() => {
    if (visible) {
      setRemaining(duration);
      setAccepted(false);
      Animated.parallel([
        Animated.spring(slideY,  { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(opacity, { toValue: 1, duration: 250,         useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY,  { toValue: 100, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0,   duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  /* ── Countdown tick ─────────────────────────────────── */
  useEffect(() => {
    if (!visible || accepted) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); intervalRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { clearInterval(intervalRef.current); intervalRef.current = null; };
  }, [visible, accepted, ride?.id]);

  useEffect(() => {
    if (remaining === 0 && visible && !accepted) onDecline?.();
  }, [remaining, visible, accepted, onDecline]);

  useEffect(() => {
    if (visible) { setRemaining(duration); setAccepted(false); }
  }, [visible, ride?.id, duration]);

  const handleAccept = useCallback(() => {
    clearInterval(intervalRef.current);
    setAccepted(true);
    setTimeout(() => onAccept?.(ride), 600);
  }, [ride]);

  if (!visible) return null;

  return (
    <Animated.View style={[s.wrapper, { transform: [{ translateY: slideY }], opacity }]}>
      <View style={s.card}>

        {/* Badge row */}
        <BadgeRow type={ride?.type} onClose={onDecline} />

        {/* Price */}
        <Text style={s.price}>${ride?.fare?.toFixed(2) ?? '0.00'}</Text>
        <View style={s.taxPill}>
          <Text style={s.taxText}>Including 5% tax</Text>
        </View>

        {/* Route */}
        <View style={s.routeBox}>
          <RouteRow
            dotColor="#1A1A1A"
            isPickup
            time={`${ride?.pickup?.eta ?? 0} min (${ride?.pickup?.distance ?? 0} km)`}
            name={ride?.pickup?.address ?? ''}
          />
          <RouteRow
            dotColor="#AAAAAA"
            time={`${ride?.duration ?? 0} min (${ride?.dropoff?.distance ?? 0} km)`}
            name={ride?.dropoff?.address ?? ''}
            isLast
          />
        </View>

        {/* Countdown button */}
        <CountdownButton
          remaining={remaining}
          total={duration}
          onPress={handleAccept}
          accepted={accepted}
        />

      </View>
    </Animated.View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: scale(16),
    right: scale(16),
    zIndex: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    padding: scale(18),
    borderWidth: 2,
    borderColor: colors.secondary,
    overflow: 'hidden',
  },

  // Top gradient accent line
  topAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: verticalScale(3),
  },

  /* Badge row */
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(14),
    marginTop: verticalScale(6),
  },
  badgeDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    backgroundColor: '#1A1A1A',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(8),
  },
  badgeDeliveryText: {
    color: colors.primary,
    fontSize: moderateScale(12),
    fontFamily: fonts.bold,
    letterSpacing: 0.2,
  },
  badgeExclusive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    backgroundColor: '#F2F2F2',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(8),
  },
  badgeExclusiveText: {
    color: '#555555',
    fontSize: moderateScale(12),
    fontFamily: fonts.semiBold,
  },
  closeBtn: {
    marginLeft: 'auto',
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Price */
  price: {
    fontSize: moderateScale(34),
    fontFamily: fonts.bold,
    color: '#1A1A1A',
    letterSpacing: -1,
    marginBottom: verticalScale(8),
  },
  taxPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(20),
    marginBottom: verticalScale(18),
  },
  taxText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.medium,
    color: '#666666',
  },

  /* Route */
  routeBox: {
    marginBottom: verticalScale(18),
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: verticalScale(10),
    gap: scale(12),
  },
  routeRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  dotIconWrap: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(1),
    flexShrink: 0,
  },
  routeText: { flex: 1 },
  routeTime: {
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
    color: '#1A1A1A',
  },
  routeName: {
    fontSize: moderateScale(13),
    color: '#888888',
    marginTop: verticalScale(2),
    lineHeight: moderateScale(18),
  },

  /* Button */
  acceptBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(17),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  acceptBtnText: {
    color: colors.primary,
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    letterSpacing: 0.2,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    backgroundColor: colors.primary,
    opacity: 0.5,
    borderBottomLeftRadius: moderateScale(14),
  },
}); 