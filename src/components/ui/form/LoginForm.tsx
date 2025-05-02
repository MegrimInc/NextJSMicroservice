"use client";

import React, { useState, useEffect } from "react";
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

  const [error, setError] = useState(""); // Error message to show user

  // 🛠 Helper: Delete auth cookie
  function deleteAuthCookie() { 
    document.cookie = "auth=; Max-Age=0; path=/; Secure; SameSite=Strict;"; 
  }

  // 🌟 Try auto-login on page load
  useEffect(() => {
    async function tryAutoLogin() {
      try {
        const authCookie = document.cookie  // eslint-disable-line @typescript-eslint/no-unused-vars
            .split("; ")
            .find(row => row.startsWith("auth="))
            ?.split("=")[1] || "";

        const response = await fetch("https://www.barzzy.site/postgres-test/signup/login-merchant", {
          method: "POST",
          body: JSON.stringify({
            email: "",
            password: "",
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Very important for sending cookies
        });

        if (response.ok) {
          const result = await response.text();
          if (result === "OK") {
            router.push("/analytics");
          }
        } else {
          const result = await response.text();
          if (result === "EMPTY") {
            // No credentials given; stay on login page quietly
          } else if (result === "INVALID_CREDENTIALS") {
            deleteAuthCookie();
            setError("Invalid credentials. Please log in.");
          } else {
            deleteAuthCookie();
            setError("Login failed. Please try again.");
          }
        }
      } catch (err) {
        console.error("Auto-login error:", err);
        deleteAuthCookie();
        setError("Error trying to log in. Please try again.");
      }
    }

    tryAutoLogin();
     // eslint-disable-line @typescript-eslint/no-unused-vars
  }, [router]);

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
      const response =  await fetch("https://www.barzzy.site/postgres-test/signup/login-merchant", { // TODO change to HTTPS
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        deleteAuthCookie();
        const result = await response.text();
        if (result === "INVALID_CREDENTIALS") {
          setError("Invalid email or password.");
        } else {
          setError("Login failed: " + result);
        }
        return;
      }

      const result = await response.text();
      if (result === "OK") {
        // Login success
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("barEmail", formData.email);
        localStorage.setItem("barPW", formData.password);

        window.dispatchEvent(new Event("loginStatusChanged"));
        router.push("/analytics");
      }
    }catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setError(message);
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

        {/* Form container */}
        <div className="relative w-full max-w-md p-8 bg-white/90 shadow-md rounded-lg z-20">
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
            {error && (
                <div className="text-red-600 text-sm mb-2">
                  {error}
                </div>
            )}

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
