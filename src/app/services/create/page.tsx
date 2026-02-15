'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { createService } from '@/lib/storage';
import { ServiceCategory } from '@/lib/types';

const CATEGORIES: ServiceCategory[] = ['Moving Help', 'Airport Rides', 'Tutoring', 'Cleaning', 'Errands', 'Other'];

export default function CreateServicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Moving Help');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Sign in required</h2>
          <p className="text-muted-foreground mb-4">You need to be logged in to create a service listing.</p>
          <a href="/auth" className="text-burnt-orange font-medium hover:text-burnt-orange-dark">Sign in →</a>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    setError('');
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }
    if (!price || parseFloat(price) <= 0) { setError('Please enter a valid price.'); return; }
    if (!location.trim()) { setError('Location is required.'); return; }
    if (!dateTime) { setError('Date and time are required.'); return; }

    const service = createService({
      providerId: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      location: location.trim(),
      dateTime,
      status: 'active',
    });

    router.push(`/services/${service.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground mb-2">Create a Service Listing</h1>
      <p className="text-muted-foreground mb-8">Describe the service you&apos;re offering to fellow Longhorns</p>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 mb-6">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Service Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Help Moving Into Dorm"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what you're offering, requirements, and any other details..."
            rows={4}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ServiceCategory)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="25.00"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g., Jester West, UT Austin Campus"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Date & Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={e => setDateTime(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-burnt-orange px-6 py-3 text-sm font-semibold text-white hover:bg-burnt-orange-dark transition-colors"
          >
            Post Service
          </button>
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
