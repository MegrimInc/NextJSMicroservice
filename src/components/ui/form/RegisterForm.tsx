"use client";

import React, { useState } from "react";
import FormEntry from "./FormEntry";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
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

    const [logoImage, setLogoImage] = useState<File | null>(null);
    const [storeImage, setStoreImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoImage(e.target.files[0]);
        }
    };

    const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setStoreImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!logoImage) {
            alert("Logo image is required!");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("info", new Blob([JSON.stringify({
            name: formData.companyName,
            nickname: formData.companyNickname,
            city: formData.city,
            stateOrProvince: formData.region,
            address: formData.address,
            country: formData.country,
            zipCode: formData.postalCode,
            email: formData.email,
            password: formData.password,
        })], { type: "application/json" }));

        formDataToSend.append("logoImage", logoImage);
        if (storeImage) {
            formDataToSend.append("storeImage", storeImage);
        }

        try {
            const hostname = (typeof window !== "undefined" && window.location.hostname === "localhost")
                ? "http://localhost:8080"
                : "https://www.barzzy.site";

            const response = await fetch(`${hostname}/auth/register-merchant`, {
                method: "POST",
                body: formDataToSend,
                credentials: "include",
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("Registration successful! Redirecting to analytics...");
            router.push("/analytics");
            router.refresh();
        }  catch (error: unknown) {
            console.error("Registration error:", error);
          }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Register Your Bar</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormEntry type="text" name="companyName" label="Company Name" value={formData.companyName} handleChange={handleChange} />
                    <FormEntry type="text" name="companyNickname" label="Company Nickname" value={formData.companyNickname} handleChange={handleChange} />
                    <FormEntry type="email" name="email" label="Email" value={formData.email} handleChange={handleChange} />
                    <FormEntry type="password" name="password" label="Password" value={formData.password} handleChange={handleChange} />

                    <div>
                        <label className="block text-gray-700">Country</label>
                        <CountryDropdown
                            classes="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                            value={formData.country}
                            onChange={(val: string) => setFormData((prev) => ({ ...prev, country: val }))}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Region</label>
                        <RegionDropdown
                            country={formData.country}
                            classes="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                            value={formData.region}
                            onChange={(val: string) => setFormData((prev) => ({ ...prev, region: val }))}
                        />
                    </div>

                    <FormEntry type="text" name="city" label="City" value={formData.city} handleChange={handleChange} />
                    <FormEntry type="text" name="postalCode" label="Postal Code" value={formData.postalCode} handleChange={handleChange} pattern="[0-9]{5}" />
                    <FormEntry type="text" name="address" label="Address" value={formData.address} handleChange={handleChange} />
                    <FormEntry type="time" name="openTime" label="Open Time" value={formData.openTime} handleChange={handleChange} />
                    <FormEntry type="time" name="closeTime" label="Close Time" value={formData.closeTime} handleChange={handleChange} />

                    {/* Logo upload */}
                    <div>
                        <label className="block text-gray-700">Logo Image</label>
                        <input type="file" accept="image/*" onChange={handleLogoChange}
                               className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300" required />
                    </div>

                    {/* Store image upload (optional) */}
                    <div>
                        <label className="block text-gray-700">Store Image (optional)</label>
                        <input type="file" accept="image/*" onChange={handleStoreChange}
                               className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300" />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
