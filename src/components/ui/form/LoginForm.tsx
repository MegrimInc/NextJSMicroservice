"use client";

import React, { useState } from "react";
import FormEntry from "./FormEntry";
import { useRouter } from "next/navigation";

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

            alert("Login successful! Redirecting to menu...");
            router.push("/analytics");
            router.refresh();
        } catch (error: any) {
            console.error("Login failed:", error);
            alert("Login failed: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Login to Your Bar</h2>
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
                    <button
                        type="submit"
                        className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
