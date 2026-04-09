/**
 * SwipeToConfirm.jsx
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { ChevronRight, Check } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDER_WIDTH  = SCREEN_WIDTH - scale(64);
const THUMB_SIZE    = scale(52);
const SLIDER_HEIGHT = verticalScale(60);
const PADDING       = scale(4);
const MAX_TRANSLATE  = SLIDER_WIDTH - THUMB_SIZE - PADDING * 2;

/* ════════════════════════════════════════════════════════════════ */
export default function SwipeToConfirm({
  title    = 'Swipe to',
  onConfirm,
  disabled = false,
  resetKey,
}) {
  const translateX  = useSharedValue(0);
  const thumbScale  = useSharedValue(1);
  const confirmed   = useSharedValue(0);   // 0 = idle, 1 = confirmed
  const isConfirmed = useSharedValue(false);

  /* Reset whenever resetKey or disabled changes */
  useEffect(() => {
    isConfirmed.value = false;
    translateX.value  = withSpring(0, { damping: 18, stiffness: 120 });
    confirmed.value   = withTiming(0, { duration: 200 });
  }, [resetKey, disabled]);

  const triggerConfirm = useCallback(() => {
    if (!disabled && onConfirm) onConfirm();
  }, [onConfirm, disabled]);

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetX([-5, 5])
    .failOffsetY([-10, 10])
    .onBegin(() => {
      if (isConfirmed.value) return;
      thumbScale.value = withTiming(0.92, { duration: 100 });
    })
    .onUpdate((e) => {
      if (isConfirmed.value) return;
      translateX.value = Math.max(0, Math.min(e.translationX, MAX_TRANSLATE));
    })
    .onEnd(() => {
      thumbScale.value = withTiming(1, { duration: 150 });
      if (isConfirmed.value) return;

      if (translateX.value >= MAX_TRANSLATE * 0.75) {
        // Snap to end and fire confirm immediately — no waiting
        isConfirmed.value = true;
        confirmed.value   = withTiming(1, { duration: 220 });
        translateX.value  = withSpring(MAX_TRANSLATE, { damping: 18, stiffness: 120 });
        runOnJS(triggerConfirm)();
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 120 });
      }
    })
    .onFinalize(() => {
      thumbScale.value = withTiming(1, { duration: 100 });
    });

  /* ── Animated styles ── */
  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_SIZE + PADDING,
  }));

  const thumbAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: thumbScale.value },
    ],
  }));

  // Label row fades out as swipe progresses
  const labelRowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, MAX_TRANSLATE * 0.35],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  // "Confirmed!" fades in
  const checkFadeIn = useAnimatedStyle(() => ({
    opacity: confirmed.value,
    transform: [{ scale: interpolate(confirmed.value, [0, 1], [0.85, 1]) }],
  }));

  // Chevron on thumb fades out when confirmed
  const chevronFadeOut = useAnimatedStyle(() => ({
    opacity: interpolate(confirmed.value, [0, 0.6], [1, 0], Extrapolation.CLAMP),
    position: 'absolute',
  }));

  // Check on thumb fades in when confirmed
  const checkOnThumb = useAnimatedStyle(() => ({
    opacity: confirmed.value,
    transform: [{ scale: interpolate(confirmed.value, [0, 1], [0.5, 1]) }],
    position: 'absolute',
  }));

  return (
    <View style={[styles.track, disabled && styles.disabled]}>

      {/* Sliding fill */}
      <Animated.View style={[styles.fill, fillStyle]} />

      {/* Label row: "Swipe to  >>>  Confirm" */}
      <Animated.View style={[styles.labelRow, labelRowStyle]} pointerEvents="none">
        <Text style={styles.labelLeft}>{title}</Text>
        <View style={styles.arrowGroup}>
          <ChevronRight size={moderateScale(15)} color={colors.primary} strokeWidth={2.8} />
          <ChevronRight size={moderateScale(15)} color={colors.primary} strokeWidth={2.8} />
          <ChevronRight size={moderateScale(15)} color={colors.primary} strokeWidth={2.8} />
        </View>
      </Animated.View>

      {/* Confirmed overlay — centred */}
      <Animated.View style={[styles.overlay, checkFadeIn]} pointerEvents="none">
        <Text style={styles.confirmedText}>Confirmed!</Text>
      </Animated.View>

      {/* Thumb */}
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.thumb, thumbAnimStyle]}>
          {/* Single clean chevron — fades out on confirm */}
          <Animated.View style={chevronFadeOut}>
            <ChevronRight
              size={moderateScale(22)}
              color="#1A1A1A"
              strokeWidth={2.8}
            />
          </Animated.View>

          {/* Check mark — fades in on confirm */}
          <Animated.View style={checkOnThumb}>
            <Check
              size={moderateScale(22)}
              color="#1A1A1A"
              strokeWidth={2.8}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>

    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  track: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    borderRadius: SLIDER_HEIGHT / 2,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: '#2C2C2C',
    position: 'relative',
  },
  disabled: {
    opacity: 0.45,
  },

  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: SLIDER_HEIGHT / 2,
    opacity: 0.22,
  },

  labelRow: {
    position: 'absolute',
    left: THUMB_SIZE + scale(14),
    right: scale(16),
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
  },
  labelLeft: {
    fontSize: moderateScale(13),
    fontFamily: fonts.medium,
    color: '#AAAAAA',
    letterSpacing: 0.2,
  },
  arrowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(1),
  },
  labelRight: {
    fontSize: moderateScale(13),
    fontFamily: fonts.medium,
    color: '#AAAAAA',
    letterSpacing: 0.2,
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.bold,
    color: colors.primary,
    letterSpacing: 0.2,
  },

  thumb: {
    position: 'absolute',
    left: PADDING,
    top: PADDING,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});