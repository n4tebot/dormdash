'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getUserByEmail, createUser, hashPassword, setVerificationCode, getVerificationCode, clearVerificationCode } from '@/lib/storage';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') setMode('signup');
  }, [searchParams]);

  const handleLogin = () => {
    setError('');
    const user = getUserByEmail(email);
    if (!user) { setError('No account found with this email.'); return; }
    if (user.password !== hashPassword(password)) { setError('Incorrect password.'); return; }
    login(user.id);
    router.push('/dashboard');
  };

  const handleSignup = () => {
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.endsWith('@utexas.edu')) { setError('Please use your @utexas.edu email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (getUserByEmail(email)) { setError('An account with this email already exists.'); return; }

    // Generate mock verification code
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(email, mockCode);
    setVerifyCode(mockCode);
    setStep('verify');
  };

  const handleVerify = () => {
    setError('');
    const stored = getVerificationCode(email);
    if (code !== stored) { setError('Invalid verification code.'); return; }
    clearVerificationCode(email);

    const user = createUser({
      name,
      email,
      password: hashPassword(password),
      avatarUrl: '',
      eduVerified: true,
      idVerified: false,
    });
    login(user.id);
    router.push('/dashboard');
  };

  if (step === 'verify') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-burnt-orange/10 mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Check Your Email</h1>
              <p className="text-sm text-muted-foreground mt-2">
                We sent a verification code to <strong>{email}</strong>
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4 mb-6 text-center">
              <p className="text-xs text-muted-foreground mb-1">Mock verification code (shown for demo):</p>
              <p className="text-2xl font-mono font-bold text-burnt-orange tracking-wider">{verifyCode}</p>
            </div>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground text-center text-lg tracking-wider placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
                />
              </div>
              <button
                onClick={handleVerify}
                className="w-full rounded-xl bg-burnt-orange px-4 py-3 text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors"
              >
                Verify & Create Account
              </button>
              <button
                onClick={() => setStep('form')}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="text-center mb-6">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-burnt-orange text-white font-bold text-xl mb-4">D</div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === 'login' ? 'Sign in to your DormDash account' : 'Join the UT Austin student marketplace'}
            </p>
          </div>
          {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}
          <div className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Hook Em"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yourname@utexas.edu"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
              />
              {mode === 'signup' && (
                <p className="text-xs text-muted-foreground mt-1">Must be a @utexas.edu email</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
              />
            </div>
            <button
              onClick={mode === 'login' ? handleLogin : handleSignup}
              className="w-full rounded-xl bg-burnt-orange px-4 py-3 text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors"
            >
              {mode === 'login' ? 'Sign In' : 'Continue'}
            </button>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>Don&apos;t have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); }} className="text-burnt-orange font-medium hover:text-burnt-orange-dark">Sign up</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); }} className="text-burnt-orange font-medium hover:text-burnt-orange-dark">Sign in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>}>
      <AuthForm />
    </Suspense>
  );
}
