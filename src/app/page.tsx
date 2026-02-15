'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getServices } from '@/lib/storage';
import { Service } from '@/lib/types';
import ServiceCard from '@/components/ServiceCard';

export default function Home() {
  const [featured, setFeatured] = useState<Service[]>([]);

  useEffect(() => {
    const services = getServices().filter(s => s.status === 'active');
    setFeatured(services.slice(0, 3));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-burnt-orange to-burnt-orange-dark">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm text-white">
              <span className="mr-2">🤘</span> Built for UT Austin Students
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Get things done with fellow Longhorns
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              DormDash connects UT Austin students for everyday services — moving help, airport rides, tutoring, cleaning, and more. Verified students only.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/services"
                className="rounded-xl bg-white px-6 py-3.5 text-center text-sm font-semibold text-burnt-orange shadow-lg hover:bg-gray-100 transition-colors"
              >
                Browse Services
              </Link>
              <Link
                href="/auth?mode=signup"
                className="rounded-xl border-2 border-white/30 px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Get Started — It&apos;s Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">How DormDash Works</h2>
            <p className="mt-3 text-muted-foreground">Three simple steps to get started</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📧', title: 'Verify Your .edu Email', desc: 'Sign up with your @utexas.edu email to join the trusted student network.' },
              { icon: '🔍', title: 'Browse or Post Services', desc: 'Find what you need or offer your skills. Set your price and availability.' },
              { icon: '🤝', title: 'Connect & Transact', desc: 'Message providers, place bids, and pay securely through the platform.' },
            ].map((step, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-burnt-orange text-white text-sm font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services */}
      {featured.length > 0 && (
        <section className="py-20 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Featured Services</h2>
                <p className="mt-2 text-muted-foreground">Recently posted by verified students</p>
              </div>
              <Link href="/services" className="text-sm font-medium text-burnt-orange hover:text-burnt-orange-dark transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Popular Categories</h2>
            <p className="mt-3 text-muted-foreground">Find what you need</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Moving Help', icon: '📦' },
              { name: 'Airport Rides', icon: '✈️' },
              { name: 'Tutoring', icon: '📚' },
              { name: 'Cleaning', icon: '🧹' },
              { name: 'Errands', icon: '🏃' },
              { name: 'Other', icon: '💡' },
            ].map(cat => (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-card hover:border-burnt-orange hover:shadow-md transition-all"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-burnt-orange">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to join the Longhorn network?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Sign up with your UT Austin email and start browsing or offering services today.
          </p>
          <Link
            href="/auth?mode=signup"
            className="inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-burnt-orange shadow-lg hover:bg-gray-100 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
