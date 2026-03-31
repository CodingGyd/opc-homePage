'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, initDurationTracking } from '@/lib/tracker';

export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  useEffect(() => {
    initDurationTracking();
  }, []);

  return null;
}
