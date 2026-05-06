import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { sendPasswordReset } from '../firebase/auth';

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleParentSubmit() {
    if (!email || !password) return;
    setLoading(true); setError('');
    try {
      if (isSignIn) { await onSignIn(email, password); }
      else { await onSignUp(email, password); }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') setError('Incorrect email or password.');
      else if (code === 'auth/user-not-found') setError('No account with this email. Try "Sign Up" instead.');
      else if (code === 'auth/email-already-in-use') setError('This email already has an account. Try "Sign In" instead.');
      else if (code === 'auth/weak-password') setError('Password must be at least 6 characters.');
      else if (code === 'auth/invalid-email') setError('Please enter a valid email address.');
      else setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!resetEmail) return;
    setResetLoading(true);
    try {
      await sendPasswordReset(resetEmail);
      setResetSent(true);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        setError('No account found with that email address.');
      } else {
        setError(err.message || 'Could not send reset email. Try again.');
      }
    }
    setResetLoading(false);
  }

  async function handleJoinSubmit() {
    if (joinCode.length < 6) return;
    setLoading(true); setError('');
    try { await onJoinFamily(joinCode.toUpperCase()); }
    catch (err: any) { setError(err.message || 'Family not found. Check the code.'); }
    setLoading(false);
  }

  if (mode === 'choose') {
    return (
      <View style={styles.screen}>
        <Image source={require('../../assets/logo_header.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitle}>How would you like to play?</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('parent')}>
          <Text style={styles.primaryBtnText}>👨‍👩‍👧 I'm a Parent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setMode('child')}>
          <Text style={styles.secondaryBtnText}>🧒 I'm a Kid (Join Family)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Text style={styles.skipBtnText}>Play locally without an account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === 'child') {
    return (
      <View style={styles.screen}>
        <Image source={require('../../assets/logo_header.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitle}>Enter your family code</Text>
        <TextInput
          style={styles.codeInput}
          value={joinCode}
          onChangeText={text => setJoinCode(text.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6))}
          placeholder="______"
          placeholderTextColor="rgba(255,255,255,0.3)"
          maxLength={6}
          autoCapitalize="characters"
          autoFocus
          onSubmitEditing={handleJoinSubmit}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.primaryBtn, (joinCode.length < 6 || loading) && styles.btnDisabled]}
          onPress={handleJoinSubmit}
          disabled={joinCode.length < 6 || loading}
        >
          <Text style={styles.primaryBtnText}>{loading ? 'Joining...' : 'Join Family'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={() => setMode('choose')}>
          <Text style={styles.skipBtnText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Image source={require('../../assets/logo_header.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, !isSignIn && styles.tabActive]} onPress={() => { setIsSignIn(false); setError(''); setShowForgotPassword(false); setResetSent(false); }}>
          <Text style={[styles.tabText, !isSignIn && styles.tabTextActive]}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, isSignIn && styles.tabActive]} onPress={() => { setIsSignIn(true); setError(''); setShowForgotPassword(false); setResetSent(false); }}>
          <Text style={[styles.tabText, isSignIn && styles.tabTextActive]}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {showForgotPassword ? (
        <>
          <Text style={styles.subtitle}>Enter your email to receive a reset link.</Text>
          {resetSent ? (
            <Text style={styles.successText}>Check your email for a password reset link.</Text>
          ) : (
            <>
              <TextInput
                style={styles.input}
                value={resetEmail}
                onChangeText={setResetEmail}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
                onSubmitEditing={handleForgotPassword}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity
                style={[styles.primaryBtn, (!resetEmail || resetLoading) && styles.btnDisabled]}
                onPress={handleForgotPassword}
                disabled={!resetEmail || resetLoading}
              >
                <Text style={styles.primaryBtnText}>{resetLoading ? 'Sending...' : 'Send Reset Email'}</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.skipBtn} onPress={() => { setShowForgotPassword(false); setResetSent(false); setError(''); }}>
            <Text style={styles.skipBtnText}>← Back to Sign In</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password (6+ characters)"
            placeholderTextColor="rgba(255,255,255,0.3)"
            secureTextEntry
            onSubmitEditing={handleParentSubmit}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.primaryBtn, (!email || !password || loading) && styles.btnDisabled]}
            onPress={handleParentSubmit}
            disabled={!email || !password || loading}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Create Family Account'}
            </Text>
          </TouchableOpacity>
          {isSignIn && (
            <TouchableOpacity onPress={() => { setShowForgotPassword(true); setResetEmail(email); setError(''); }}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <TouchableOpacity style={styles.skipBtn} onPress={() => setMode('choose')}>
        <Text style={styles.skipBtnText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    padding: 24,
  },
  logo: { width: 220, height: 70 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  primaryBtn: { width: '100%', padding: 12, backgroundColor: '#f0e68c', borderRadius: 10, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  primaryBtnText: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  secondaryBtn: {
    width: '100%', padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10, alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  skipBtn: { padding: 8, alignItems: 'center' },
  skipBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecorationLine: 'underline' },
  error: { fontSize: 14, color: '#e74c3c', textAlign: 'center' },
  codeInput: {
    padding: 14, fontSize: 24, textAlign: 'center', letterSpacing: 6,
    color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 10, width: '100%',
  },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingVertical: 8, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8,
  },
  tabActive: { borderColor: '#f0e68c' },
  tabText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  tabTextActive: { color: '#f0e68c' },
  forgotText: { fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecorationLine: 'underline' },
  successText: { fontSize: 14, color: '#2ecc71', textAlign: 'center' },
});
