'use client';

import { useEffect } from 'react';
import { seedDataIfEmpty } from '@/lib/seed';

export default function SeedProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedDataIfEmpty();
  }, []);

  return <>{children}</>;
}
