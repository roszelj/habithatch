import styles from './ActionButton.module.css';

interface ActionButtonProps {
  label: string;
  emoji: string;
  cost?: number;
  costUnit?: string;
  disabled?: boolean;
  onClick: () => void;
}

export function ActionButton({ label, emoji, cost, costUnit = 'pt', disabled, onClick }: ActionButtonProps) {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.emoji}>{emoji}</span>
      <span>{label}</span>
      {cost !== undefined && <span className={styles.cost}>{cost}{costUnit}</span>}
    </button>
  );
}
