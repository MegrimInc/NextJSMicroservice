'use client';

import React, { useState } from 'react';
import FormEntry from './FormEntry';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useRouter } from 'next/navigation';
import { AppConfig } from '@/lib/api/config';
import { Megrim } from 'next/font/google';
const megrim = Megrim({ subsets: ['latin'], weight: '400' });

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    storeName: '',
    storeNickname: '',
    country: '',
    region: '',
    city: '',
    postalCode: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [showCodeField, setShowCodeField] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const cleanedValue =
      name === 'storeNickname' ? value.replace(/\s/g, '').toLowerCase() : value;

    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword)
      return setError('Passwords do not match.');

    // Basic empty validation
    for (const key in formData) {
      if (!formData[key as keyof typeof formData])
        return setError('All fields are required.');
    }

    // Phase 1: send email as URL-encoded
    const response = await fetch(
      `${AppConfig.postgresHttpBaseUrl}/auth/register-merchant`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        body: new URLSearchParams({ email: formData.email }).toString(),
      }
    );

    if (!response.ok) {
      const msg = await response.text();
      return setError(msg);
    }

    setShowCodeField(true);
  };

  const handleVerification = async () => {
    setError(null);

    const finalData = new FormData();
    finalData.append(
      'info',
      new Blob(
        [
          JSON.stringify({
            storeName: formData.storeName,
            storeNickname: formData.storeNickname,
            city: formData.city,
            stateOrProvince: formData.region,
            address: formData.address,
            country: formData.country,
            zipCode: formData.postalCode,
            email: formData.email,
            password: formData.password,
            verificationCode: verificationCode,
          }),
        ],
        { type: 'application/json' }
      )
    );

    const verifyRes = await fetch(
      `${AppConfig.postgresHttpBaseUrl}/auth/verify-merchant`,
      {
        method: 'POST',
        body: finalData,
        credentials: 'include',
      }
    );

    if (!verifyRes.ok) {
      const msg = await verifyRes.text();
      return setError(msg);
    }

    window.dispatchEvent(new Event('loginStatusChanged'));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-gray-700 py-20 sm:px-10 sm:py-16">
      <div className="w-full max-w-md p-8 bg-white/90 shadow-md rounded-lg">
        <h2
          className={`text-2xl font-bold text-center mb-6 text-black ${megrim.className}`}
        >
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormEntry
            type="text"
            name="storeName"
            label="Store Name"
            value={formData.storeName}
            handleChange={handleChange}
            disabled={showCodeField}
          />
          <FormEntry
            type="text"
            name="storeNickname"
            label="Store @"
            value={formData.storeNickname}
            handleChange={handleChange}
            disabled={showCodeField}
            maxLength={10}
          />
          <FormEntry
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            handleChange={handleChange}
            disabled={showCodeField}
          />
          <FormEntry
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            handleChange={handleChange}
            disabled={showCodeField}
          />
          <FormEntry
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            handleChange={handleChange}
            disabled={showCodeField}
          />

          <label className="block text-gray-700">Country</label>
          <CountryDropdown
            disabled={showCodeField}
            classes={`w-full px-3 py-2 mt-1 border rounded-md ${
              showCodeField
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'text-black'
            }`}
            value={formData.country}
            onChange={(val: string) =>
              setFormData((prev) => ({ ...prev, country: val }))
            }
          />

          <RegionDropdown
            disabled={showCodeField}
            country={formData.country}
            classes={`w-full px-3 py-2 mt-1 border rounded-md ${
              showCodeField
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'text-black'
            }`}
            value={formData.region}
            onChange={(val: string) =>
              setFormData((prev) => ({ ...prev, region: val }))
            }
          />

          <FormEntry
            type="text"
            name="city"
            label="City"
            value={formData.city}
            handleChange={handleChange}
            disabled={showCodeField}
          />
          <FormEntry
            type="text"
            name="postalCode"
            label="Postal Code"
            value={formData.postalCode}
            handleChange={handleChange}
            disabled={showCodeField}
          />
          <FormEntry
            type="text"
            name="address"
            label="Address"
            value={formData.address}
            handleChange={handleChange}
            disabled={showCodeField}
          />

          {!showCodeField ? (
            <button
              type="submit"
              className="mt-4 p-2 bg-black text-white rounded-md w-full hover:bg-black"
            >
              Register
            </button>
          ) : (
            <>
              <FormEntry
                type="text"
                name="verificationCode"
                label="Verification Code"
                value={verificationCode}
                handleChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                type="button"
                onClick={handleVerification}
                className="mt-4 p-2 bg-green-500 text-white rounded-md w-full hover:bg-green-600"
              >
                Verify
              </button>
            </>
          )}
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}
