'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { updateUser } from '@/lib/storage';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saved, setSaved] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Sign in required</h2>
          <a href="/auth" className="text-burnt-orange font-medium hover:text-burnt-orange-dark">Sign in →</a>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateUser(user.id, { name, bio });
    refreshUser();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleIdUpload = () => {
    // Simulate file upload
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock: just mark as ID verified
      updateUser(user.id, { idVerified: true, idImageUrl: URL.createObjectURL(file) });
      refreshUser();
      setIdUploaded(true);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
      <p className="text-muted-foreground mb-8">Manage your account and verification status</p>

      <div className="space-y-6">
        {/* Avatar & basic info */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-burnt-orange text-white font-bold text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell other students about yourself..."
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange resize-none"
              />
            </div>
            <button
              onClick={handleSave}
              className="rounded-xl bg-burnt-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors"
            >
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Verification */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Verification Status</h2>
          <div className="space-y-4">
            {/* Email verification */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${user.eduVerified ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                  {user.eduVerified ? (
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  ) : (
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">.edu Email Verification</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              {user.eduVerified ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  Verified
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Pending</span>
              )}
            </div>

            {/* ID verification */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${user.idVerified ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-muted'}`}>
                  {user.idVerified ? (
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  ) : (
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">Photo ID Verification</p>
                  <p className="text-sm text-muted-foreground">Upload a valid photo ID</p>
                </div>
              </div>
              {user.idVerified ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  Verified
                </span>
              ) : (
                <button
                  onClick={handleIdUpload}
                  className="rounded-lg bg-burnt-orange px-4 py-1.5 text-sm font-medium text-white hover:bg-burnt-orange-dark transition-colors"
                >
                  {idUploaded ? 'Uploaded!' : 'Upload ID'}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Account info */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span className="text-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
