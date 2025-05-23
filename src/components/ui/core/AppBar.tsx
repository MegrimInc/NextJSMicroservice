'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppConfig } from '@/lib/api/config';

interface AppBarProps {
  megrimFont: string;
}

export default function AppBar({ megrimFont }: AppBarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const syncLoginStatus = useCallback(async () => {
    try {
      const res = await fetch(
        `${AppConfig.postgresHttpBaseUrl}/auth/checkSession`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const loggedIn = res.ok;
      setIsLoggedIn(loggedIn);

      const isPublicPage = ['/', '/login', '/register'].includes(pathname);

      if (loggedIn && !isPublicPage) {
        fetchStripeStatus();
      }

      if (loggedIn && isPublicPage) {
        router.push('/analytics');
      } else if (!loggedIn && !isPublicPage) {
        router.push('/');
      }
    } catch (e) {
      setIsLoggedIn(false);
      router.push('/');
    }
  }, [pathname]);

  const fetchStripeStatus = useCallback(async () => {
    try {
      const res = await fetch(`${AppConfig.postgresHttpBaseUrl}/merchant/stripeStatus`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      setStripeStatus(data.stripe_verification_status); // lowercase now
    } catch {
      setStripeStatus('error');
    }
  }, []);

  const getStripeBannerInfo = (status: string | null) => {
    if (!status || status === 'verified') return null;

    switch (status) {
      case 'unverified':
        return {
          icon: '⚠️',
          message: '⚠️ Your account has not been verified yet and thus is not visible to customers. Please complete verification.',
          linkLabel: 'Verify',
          linkType: 'onboarding',
        };

      case 'requirements.past_due':
        return {
          icon: '⚠️',
          message: '⚠️ Your Megrim account is past due on required information. Please verify to continue receiving payouts.',
          linkLabel: 'Fix Now',
          linkType: 'onboarding',
        };

      case 'requirements.currently_due':
        return {
          icon: '⚠️',
          message: '⚠️ Some required fields are missing. Update your business details to activate your account.',
          linkLabel: 'Resolve',
          linkType: 'onboarding',
        };

      case 'requirements.eventually_due':
        return {
          icon: '⚠️',
          message: '⚠️ Additional details are needed soon for compliance. Take action now to avoid payout interruptions.',
          linkLabel: 'Update Info',
          linkType: 'onboarding',
        };

      case 'requirements.pending_verification':
      case 'under_review':
        return {
          icon: '⏳',
          message: '⏳ Your info is under review. Please check back shortly.',
          linkLabel: 'Check',
          linkType: 'refresh',
        };

      case 'under_review':
        return {
          icon: '🔍',
          message: '🔍 Your account is currently under review. This is usually temporary.',
          linkLabel: 'Refresh',
          linkType: 'refresh',
        };

      case 'rejected.fraud':
        return {
          icon: '❌',
          message: '❌ Megrim has rejected your account due to suspected fraudulent activity.',
          linkLabel: null,
          linkType: null,
        };

      case 'rejected.listed':
        return {
          icon: '❌',
          message: '❌ Megrim rejected your account due to a regulatory or sanctions list match.',
          linkLabel: null,
          linkType: null,
        };

      case 'rejected.terms_of_service':
        return {
          icon: '❌',
          message: '❌ Your account was rejected for violating our Terms of Service.',
          linkLabel: null,
          linkType: null,
        };

      default:
        return {
          icon: '⚠️',
          message: '⚠️ Unknown verification status!',
          linkLabel: 'Open Stripe',
          linkType: 'onboarding',
        };
    }
  };

  const stripeBanner = getStripeBannerInfo(stripeStatus);


  // 🚪 Logout & trigger global status change
  const handleLogout = async () => {
    await fetch(`${AppConfig.postgresHttpBaseUrl}/auth/logout-merchant`, {
      method: 'POST',
      credentials: 'include',
    });

    window.dispatchEvent(new Event('loginStatusChanged'));
  };

  // 🔁 Re-check login on route change or custom event
  useEffect(() => {
    syncLoginStatus();

    window.addEventListener('loginStatusChanged', syncLoginStatus);
    return () =>
      window.removeEventListener('loginStatusChanged', syncLoginStatus);
  }, [pathname, syncLoginStatus]);


  return (
    <>
      <header
        className="bg-gradient-to-r from-black via-gray-900 to-gray-700 shadow-md font-sans border-b-2 border-solid"
        style={{
          borderImage:
            'linear-gradient(to right, rgba(255,255,255,0.2), rgba(100,100,100,0.5), rgba(0,0,0,1)) 1',
        }}
      >
        <nav className="flex items-center justify-between w-full py-4 px-6 rounded-b-xl">
          <div
            className={`text-2xl font-extrabold tracking-wide text-white drop-shadow-sm ${megrimFont}`}
          >
            Megrim
          </div>
          <ul className="flex space-x-6 text-lg font-medium text-white">
            {!isLoggedIn && (
              <li>
                <Link
                  href="/"
                  className="hover:text-gray-300 transition duration-200"
                >
                  Home
                </Link>
              </li>
            )}
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    href="/inventory"
                    className="hover:text-gray-300 transition duration-200"
                  >
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analytics"
                    className="hover:text-gray-300 transition duration-200"
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/configurations"
                    className="hover:text-gray-300 transition duration-200"
                  >
                    Configurations
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-300 transition duration-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-gray-300 transition duration-200"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-gray-300 transition duration-200"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {isLoggedIn && stripeBanner && (
        <div className="fixed bottom-0 left-0 w-full bg-yellow-500 text-black text-center py-2 z-50 shadow-md">
          {stripeBanner.icon} {stripeBanner.message}{' '}
          {stripeBanner.linkType === 'onboarding' && (
            <Link
              href="/onboarding"
              className="underline font-semibold hover:text-yellow-900"
            >
              {stripeBanner.linkLabel}
            </Link>
          )}
          {stripeBanner.linkType === 'refresh' && (
            <button
              onClick={() => window.location.reload()}
              className="underline font-semibold hover:text-yellow-900"
            >
              {stripeBanner.linkLabel}
            </button>
          )}
        </div>
      )}
    </>
  );
}
