import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function Profile({ onSignInSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ full_name: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'signin'
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
      if (data.user) await fetchProfile(data.user.id);
      
      // Handle email confirmation from URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const token = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      if (token && type === 'recovery') {
        // Password recovery mode
        setIsRecoveryMode(true);
        setError('Please enter your new password below.');
      } else if (token && (type === 'email' || type === 'signup')) {
        try {
          // The access_token is already valid, just set the user
          const { data: sessionData, error: getError } = await supabase.auth.getUser();
          if (!getError && sessionData.user) {
            setUser(sessionData.user);
            setError('Email confirmed successfully!');
            // Clear the URL hash
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.error('Email confirmation error:', err);
        }
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile({ full_name: '', bio: '' });
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  async function signUp(e) {
    e?.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setError('Sign up successful! Check your email to confirm your account. Click the confirmation link in the email.');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(e) {
    e?.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
      } else {
        setEmail('');
        setPassword('');
        // Redirect to home page after successful sign-in
        if (onSignInSuccess) {
          onSignInSuccess();
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setError('');
    setLoading(true);
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (oauthError) {
        setError(oauthError.message);
        setLoading(false);
      }
      // Note: Page will redirect to Google, so we don't set loading to false here
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile({ full_name: '', bio: '' });
  }

  async function resetPassword(e) {
    e?.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/#type=recovery`
      });
      if (resetError) {
        console.error('Password reset error:', resetError);
        setError(`Error: ${resetError.message || 'Could not send reset email. Please check if the email exists.'}`);
      } else {
        setError('✅ Password reset link sent! Check your inbox and spam folder. If you don\'t receive it in 5 minutes, the email might not be configured on your account.');
        setResetEmail('');
        setTimeout(() => {
          setShowResetPassword(false);
          setError('');
        }, 5000);
      }
    } catch (err) {
      console.error('Reset password exception:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function updatePassword(e) {
    e?.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (updateError) {
        setError(`Error: ${updateError.message}`);
      } else {
        setError('✅ Password updated successfully! You can now sign in with your new password.');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsRecoveryMode(false);
          setError('');
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 3000);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile({ full_name: '', bio: '' });
  }

  async function fetchProfile(userId) {
    setLoading(true);
    const { data, error: profileError } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    setLoading(false);
    if (!profileError && data) setProfile({ full_name: data.full_name || '', bio: data.bio || '' });
  }

  async function saveProfile(e) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const payload = {
      user_id: user.id,
      full_name: profile.full_name,
      email: user.email,
      bio: profile.bio,
      preferences: {}
    };
    const { error } = await supabase.from('profiles').upsert(payload);
    setLoading(false);
    if (!error) fetchProfile(user.id);
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      {isRecoveryMode ? (
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', fontWeight: '600', color: '#111827' }}>Reset Your Password</h2>
          
          {error && (
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: error.includes('✅') ? '#d1fae5' : '#fee2e2', color: error.includes('✅') ? '#065f46' : '#991b1b', borderRadius: '6px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={updatePassword}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Confirm New Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '10px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      ) : !user ? (
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px', fontWeight: '600', color: '#111827' }}>Account & Profile</h2>
          
          {/* Tab Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: authMode === 'signup' ? '#3b82f6' : '#9ca3af', backgroundColor: 'transparent', border: 'none', borderBottom: authMode === 'signup' ? '2px solid #3b82f6' : 'none', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: authMode === 'signin' ? '#3b82f6' : '#9ca3af', backgroundColor: 'transparent', border: 'none', borderBottom: authMode === 'signin' ? '2px solid #3b82f6' : 'none', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              Sign In
            </button>
          </div>

          {error && (
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: error.includes('successful') ? '#d1fae5' : '#fee2e2', color: error.includes('successful') ? '#065f46' : '#991b1b', borderRadius: '6px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Email</label>
              <input 
                type="email"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px 12px', paddingRight: '40px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            {authMode === 'signin' && (
              <button
                type="button"
                onClick={() => setShowResetPassword(!showResetPassword)}
                style={{ display: 'block', marginBottom: '16px', fontSize: '13px', color: '#3b82f6', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Forgot password?
              </button>
            )}
            {showResetPassword && (
              <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Reset Password</label>
                <input 
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <button
                  type="button"
                  onClick={resetPassword}
                  disabled={loading}
                  style={{ width: '100%', padding: '10px 16px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            )}
            <button 
              type="button"
              onClick={authMode === 'signup' ? signUp : signIn}
              disabled={loading}
              style={{ width: '100%', padding: '10px 16px', backgroundColor: authMode === 'signup' ? '#10b981' : '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Loading...' : (authMode === 'signup' ? 'Sign Up' : 'Sign In')}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
              <span style={{ padding: '0 12px', fontSize: '13px', color: '#9ca3af' }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            </div>

            {/* Google Sign-in Button */}
            <button 
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              style={{ width: '100%', padding: '10px 16px', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4"/>
                <path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853"/>
                <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54755 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05"/>
                <path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335"/>
              </svg>
              {loading ? 'Loading...' : `Continue with Google`}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '32px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Logged in as</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>{user.email}</p>
          </div>

          <form onSubmit={saveProfile}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Full name</label>
              <input 
                value={profile.full_name} 
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} 
                placeholder="Enter your full name"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>Bio</label>
              <textarea 
                value={profile.bio} 
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
                placeholder="Tell us about yourself"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', minHeight: '100px', fontFamily: 'inherit' }}
              />
            </div>
            <button 
              disabled={loading} 
              type="submit"
              style={{ width: '100%', padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '16px' }}
            >
              {loading ? 'Saving...' : 'Save profile'}
            </button>
          </form>

          <button 
            onClick={signOut}
            style={{ width: '100%', padding: '10px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
