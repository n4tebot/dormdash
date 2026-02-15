'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getServiceById, getUserById, createTransaction, updateService } from '@/lib/storage';
import { Service, User } from '@/lib/types';

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<User | null>(null);
  const [step, setStep] = useState<'payment' | 'confirmation'>('payment');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const s = getServiceById(id);
    if (s) {
      setService(s);
      setProvider(getUserById(s.providerId) || null);
    }
  }, [id]);

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

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Service not found.</p>
      </div>
    );
  }

  const handlePayment = () => {
    setError('');
    if (!cardName.trim()) { setError('Cardholder name is required.'); return; }
    if (cardNumber.replace(/\s/g, '').length < 16) { setError('Enter a valid card number.'); return; }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) { setError('Enter expiry as MM/YY.'); return; }
    if (cvv.length < 3) { setError('Enter a valid CVV.'); return; }

    const tx = createTransaction({
      serviceId: service.id,
      buyerId: user.id,
      sellerId: service.providerId,
      amount: service.price,
      status: 'completed',
    });
    updateService(service.id, { status: 'in-progress' });
    setTransactionId(tx.id);
    setStep('confirmation');
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  if (step === 'confirmation') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 text-center">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">Your order has been confirmed</p>

          <div className="rounded-xl bg-muted p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-foreground">{transactionId.slice(0, 12)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="text-foreground">{service.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="text-foreground">{provider?.name}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="font-medium text-foreground">Total Paid</span>
                <span className="font-bold text-burnt-orange">${service.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="w-full rounded-xl bg-burnt-orange px-4 py-3 text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors">
              View in Dashboard
            </Link>
            <Link href="/services" className="w-full rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Browse More Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href={`/services/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        Back to service
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Payment form */}
        <div className="md:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Payment Details</h2>
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-4 py-3 mb-6">
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                This is a mock payment form. No real charges will be made. Use any fake card details.
              </p>
            </div>
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 mb-4">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
                    placeholder="MM/YY"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange font-mono"
                  />
                </div>
              </div>
              <button
                onClick={handlePayment}
                className="w-full rounded-xl bg-burnt-orange px-4 py-3 text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors mt-4"
              >
                Pay ${service.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground">{service.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{service.category}</p>
              </div>
              {provider && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-burnt-orange text-white text-[10px] font-bold">
                    {provider.name.charAt(0)}
                  </div>
                  {provider.name}
                </div>
              )}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="text-foreground">${service.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span className="text-foreground">$0.00</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-border pt-2 mt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-burnt-orange">${service.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
