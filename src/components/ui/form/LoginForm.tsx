"use client";

import React, { useState } from "react";
import FormEntry from "./FormEntry";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Megrim } from "next/font/google";

const megrim = Megrim({ subsets: ["latin"], weight: "400" });

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("https://www.barzzy.site/newsignup/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userId = await response.text();

      // Save session in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userID", userId);
      localStorage.setItem("barEmail", formData.email);
      localStorage.setItem("barPW", formData.password);

      // Notify AppBar
      window.dispatchEvent(new Event("loginStatusChanged"));

      // Automatically navigate to the analytics page (alert removed)
      router.push("/analytics");
      router.refresh();
    } catch (error: any) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-gray-700">
      {/* Background overlay text */}
      <div className="absolute top-1/4 left-0 right-0 flex items-center justify-center pointer-events-none z-10">
        <h2 className={`text-5xl font-bold text-white ${megrim.className}`}>
          Sign In To Your Account
        </h2>
      </div>

      {/* Form container with slight transparency to reveal background overlay */}
      <div className="relative w-full max-w-md p-8 bg-white/90 shadow-md rounded-lg z-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormEntry
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            handleChange={handleChange}
          />
          <FormEntry
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            handleChange={handleChange}
          />

          {/* Forgot password link placed below the password field */}
          <div className="text-right text-sm mb-2">
            <Link
              href="/forgotPassword"
              className="text-blue-600 hover:text-blue-800"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login button: black background, white text */}
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