import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Zap, X } from 'lucide-react-native';
import DeliveryIcon from '../../assets/ridecardIcons/delivery_icon.svg';
import LocationFilledIcon from '../../assets/ridecardIcons/location_filled.svg';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';
import Sound from 'react-native-sound';

/* ─── Badge row ─────────────────────────────────────────────────── */
const BadgeRow = ({ onClose, orderType, scheduleType }) => (
  <View style={s.badgeRow}>
    <View style={s.badgeDelivery}>
      <DeliveryIcon width={scale(12)} height={scale(12)} fill={colors.primary} />
      <Text style={s.badgeDeliveryText}>{orderType ? orderType.charAt(0).toUpperCase() + orderType.slice(1) : 'Delivery'}</Text>
    </View>

    <View style={s.badgeExclusive}>
      <Zap size={scale(10)} color="#555555" strokeWidth={2.5} />
      <Text style={s.badgeExclusiveText}>{scheduleType ? scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1) : 'Now'}</Text>
    </View>

    <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
      <X size={scale(24)} color="#555555" strokeWidth={2.5} />
    </TouchableOpacity>
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
    <TouchableOpacity style={s.acceptBtn} onPress={onPress} activeOpacity={0.85}>
      <Text style={s.acceptBtnText}>
        {accepted ? 'Accepted!' : `Tap to Accept (${remaining}s)`}
      </Text>
      <Animated.View style={[s.progressBar, { width: barWidth }]} />
    </TouchableOpacity>
  );
};

/* ─── Single Card Component ─────────────────────────────────────── */
function SingleRideCard({
  ride,
  index,
  totalCount,
  isActive,
  onAccept,
  onDecline,
  visible,
  duration = 14,
}) {
  const [remaining, setRemaining] = useState(duration);
  const [accepted, setAccepted] = useState(false);
  const intervalRef = useRef(null);
  const slideY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef(null);

  // Stack positioning - each card behind is smaller and offset
  const stackOffset = index * verticalScale(12);
  const stackScale = 1 - (index * 0.05);
  const stackOpacity = 1 - (index * 0.15);

  /* ── Sound (only for active/top card) ──────────────────────────── */
  useEffect(() => {
    if (!visible || !isActive || accepted) return;

    let cancelled = false;

    const sound = new Sound(
      'ride_arriving.mp3',
      Platform.OS === 'ios' ? Sound.MAIN_BUNDLE : '',
      (error) => {
        if (cancelled) { sound.release(); return; }
        if (error) { console.log('Failed to load sound', error); return; }
        soundRef.current = sound;
        sound.setNumberOfLoops(-1);
        sound.setVolume(1.0);
        sound.play((success) => {
          if (!success) console.log('Sound playback failed');
        });
      },
    );

    return () => {
      cancelled = true;
      if (soundRef.current) {
        soundRef.current.stop(() => soundRef.current?.release());
        soundRef.current = null;
      }
    };
  }, [visible, isActive, accepted, ride?.id]);

  /* ── Slide in/out with stack effect ─────────────────────────────── */
  useEffect(() => {
    if (visible) {
      if (isActive) {
        setRemaining(duration);
        setAccepted(false);
      }
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: isActive ? 0 : stackOffset,
          useNativeDriver: true,
          tension: 80,
          friction: 12
        }),
        Animated.timing(opacity, {
          toValue: isActive ? 1 : stackOpacity,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: isActive ? 1 : stackScale,
          duration: 250,
          useNativeDriver: true
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: 100, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, isActive, stackOffset, stackScale, stackOpacity, duration]);

  /* ── Countdown tick (only for active card) ──────────────────────── */
  useEffect(() => {
    if (!isActive || !visible || accepted) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
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
    return () => { clearInterval(intervalRef.current); intervalRef.current = null; };
  }, [isActive, visible, accepted, ride?.id]);

  /* ── Auto-decline on timer expiry ──────────────────────────────── */
  useEffect(() => {
    if (remaining === 0 && isActive && visible && !accepted) {
      onDecline?.();
    }
  }, [remaining, isActive, visible, accepted, onDecline]);

  const handleAccept = useCallback(() => {
    clearInterval(intervalRef.current);
    setAccepted(true);
    setTimeout(() => onAccept?.(ride), 600);
  }, [ride, onAccept]);

  if (!visible) return null;

  // Background cards are non-interactive and dimmed
  const isBackground = !isActive;

  return (
    <Animated.View
      style={[
        s.wrapper,
        {
          transform: [
            { translateY: slideY },
            { scale: scaleAnim }
          ],
          opacity,
          zIndex: 1000 + (totalCount - index),
          bottom: verticalScale(20) + (index * verticalScale(8)),
        }
      ]}
      pointerEvents={isBackground ? 'none' : 'auto'}
    >
      <View style={[s.card, isBackground && s.cardBackground]}>

        {/* Badge row */}
        <BadgeRow
          onClose={isActive ? onDecline : null}
          orderType={ride?.order?.order_type}
          scheduleType={ride?.order?.schedule_type}
        />

        {/* Price */}
        <Text style={[s.price, isBackground && s.textMuted]}>
          ${(ride?.payout?.delivery_fee_amount || 0).toFixed(2)} + {(ride?.payout?.tip_amount || 0).toFixed(2)} (Tip)
        </Text>
        <View style={s.taxPill}>
          <Text style={s.taxText}>Total: ${((ride?.payout?.delivery_fee_amount || 0) + (ride?.payout?.tip_amount || 0)).toFixed(2)}</Text>
        </View>

        {/* Route */}
        <View style={s.routeBox}>

          {/* ── Pickup row ── */}
          <View style={s.routeRow}>
            <View style={[s.dotIconWrap, { backgroundColor: '#1A1A1A15', borderColor: '#1A1A1A40' }]}>
              <LocationFilledIcon width={scale(14)} height={scale(14)} fill="#1A1A1A" />
            </View>
            <View style={s.routeTextItem}>
              <Text style={[s.routeTime, isBackground && s.textMuted]}>
                {`${ride?.eta?.to_restaurant_minutes ?? 0} min (${ride?.route?.to_restaurant_km ?? 0} km)`}
              </Text>
              <Text style={[s.routeName, isBackground && s.textMuted]} numberOfLines={1}>
                {ride?.restaurant?.name ?? ''}
              </Text>
              <Text style={[s.routeSubName, isBackground && s.textMuted]} numberOfLines={2}>
                {ride?.restaurant?.address ?? ''}
              </Text>
            </View>
          </View>

          {/* ── Dotted connector ── */}
          <View style={s.connectorWrap}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={s.lineDot} />
            ))}
          </View>

          {/* ── Dropoff row ── */}
          <View style={s.routeRow}>
            <View style={[s.dotIconWrap, { backgroundColor: '#AAAAAA15', borderColor: '#AAAAAA40' }]}>
              <LocationFilledIcon width={scale(14)} height={scale(14)} fill="#AAAAAA" />
            </View>
            <View style={s.routeTextItem}>
              <Text style={[s.routeTime, isBackground && s.textMuted]}>
                {`${ride?.eta?.to_customer_minutes ?? 0} min (${ride?.route?.to_customer_km ?? 0} km)`}
              </Text>
              <Text style={[s.routeName, isBackground && s.textMuted]} numberOfLines={1}>
                {ride?.customer?.name ?? ''}
              </Text>
              <Text style={[s.routeSubName, isBackground && s.textMuted]} numberOfLines={2}>
                {ride?.customer?.address ?? ''}
              </Text>
            </View>
          </View>

        </View>

        {/* Countdown button - only for active card */}
        {isActive && (
          <CountdownButton
            remaining={remaining}
            total={duration}
            onPress={handleAccept}
            accepted={accepted}
          />
        )}

        {/* Queue indicator for background cards */}
        {isBackground && (
          <View style={s.queueIndicator}>
            <Text style={s.queueText}>#{index + 1} in queue</Text>
          </View>
        )}

      </View>
    </Animated.View>
  );
}

/* ─── Stacked Cards Component ───────────────────────────────────── */
export default function RideRequestCard({
  rides,
  onAccept,
  onDecline,
  visible,
  duration = 14,
}) {
  if (!visible || !rides || rides.length === 0) return null;

  return (
    <View style={s.stackContainer}>
      {rides.map((ride, index) => (
        <SingleRideCard
          key={ride.offer?.order_id || index}
          ride={ride}
          index={index}
          totalCount={rides.length}
          isActive={index === 0}
          onAccept={onAccept}
          onDecline={() => onDecline?.(ride.offer?.order_id)}
          visible={visible}
          duration={duration}
        />
      ))}
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  stackContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    pointerEvents: 'box-none',
    zIndex: 999,
  },
  wrapper: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: scale(16),
    right: scale(16),
    zIndex: 1000,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    padding: scale(18),
    borderWidth: 2,
    borderColor: colors.secondary,
    overflow: 'hidden',
  },
  cardBackground: {
    backgroundColor: '#F5F5F5',
    borderColor: '#DDDDDD',
  },
  textMuted: {
    color: '#999999',
  },
  queueIndicator: {
    position: 'absolute',
    top: scale(16),
    right: scale(16),
    backgroundColor: '#F2F2F2',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(20),
  },
  queueText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.medium,
    color: '#666666',
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
    width: scale(40),
    height: scale(40),
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

  // Each location is its own row — icon is always in the same
  // flex row as its text so alignment is guaranteed
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },

  // Icon circle
  dotIconWrap: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(30),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Text block — flex:1 so it fills the row beside the icon
  routeTextItem: {
    flex: 1,
    paddingVertical: verticalScale(4),
  },
  routeTime: {
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
    color: '#1A1A1A',
  },
  routeName: {
    fontSize: moderateScale(14),
    color: '#1A1A1A',
    fontFamily: fonts.semiBold,
    marginTop: verticalScale(2),
    lineHeight: moderateScale(18),
  },
  routeSubName: {
    fontSize: moderateScale(12),
    color: '#888888',
    marginTop: verticalScale(1),
    lineHeight: moderateScale(16),
  },

  // Connector: same width as dotIconWrap so dots sit centred
  // under both icons. No gap prop needed — marginVertical on
  // lineDot handles spacing and works on all RN versions.
  connectorWrap: {
    width: scale(24),
    alignItems: 'center',
  },
  lineDot: {
    width: scale(2.5),
    height: scale(2.5),
    borderRadius: scale(1.5),
    backgroundColor: '#CCCCCC',
    marginVertical: verticalScale(1.5),
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