'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getServices } from '@/lib/storage';
import { Service, ServiceCategory } from '@/lib/types';
import ServiceCard from '@/components/ServiceCard';

const CATEGORIES: ServiceCategory[] = ['Moving Help', 'Airport Rides', 'Tutoring', 'Cleaning', 'Errands', 'Other'];

function ServicesBrowser() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    let filtered = getServices().filter(s => s.status === 'active');

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    }

    if (category) {
      filtered = filtered.filter(s => s.category === category);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setServices(filtered);
  }, [search, category, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Browse Services</h1>
        <p className="text-muted-foreground mt-1">Find services offered by verified UT Austin students</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-burnt-orange"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory('')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !category ? 'bg-burnt-orange text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? '' : c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === c ? 'bg-burnt-orange text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      {services.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="text-muted-foreground">Loading...</div></div>}>
      <ServicesBrowser />
    </Suspense>
  );
}
