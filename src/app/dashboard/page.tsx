'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getServices, getBidsByBidderId, getTransactionsByUserId, getUserById } from '@/lib/storage';
import { Service, Bid, Transaction } from '@/lib/types';

type Tab = 'listings' | 'purchases' | 'bids' | 'earnings';

export default function DashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('listings');
  const [myListings, setMyListings] = useState<Service[]>([]);
  const [myBids, setMyBids] = useState<(Bid & { service?: Service })[]>([]);
  const [myTransactions, setMyTransactions] = useState<(Transaction & { service?: Service })[]>([]);

  useEffect(() => {
    if (user) {
      setMyListings(getServices().filter(s => s.providerId === user.id));

      const bids = getBidsByBidderId(user.id).map(b => {
        const services = getServices();
        return { ...b, service: services.find(s => s.id === b.serviceId) };
      });
      setMyBids(bids);

      const txs = getTransactionsByUserId(user.id).map(t => {
        const services = getServices();
        return { ...t, service: services.find(s => s.id === t.serviceId) };
      });
      setMyTransactions(txs);
    }
  }, [user]);

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

  const purchases = myTransactions.filter(t => t.buyerId === user.id);
  const earnings = myTransactions.filter(t => t.sellerId === user.id);
  const totalEarnings = earnings.reduce((sum, t) => sum + t.amount, 0);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'listings', label: 'My Listings', count: myListings.length },
    { key: 'purchases', label: 'Purchases', count: purchases.length },
    { key: 'bids', label: 'My Bids', count: myBids.length },
    { key: 'earnings', label: 'Earnings', count: earnings.length },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.name}</p>
        </div>
        <Link href="/services/create" className="rounded-xl bg-burnt-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors text-center">
          + New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Active Listings</p>
          <p className="text-2xl font-bold text-foreground mt-1">{myListings.filter(l => l.status === 'active').length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Purchases</p>
          <p className="text-2xl font-bold text-foreground mt-1">{purchases.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Active Bids</p>
          <p className="text-2xl font-bold text-foreground mt-1">{myBids.filter(b => b.status === 'pending').length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Earnings</p>
          <p className="text-2xl font-bold text-burnt-orange mt-1">${totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto border-b border-border">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
              tab === t.key
                ? 'border-burnt-orange text-burnt-orange'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              tab === t.key ? 'bg-burnt-orange/10 text-burnt-orange' : 'bg-muted text-muted-foreground'
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'listings' && (
        <div className="space-y-3">
          {myListings.length === 0 ? (
            <EmptyState icon="📋" title="No listings yet" desc="Create your first service listing" link="/services/create" linkText="Create listing" />
          ) : myListings.map(s => (
            <Link key={s.id} href={`/services/${s.id}`} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors">
              <div>
                <p className="font-medium text-foreground">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.category} · {s.location}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-burnt-orange">${s.price}</p>
                <span className={`text-xs font-medium ${
                  s.status === 'active' ? 'text-green-600' : s.status === 'completed' ? 'text-blue-600' : 'text-muted-foreground'
                }`}>{s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === 'purchases' && (
        <div className="space-y-3">
          {purchases.length === 0 ? (
            <EmptyState icon="🛒" title="No purchases yet" desc="Browse services and make your first purchase" link="/services" linkText="Browse services" />
          ) : purchases.map(t => (
            <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div>
                <p className="font-medium text-foreground">{t.service?.title || 'Unknown service'}</p>
                <p className="text-sm text-muted-foreground">
                  From: {getUserById(t.sellerId)?.name || 'Unknown'} · {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">${t.amount.toFixed(2)}</p>
                <span className="text-xs font-medium text-green-600">{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'bids' && (
        <div className="space-y-3">
          {myBids.length === 0 ? (
            <EmptyState icon="🏷️" title="No bids yet" desc="Make an offer on a service" link="/services" linkText="Browse services" />
          ) : myBids.map(b => (
            <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div>
                <p className="font-medium text-foreground">{b.service?.title || 'Unknown service'}</p>
                {b.message && <p className="text-sm text-muted-foreground">&ldquo;{b.message}&rdquo;</p>}
                <p className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-burnt-orange">${b.amount.toFixed(2)}</p>
                <span className={`text-xs font-medium ${
                  b.status === 'pending' ? 'text-yellow-600' : b.status === 'accepted' ? 'text-green-600' : 'text-red-500'
                }`}>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'earnings' && (
        <div>
          <div className="rounded-2xl border border-border bg-card p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">Total Earnings</h3>
            <p className="text-4xl font-bold text-burnt-orange">${totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">{earnings.length} transaction{earnings.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="space-y-3">
            {earnings.length === 0 ? (
              <EmptyState icon="💰" title="No earnings yet" desc="Create a service listing and start earning" link="/services/create" linkText="Create listing" />
            ) : earnings.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                <div>
                  <p className="font-medium text-foreground">{t.service?.title || 'Unknown service'}</p>
                  <p className="text-sm text-muted-foreground">
                    From: {getUserById(t.buyerId)?.name || 'Unknown'} · {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-bold text-green-600">+${t.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, desc, link, linkText }: { icon: string; title: string; desc: string; link: string; linkText: string }) {
  return (
    <div className="text-center py-16 rounded-2xl border border-border bg-card">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{desc}</p>
      <Link href={link} className="text-sm font-medium text-burnt-orange hover:text-burnt-orange-dark">{linkText} →</Link>
    </div>
  );
}
