/**
 * RideRequestCard.jsx
 * Uber Eats-style ride request card with 14-second countdown.
 * Auto-dismisses when timer hits 0.
 *
 * Props:
 *   ride        – ride object (see shape below)
 *   onAccept    – (ride) => void
 *   onDecline   – () => void
 *   visible     – boolean
 *   duration    – countdown seconds (default 14)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';

const SCREEN_W = Dimensions.get('window').width;
const CARD_W = SCREEN_W - scale(32);

/* ─── Fork / cutlery icon (simple SVG-free version using View) ─── */
const ForkIcon = () => {
  return (
    <View style={icon.wrap}>
      <View style={icon.tine} />
      <View style={icon.tine} />
      <View style={icon.tine} />
    </View>
  );
}
const icon = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 2, height: 12, alignItems: 'flex-end' },
  tine: { width: 2, height: 10, backgroundColor: colors.primary, borderRadius: 1 },
});

/* ─── Badge row ─────────────────────────────────────────────────── */
const BadgeRow = ({ type, onClose }) => {
  return (
    <View style={s.badgeRow}>
      <View style={s.badgeDelivery}>
        <ForkIcon />
        <Text style={s.badgeDeliveryText}>
          {type === 'delivery' ? 'Delivery' : 'Ride'}
        </Text>
      </View>
      <View style={s.badgeExclusive}>
        <Text style={s.badgeExclusiveText}>Exclusive</Text>
      </View>
      <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={s.closeBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ─── Route row ──────────────────────────────────────────────────── */
const RouteRow = ({ dotColor, time, name, isLast }) => {
  return (
    <View style={[s.routeRow, !isLast && s.routeRowBorder]}>
      <View style={[s.dot, { backgroundColor: dotColor }]} />
      <View style={s.routeText}>
        <Text style={s.routeTime}>{time}</Text>
        <Text style={s.routeName} numberOfLines={2}>{name}</Text>
      </View>
    </View>
  );
}

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
        {accepted
          ? 'Accepted!'
          : `Tap to Accept (${remaining}s)`}
      </Text>
      <Animated.View style={[s.progressBar, { width: barWidth }]} />
    </TouchableOpacity>
  );
}

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
  const slideY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  /* ── Slide in when visible ───────────────────────────────── */
  useEffect(() => {
    if (visible) {
      setRemaining(duration);
      setAccepted(false);
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: 300, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  /* ── Countdown tick ──────────────────────────────────────── */
  useEffect(() => {
    if (!visible || accepted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [visible, accepted]);

  /* ── Auto-dismiss when timer expires ─────────────────────── */
  useEffect(() => {
    if (remaining === 0 && visible && !accepted) {
      onDecline?.();
    }
  }, [remaining, visible, accepted, onDecline]);

  /* ── Reset timer when new ride appears ──────────────────── */
  useEffect(() => {
    if (visible) {
      setRemaining(duration);
      setAccepted(false);
    }
  }, [visible, ride?.id, duration]);

  const handleAccept = useCallback(() => {
    clearInterval(intervalRef.current);
    setAccepted(true);
    setTimeout(() => onAccept?.(ride), 600);
  }, [ride]);

  if (!visible && !ride) return null;

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
            time={`${ride?.pickup?.eta ?? 0} min (${ride?.pickup?.distance ?? 0} km)`}
            name={ride?.pickup?.address ?? ''}
          />
          <RouteRow
            dotColor="#CCCCCC"
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 14,
    borderWidth: 0.5,
    borderColor: '#E8E8E8',
  },

  /* Badge row */
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(14),
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
  closeBtnText: {
    fontSize: moderateScale(14),
    color: '#555555',
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
  dot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    marginTop: scale(3),
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