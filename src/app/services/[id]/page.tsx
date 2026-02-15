'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getServiceById, getUserById, getBidsByServiceId, createBid, updateBid, findConversation, createConversation } from '@/lib/storage';
import { Service, Bid, User } from '@/lib/types';

const CATEGORY_ICONS: Record<string, string> = {
  'Moving Help': '📦', 'Airport Rides': '✈️', 'Tutoring': '📚',
  'Cleaning': '🧹', 'Errands': '🏃', 'Other': '💡',
};

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<User | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const s = getServiceById(id);
    if (s) {
      setService(s);
      setProvider(getUserById(s.providerId) || null);
      setBids(getBidsByServiceId(s.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [id]);

  const handlePlaceBid = () => {
    if (!user) { router.push('/auth'); return; }
    setError('');
    if (!bidAmount || parseFloat(bidAmount) <= 0) { setError('Enter a valid bid amount.'); return; }
    createBid({
      serviceId: id,
      bidderId: user.id,
      amount: parseFloat(bidAmount),
      message: bidMessage.trim(),
      status: 'pending',
    });
    setBids(getBidsByServiceId(id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setBidAmount('');
    setBidMessage('');
    setShowBidForm(false);
  };

  const handleAcceptBid = (bid: Bid) => {
    updateBid(bid.id, { status: 'accepted' });
    // Reject other pending bids
    bids.filter(b => b.id !== bid.id && b.status === 'pending').forEach(b => updateBid(b.id, { status: 'rejected' }));
    setBids(getBidsByServiceId(id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleRejectBid = (bid: Bid) => {
    updateBid(bid.id, { status: 'rejected' });
    setBids(getBidsByServiceId(id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleBuyNow = () => {
    if (!user) { router.push('/auth'); return; }
    router.push(`/checkout/${id}`);
  };

  const handleMessage = () => {
    if (!user || !service) { router.push('/auth'); return; }
    let convo = findConversation(user.id, service.providerId, service.id);
    if (!convo) {
      convo = createConversation({ participants: [user.id, service.providerId], serviceId: service.id });
    }
    router.push(`/messages/${convo.id}`);
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Service not found.</p>
      </div>
    );
  }

  const isOwner = user?.id === service.providerId;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Back to services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {CATEGORY_ICONS[service.category] || '💡'} {service.category}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                service.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                service.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{service.title}</h1>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{service.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="text-sm font-medium text-foreground flex items-center gap-1">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  {service.location}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                <p className="text-sm font-medium text-foreground flex items-center gap-1">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  {new Date(service.dateTime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Bids */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Bids ({bids.length})</h2>
              {!isOwner && user && service.status === 'active' && (
                <button
                  onClick={() => setShowBidForm(!showBidForm)}
                  className="text-sm font-medium text-burnt-orange hover:text-burnt-orange-dark transition-colors"
                >
                  {showBidForm ? 'Cancel' : 'Make an Offer'}
                </button>
              )}
            </div>

            {showBidForm && (
              <div className="mb-6 p-4 rounded-xl bg-muted border border-border">
                {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Your Offer ($)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      placeholder={service.price.toString()}
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Message (optional)</label>
                    <input
                      type="text"
                      value={bidMessage}
                      onChange={e => setBidMessage(e.target.value)}
                      placeholder="Why should they accept your offer?"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
                    />
                  </div>
                  <button onClick={handlePlaceBid} className="w-full rounded-lg bg-burnt-orange px-4 py-2 text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors">
                    Submit Offer
                  </button>
                </div>
              </div>
            )}

            {bids.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No bids yet. Be the first to make an offer!</p>
            ) : (
              <div className="space-y-3">
                {bids.map(bid => {
                  const bidder = getUserById(bid.bidderId);
                  return (
                    <div key={bid.id} className="flex items-center justify-between p-4 rounded-xl bg-muted">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-burnt-orange text-white text-xs font-bold">
                          {bidder?.name.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{bidder?.name || 'Unknown'} — <span className="text-burnt-orange font-bold">${bid.amount}</span></p>
                          {bid.message && <p className="text-xs text-muted-foreground">{bid.message}</p>}
                          <p className="text-xs text-muted-foreground">{new Date(bid.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {bid.status === 'pending' && isOwner && (
                          <>
                            <button onClick={() => handleAcceptBid(bid)} className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 transition-colors">Accept</button>
                            <button onClick={() => handleRejectBid(bid)} className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 transition-colors">Reject</button>
                          </>
                        )}
                        {bid.status !== 'pending' && (
                          <span className={`text-xs font-medium ${bid.status === 'accepted' ? 'text-green-600' : 'text-red-500'}`}>
                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-3xl font-bold text-foreground mb-1">${service.price}</p>
            <p className="text-sm text-muted-foreground mb-6">Listed price</p>

            {!isOwner && service.status === 'active' && (
              <div className="space-y-3">
                <button onClick={handleBuyNow} className="w-full rounded-xl bg-burnt-orange px-4 py-3 text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors">
                  Buy Now — ${service.price}
                </button>
                <button onClick={() => setShowBidForm(true)} className="w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Make an Offer
                </button>
                <button onClick={handleMessage} className="w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" /></svg>
                  Message Seller
                </button>
              </div>
            )}
            {!user && service.status === 'active' && (
              <Link href="/auth" className="block w-full rounded-xl bg-burnt-orange px-4 py-3 text-center text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors">
                Sign in to Purchase
              </Link>
            )}
          </div>

          {/* Provider info */}
          {provider && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Service Provider</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burnt-orange text-white font-bold text-lg">
                  {provider.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{provider.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {provider.eduVerified && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                        .edu Verified
                      </span>
                    )}
                    {provider.idVerified && (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                        ID Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {provider.bio && <p className="text-sm text-muted-foreground">{provider.bio}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
