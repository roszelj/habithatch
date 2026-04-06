import styles from './StatBar.module.css';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
}

export function StatBar({ label, value, color }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const barColor = pct < 20 ? '#e74c3c' : color;

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
