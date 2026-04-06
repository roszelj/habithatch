import styles from './ActionButton.module.css';

interface ActionButtonProps {
  label: string;
  emoji: string;
  cost?: number;
  disabled?: boolean;
  onClick: () => void;
}

export function ActionButton({ label, emoji, cost, disabled, onClick }: ActionButtonProps) {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.emoji}>{emoji}</span>
      <span>{label}</span>
      {cost !== undefined && <span className={styles.cost}>{cost}pt</span>}
    </button>
  );
}
