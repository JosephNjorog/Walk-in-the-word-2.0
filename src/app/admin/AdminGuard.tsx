"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin via API
    fetch('/api/auth/get-session')
      .then(res => res.json())
      .then(data => {
        if (!data?.user) {
          router.push('/login?redirect=/admin');
        } else if (data.user.role !== 'admin') {
          router.push('/dashboard');
        }
      })
      .catch(() => {
        router.push('/login?redirect=/admin');
      });
  }, [router]);

  return <>{children}</>;
}
