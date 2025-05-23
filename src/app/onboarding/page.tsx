'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppConfig } from '@/lib/api/config';
import { Megrim } from 'next/font/google';

const megrim = Megrim({ subsets: ['latin'], weight: '400' });

export default function OnboardingPage() {
  const router = useRouter();
  const hasRun = useRef(false); // 👈 flag to ensure effect only runs once

  useEffect(() => {
    if (hasRun.current) return; // 👈 skip if already run
    hasRun.current = true;

    const initiateOnboarding = async () => {
      try {
        const res = await AppConfig.fetchWithAuth(
          `${AppConfig.postgresHttpBaseUrl}/merchant/onboarding`,
          {
            method: 'POST',
            credentials: 'include', // IMPORTANT: includes cookies
          }
        );

        if (res.status === 200) {
          const link = await res.text();
          console.log('[DEBUG] Status:', res.status);
          console.log('[DEBUG] Body:', link);
          window.location.href = link;
        }
      } catch (e) {
        console.error('Failed to initiate onboarding:', e);
      }
    };

    initiateOnboarding();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-gray-700">
      <p className={`text-4xl font-semibold text-white ${megrim.className}`}>
        Redirecting...
      </p>
    </div>
  );
}