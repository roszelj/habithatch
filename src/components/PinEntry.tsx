import { useState } from 'react';
import styles from './PinEntry.module.css';

interface PinEntryProps {
  mode: 'create' | 'verify';
  onSubmit: (pin: string) => boolean; // returns true if accepted
  onCancel: () => void;
}

export function PinEntry({ mode, onSubmit, onCancel }: PinEntryProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length !== 4) return;
    const ok = onSubmit(pin);
    if (!ok) {
      setError('Incorrect PIN. Try again!');
      setPin('');
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.title}>
        {mode === 'create' ? 'Create Parent PIN' : 'Enter Parent PIN'}
      </div>
      <div className={styles.subtitle}>
        {mode === 'create'
          ? 'Choose a 4-digit PIN to protect Parent Mode.'
          : 'Enter your 4-digit PIN to access Parent Mode.'}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.pinInput}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pin}
          onChange={e => {
            setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
            setError('');
          }}
          autoFocus
          placeholder="____"
        />
      </form>
      {error && <div className={styles.error}>{error}</div>}
      <button
        className={styles.confirmBtn}
        disabled={pin.length !== 4}
        onClick={handleSubmit as any}
      >
        {mode === 'create' ? 'Set PIN' : 'Enter'}
      </button>
      <button className={styles.cancelBtn} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
