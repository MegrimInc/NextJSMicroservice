"use client";

import React, { useState } from "react";
import FormEntry from "./FormEntry";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api/api";

interface FormData {
    companyName: string;
    companyNickname: string;
    country: string;
    region: string;
    city: string;
    postalCode: string;
    address: string;
    email: string;
    password: string;
    openTime: string;
    closeTime: string;
}

export default function RegisterForm() {
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        companyName: "",
        companyNickname: "",
        country: "",
        region: "",
        city: "",
        postalCode: "",
        address: "",
        email: "",
        password: "",
        openTime: "",
        closeTime: "",
    });

    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            email: formData.email,
            password: formData.password,
            companyName: formData.companyName,
            companyNickname: formData.companyNickname,
            country: country,
            region: region,
            city: formData.city,
            address: formData.address,
            openTime: formData.openTime,
            closeTime: formData.closeTime,
        };

        try {
            // Register the bar on the backend
            const response = await fetch("https://www.barzzy.site/newsignup/registerbar", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });


            alert("Registration successful! Redirecting to Menu!");
            // Redirect to the new Drinks page
            router.push("/register/drinks");
            router.refresh();

        } catch (error: any) {
            console.error("Registration failed:", error);
            alert("Registration failed: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Register Your Bar</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormEntry
                        type="text"
                        name="companyName"
                        label="Company Name"
                        value={formData.companyName}
                        handleChange={handleChange}
                    />
                    <FormEntry
                        type="text"
                        name="companyNickname"
                        label="Company Nickname"
                        value={formData.companyNickname}
                        handleChange={handleChange}
                    />
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
                    <div>
                        <label className="block text-gray-700">Country</label>
                        <CountryDropdown
                            classes="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                            value={country}
                            onChange={(val: string) => setCountry(val)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Region</label>
                        <RegionDropdown
                            country={country}
                            classes="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                            value={region}
                            onChange={(val: string) => setRegion(val)}
                        />
                    </div>
                    <FormEntry
                        type="text"
                        name="city"
                        label="City"
                        value={formData.city}
                        handleChange={handleChange}
                    />
                    <FormEntry
                        type="text"
                        name="postalCode"
                        label="Postal Code"
                        value={formData.postalCode}
                        handleChange={handleChange}
                        pattern="[0-9]{5}"
                    />
                    <FormEntry
                        type="text"
                        name="address"
                        label="Address"
                        value={formData.address}
                        handleChange={handleChange}
                    />
                    <FormEntry
                        type="time"
                        name="openTime"
                        label="Open Time"
                        value={formData.openTime}
                        handleChange={handleChange}
                    />
                    <FormEntry
                        type="time"
                        name="closeTime"
                        label="Close Time"
                        value={formData.closeTime}
                        handleChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
