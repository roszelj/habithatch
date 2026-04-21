import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { type WheelSegment, pickRandomSegment } from '../models/wheelSegments';

interface SpinWheelProps {
  segments: WheelSegment[];
  onResult: (segment: WheelSegment) => void;
}

// React Native does not support conic-gradient. We render a pie chart using
// rotated/clipped Views. Each segment is a colored wedge rendered as a half-disc
// clipped pair. For simplicity we render a compact list of colored segments
// instead of a true visual wheel, and use Animated.Value for the spin indicator.
export function SpinWheel({ segments, onResult }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);

  const segmentAngle = 360 / segments.length;

  function handleSpin() {
    if (spinning) return;
    setSpinning(true);

    const winner = pickRandomSegment();
    const winnerIndex = segments.findIndex(s => s.id === winner.id);
    const segmentCenter = winnerIndex * segmentAngle + segmentAngle / 2;
    const targetDeg = currentRotation.current + 360 * 5 + (360 - segmentCenter);
    currentRotation.current = targetDeg;

    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: targetDeg,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setSpinning(false);
      onResult(winner);
    });
  }

  const rotate = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  return (
    <View style={styles.container}>
      {/* Pointer */}
      <Text style={styles.pointer}>{'\u25BC'}</Text>

      {/* Wheel — colored strip segments arranged in a circle proxy */}
      <Animated.View style={[styles.wheel, { transform: [{ rotate }] }]}>
        {segments.map((seg, i) => {
          const angle = i * segmentAngle;
          return (
            <View
              key={seg.id}
              style={[
                styles.segment,
                {
                  backgroundColor: seg.color,
                  transform: [
                    { rotate: `${angle}deg` },
                    { translateY: -80 },
                  ],
                },
              ]}
            >
              <Text style={styles.segmentLabel} numberOfLines={2}>{seg.label}</Text>
            </View>
          );
        })}
        {/* Center dot */}
        <View style={styles.centerDot} />
      </Animated.View>

      <TouchableOpacity
        style={[styles.spinBtn, spinning && styles.btnDisabled]}
        onPress={handleSpin}
        disabled={spinning}
      >
        <Text style={styles.spinBtnText}>{spinning ? 'Spinning...' : 'Spin!'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 12 },
  pointer: { fontSize: 24, color: '#f0e68c' },
  wheel: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#275b7c',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  segment: {
    position: 'absolute',
    width: 70,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    marginLeft: -35,
    marginTop: 0,
  },
  segmentLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    position: 'absolute',
  },
  spinBtn: {
    paddingVertical: 12,
    paddingHorizontal: 36,
    backgroundColor: '#f0e68c',
    borderRadius: 10,
  },
  btnDisabled: { opacity: 0.5 },
  spinBtnText: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
});
