import { useState } from 'react';
import styles from './AuthScreen.module.css';

interface AuthScreenProps {
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  onJoinFamily: (code: string) => Promise<void>;
  onSkip: () => void;
}

export function AuthScreen({ onSignUp, onSignIn, onJoinFamily, onSkip }: AuthScreenProps) {
  const [mode, setMode] = useState<'choose' | 'parent' | 'child'>('choose');
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleParentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      if (isSignIn) {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('Incorrect email or password.');
      } else if (code === 'auth/user-not-found') {
        setError('No account with this email. Try "Sign Up" instead.');
      } else if (code === 'auth/email-already-in-use') {
        setError('This email already has an account. Try "Sign In" instead.');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Something went wrong');
      }
      console.error('Auth error:', code, err.message);
    }
    setLoading(false);
  }

  async function handleJoinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (joinCode.length < 6) return;
    setLoading(true);
    setError('');
    try {
      await onJoinFamily(joinCode.toUpperCase());
    } catch (err: any) {
      setError(err.message || 'Family not found. Check the code.');
    }
    setLoading(false);
  }

  if (mode === 'choose') {
    return (
      <div className={styles.screen}>
        <div className={styles.title}>TERRAGUCCI</div>
        <div className={styles.subtitle}>How would you like to play?</div>
        <button className={styles.primaryBtn} onClick={() => setMode('parent')}>
          {'\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}'} I'm a Parent
        </button>
        <button className={styles.secondaryBtn} onClick={() => setMode('child')}>
          {'\u{1F9D2}'} I'm a Kid (Join Family)
        </button>
        <button className={styles.skipBtn} onClick={onSkip}>
          Play locally without an account
        </button>
      </div>
    );
  }

  if (mode === 'child') {
    return (
      <div className={styles.screen}>
        <div className={styles.title}>TERRAGUCCI</div>
        <div className={styles.subtitle}>Enter your family code</div>
        <form className={styles.form} onSubmit={handleJoinSubmit}>
          <input
            className={styles.codeInput}
            type="text"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6))}
            placeholder="______"
            maxLength={6}
            autoFocus
          />
          {error && <div className={styles.error}>{error}</div>}
          <button className={styles.primaryBtn} type="submit" disabled={joinCode.length < 6 || loading}>
            {loading ? 'Joining...' : 'Join Family'}
          </button>
        </form>
        <button className={styles.skipBtn} onClick={() => setMode('choose')}>
          {'\u{2190}'} Back
        </button>
      </div>
    );
  }

  // Parent sign up / sign in
  return (
    <div className={styles.screen}>
      <div className={styles.title}>TERRAGUCCI</div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${!isSignIn ? styles.active : ''}`}
          onClick={() => { setIsSignIn(false); setError(''); }}
        >
          Sign Up
        </button>
        <button
          className={`${styles.tab} ${isSignIn ? styles.active : ''}`}
          onClick={() => { setIsSignIn(true); setError(''); }}
        >
          Sign In
        </button>
      </div>
      <form className={styles.form} onSubmit={handleParentSubmit}>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          autoFocus
        />
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password (6+ characters)"
          minLength={6}
        />
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.primaryBtn} type="submit" disabled={!email || !password || loading}>
          {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Create Family Account'}
        </button>
      </form>
      <button className={styles.skipBtn} onClick={() => setMode('choose')}>
        {'\u{2190}'} Back
      </button>
    </div>
  );
}
