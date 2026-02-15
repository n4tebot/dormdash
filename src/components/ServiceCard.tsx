'use client';

import Link from 'next/link';
import { Service } from '@/lib/types';
import { getUserById } from '@/lib/storage';

const CATEGORY_ICONS: Record<string, string> = {
  'Moving Help': '📦',
  'Airport Rides': '✈️',
  'Tutoring': '📚',
  'Cleaning': '🧹',
  'Errands': '🏃',
  'Other': '💡',
};

export default function ServiceCard({ service }: { service: Service }) {
  const provider = getUserById(service.providerId);

  return (
    <Link href={`/services/${service.id}`} className="group block">
      <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-burnt-orange/30 transition-all">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <span>{CATEGORY_ICONS[service.category] || '💡'}</span>
            {service.category}
          </span>
          <span className="text-lg font-bold text-burnt-orange">${service.price}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground group-hover:text-burnt-orange transition-colors mb-2 line-clamp-1">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {service.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {provider && (
              <>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-burnt-orange text-white text-[10px] font-bold">
                  {provider.name.charAt(0)}
                </div>
                <span>{provider.name}</span>
                {provider.eduVerified && <span className="text-green-600" title="Verified student">✓</span>}
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            <span className="line-clamp-1">{service.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
