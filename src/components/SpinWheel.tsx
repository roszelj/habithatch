import { useState, useRef } from 'react';
import { type WheelSegment, pickRandomSegment } from '../models/wheelSegments';
import styles from './SpinWheel.module.css';

interface SpinWheelProps {
  segments: WheelSegment[];
  onResult: (segment: WheelSegment) => void;
}

export function SpinWheel({ segments, onResult }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segmentAngle = 360 / segments.length;

  function handleSpin() {
    if (spinning) return;
    setSpinning(true);

    const winner = pickRandomSegment();
    const winnerIndex = segments.findIndex(s => s.id === winner.id);

    // Calculate angle: spin 5 full rotations + land on the winning segment
    // Segments go clockwise from top; pointer is at top (0deg)
    // Segment center angle = winnerIndex * segmentAngle + segmentAngle/2
    // We rotate the wheel so that segment ends up at the pointer (top)
    const segmentCenter = winnerIndex * segmentAngle + segmentAngle / 2;
    const targetAngle = rotation + 360 * 5 + (360 - segmentCenter);

    setRotation(targetAngle);

    setTimeout(() => {
      setSpinning(false);
      onResult(winner);
    }, 4200);
  }

  // Build conic-gradient for wheel segments
  const gradientStops = segments.map((seg, i) => {
    const start = (i / segments.length) * 100;
    const end = ((i + 1) / segments.length) * 100;
    return `${seg.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className={styles.container}>
      <div className={styles.pointer}>{'\u{25BC}'}</div>
      <div
        ref={wheelRef}
        className={styles.wheel}
        style={{
          background: `conic-gradient(${gradientStops})`,
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none',
        }}
      >
        {segments.map((seg, i) => {
          const angle = i * segmentAngle + segmentAngle / 2;
          return (
            <div
              key={seg.id}
              className={styles.label}
              style={{
                transform: `rotate(${angle}deg) translateY(-90px)`,
              }}
            >
              <span style={{ transform: `rotate(${-angle}deg)`, display: 'inline-block' }}>
                {seg.label}
              </span>
            </div>
          );
        })}
      </div>
      <button
        className={styles.spinBtn}
        onClick={handleSpin}
        disabled={spinning}
      >
        {spinning ? 'Spinning...' : 'Spin!'}
      </button>
    </div>
  );
}
