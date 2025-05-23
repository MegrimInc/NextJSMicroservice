'use client';

import React, { useState, useEffect } from 'react';
import FormEntry from './FormEntry';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Megrim } from 'next/font/google';
import { AppConfig } from '@/lib/api/config';

const megrim = Megrim({ subsets: ['latin'], weight: '400' });

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // Error message to show user

  // 🛠 Helper: Delete auth cookie
  function deleteAuthCookie() {
    document.cookie = 'auth=; Max-Age=0; path=/; Secure; SameSite=Strict;';
  }

  // 🔹 Handle input typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Handle login form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${AppConfig.postgresHttpBaseUrl}/auth/login-merchant`,
        {
          // TODO change to HTTPS
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        deleteAuthCookie();
        const result = await response.text();
        if (result === 'INVALID_CREDENTIALS') {
          setError('Invalid email or password.');
        } else {
          setError('Login failed: ' + result);
        }
        return;
      }

      const result = await response.text();
      if (result === 'OK') {
        window.dispatchEvent(new Event('loginStatusChanged'));
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-gray-700">
      {/* Form container */}
      <div className="w-full max-w-md p-8 bg-white/90 shadow-md rounded-lg z-20">
        <h2
          className={`text-2xl font-bold text-center mb-6 text-black ${megrim.className}`}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <FormEntry
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            handleChange={handleChange}
          />

          {/* Password field */}
          <FormEntry
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            handleChange={handleChange}
          />

          {/* Forgot password link */}
          <div className="text-right text-sm mb-2">
            <Link
              href="/forgotPassword"
              className="text-blue-600 hover:text-blue-800"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Show error message if login failed */}
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

          {/* Login button */}
          <button
            type="submit"
            className="mt-2 p-2 w-full bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
