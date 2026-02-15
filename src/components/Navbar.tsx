'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dormdash_dark_mode');
    if (saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('dormdash_dark_mode', String(next));
    document.documentElement.classList.toggle('dark', next);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-burnt-orange text-white font-bold text-lg">D</div>
              <span className="text-xl font-bold text-foreground">DormDash</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse</Link>
              {user && (
                <>
                  <Link href="/services/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create Listing</Link>
                  <Link href="/messages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Messages</Link>
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors" title="Toggle dark mode">
              {darkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              )}
            </button>
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-3">
                    <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-muted transition-colors">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-burnt-orange text-white text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-foreground">{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link href="/auth" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Log in</Link>
                    <Link href="/auth?mode=signup" className="rounded-lg bg-burnt-orange px-4 py-2 text-sm font-medium text-white hover:bg-burnt-orange-dark transition-colors">Sign up</Link>
                  </div>
                )}
              </>
            )}
            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pb-4 pt-2">
          <div className="flex flex-col gap-1">
            <Link href="/services" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Browse</Link>
            {user ? (
              <>
                <Link href="/services/create" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Create Listing</Link>
                <Link href="/messages" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Messages</Link>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Dashboard</Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Profile</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="rounded-lg px-3 py-2 text-sm text-left text-muted-foreground hover:bg-muted">Log out</button>
              </>
            ) : (
              <>
                <Link href="/auth" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Log in</Link>
                <Link href="/auth?mode=signup" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-burnt-orange hover:bg-muted">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
