"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/get-session')
      .then(res => res.json())
      .then(data => {
        if (!data?.user) {
          router.push('/login?redirect=/admin');
        }
        // If user is mwangijoenjoroge@gmail.com, allow access
        // TODO: Add proper role check when database is stable
      })
      .catch(() => {
        router.push('/login?redirect=/admin');
      });
  }, [router]);

  return <>{children}</>;
}
