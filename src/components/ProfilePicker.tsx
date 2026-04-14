import { useState } from 'react';
import { type ChildProfile } from '../models/types';
import { CreatureSprite } from './CreatureSprite';
import styles from './ProfilePicker.module.css';

interface ProfilePickerProps {
  profiles: ChildProfile[];
  canAdd: boolean;
  onSelect: (profileId: string) => void;
  onAddNew: () => void;
  parentPin?: string | null;
  onParentAccess?: () => void;
  onParentSetup?: () => void;
}

export function ProfilePicker({ profiles, canAdd, onSelect, onAddNew, parentPin, onParentAccess, onParentSetup }: ProfilePickerProps) {
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  function handleParentClick() {
    if (!parentPin) {
      onParentAccess?.();
    } else {
      setShowPinEntry(true);
      setPin('');
      setPinError(false);
    }
  }

  function handlePinSubmit() {
    if (pin === parentPin) {
      onParentAccess?.();
    } else {
      setPinError(true);
      setPin('');
    }
  }

  return (
    <div className={styles.screen}>
      <img src="/logo_header.png" alt="HabitHatch" className="logo-header" />
      <div className={styles.subtitle}>Who's playing?</div>
      <div className={styles.grid}>
        {profiles.map(p => (
          <button
            key={p.id}
            className={styles.card}
            onClick={() => onSelect(p.id)}
          >
            <div className={styles.cardSprite}>
              <CreatureSprite creatureType={p.creatureType} size={70} />
            </div>
            <span className={styles.cardName}>{p.childName || p.creatureName}</span>
            {p.childName && <span className={styles.cardCreature}>{p.creatureName}</span>}
          </button>
        ))}
        {canAdd && (
          <button className={styles.addCard} onClick={onAddNew}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.addLabel}>Add Child</span>
          </button>
        )}
      </div>

      {onParentAccess && parentPin && !showPinEntry && (
        <button className={styles.parentBtn} onClick={handleParentClick}>
          {'\u{1F512}'} Parent Access
        </button>
      )}

      {onParentSetup && !parentPin && !showPinEntry && (
        <button className={styles.parentBtn} onClick={onParentSetup}>
          Continue as Parent
        </button>
      )}

      {showPinEntry && (
        <div className={styles.pinEntry}>
          <div className={styles.pinLabel}>Enter parent PIN</div>
          <input
            className={`${styles.pinInput} ${pinError ? styles.pinError : ''}`}
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={pin}
            onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setPinError(false); }}
            onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
            autoFocus
            placeholder="••••"
          />
          {pinError && <div className={styles.pinErrorMsg}>Incorrect PIN</div>}
          <div className={styles.pinButtons}>
            <button className={styles.pinSubmitBtn} onClick={handlePinSubmit} disabled={pin.length === 0}>
              Enter
            </button>
            <button className={styles.pinCancelBtn} onClick={() => { setShowPinEntry(false); setPin(''); setPinError(false); }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
