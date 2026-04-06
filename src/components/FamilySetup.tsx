import styles from './FamilySetup.module.css';

interface FamilySetupProps {
  joinCode: string;
  onContinue: () => void;
}

export function FamilySetup({ joinCode, onContinue }: FamilySetupProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.title}>{'\u{2705}'} Family Created!</div>
      <div className={styles.subtitle}>
        Share this code with your kids so they can join from their own devices.
      </div>
      <div className={styles.codeBox}>{joinCode}</div>
      <div className={styles.hint}>
        Kids tap "I'm a Kid" and enter this code to join.
        You can find this code later in Parent Mode {'\u{2192}'} Stats.
      </div>
      <button className={styles.continueBtn} onClick={onContinue}>
        Continue to Game {'\u{2192}'}
      </button>
    </div>
  );
}
