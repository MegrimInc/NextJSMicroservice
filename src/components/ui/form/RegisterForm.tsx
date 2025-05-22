"use client";

import React, { useState } from "react";
import FormEntry from "./FormEntry";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useRouter } from "next/navigation";
import { AppConfig } from "@/lib/api/config";

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
        confirmPassword: ""
    });

    const [verificationCode, setVerificationCode] = useState("");
    const [showCodeField, setShowCodeField] = useState(false);
    const [logoImage, setLogoImage] = useState<File | null>(null);
    const [storeImage, setStoreImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setLogoImage(e.target.files[0]);
    };

    const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setStoreImage(e.target.files[0]);
    };

    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!logoImage) return setError("Logo image is required.");
        if (formData.password !== formData.confirmPassword)
            return setError("Passwords do not match.");

        // Basic empty validation
        for (const key in formData) {
            if (!formData[key as keyof typeof formData])
                return setError("All fields are required.");
        }

        // Phase 1: send email as URL-encoded
        const response = await fetch(`${AppConfig.postgresHttpBaseUrl}/auth/register-merchant`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            credentials: "include",
            body: new URLSearchParams({ email: formData.email }).toString()
        });

        if (!response.ok) {
            const msg = await response.text();
            return setError(msg);
        }

        setShowCodeField(true);
    };
    
    

    const handleVerification = async () => {
        setError(null);

        const finalData = new FormData();
        finalData.append("info", new Blob([JSON.stringify({
            companyName: formData.companyName,
            companyNickname: formData.companyNickname,
            city: formData.city,
            stateOrProvince: formData.region,
            address: formData.address,
            country: formData.country,
            zipCode: formData.postalCode,
            email: formData.email,
            password: formData.password,
            verificationCode: verificationCode
        })], { type: "application/json" }));

        finalData.append("logoImage", logoImage!);
        if (storeImage) finalData.append("storeImage", storeImage);

        const verifyRes = await fetch(`${AppConfig.postgresHttpBaseUrl}/auth/verify-merchant`, {
            method: "POST",
            body: finalData,
            credentials: "include",
        });

        if (!verifyRes.ok) {
            const msg = await verifyRes.text();
            return setError(msg);
        }
        
        window.dispatchEvent(new Event("loginStatusChanged"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Register Your Bar</h2>
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormEntry type="text" name="companyName" label="Company Name" value={formData.companyName} handleChange={handleChange} />
                    <FormEntry type="text" name="companyNickname" label="Company Nickname" value={formData.companyNickname} handleChange={handleChange} />
                    <FormEntry type="email" name="email" label="Email" value={formData.email} handleChange={handleChange} />
                    <FormEntry type="password" name="password" label="Password" value={formData.password} handleChange={handleChange} />
                    <FormEntry type="password" name="confirmPassword" label="Confirm Password" value={formData.confirmPassword} handleChange={handleChange} />

                    <label className="block text-gray-700">Country</label>
                    <CountryDropdown
                        classes="w-full px-3 py-2 mt-1 border rounded-md"
                        value={formData.country}
                        onChange={(val: string) => setFormData((prev) => ({ ...prev, country: val }))}
                    />

                    <label className="block text-gray-700">Region</label>
                    <RegionDropdown
                        country={formData.country}
                        classes="w-full px-3 py-2 mt-1 border rounded-md"
                        value={formData.region}
                        onChange={(val: string) => setFormData((prev) => ({ ...prev, region: val }))}
                    />

                    <FormEntry type="text" name="city" label="City" value={formData.city} handleChange={handleChange} />
                    <FormEntry type="text" name="postalCode" label="Postal Code" value={formData.postalCode} handleChange={handleChange} />
                    <FormEntry type="text" name="address" label="Address" value={formData.address} handleChange={handleChange} />

                    <div>
                        <label className="block text-gray-700">Logo Image</label>
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Store Image (optional)</label>
                        <input type="file" accept="image/*" onChange={handleStoreChange} className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>

                    {!showCodeField ? (
                        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded-md w-full hover:bg-blue-600">
                            Send Verification Code
                        </button>
                    ) : (
                        <>
                            <FormEntry type="text" name="verificationCode" label="Verification Code" value={verificationCode} handleChange={(e) => setVerificationCode(e.target.value)} />
                            <button type="button" onClick={handleVerification} className="mt-4 p-2 bg-green-500 text-white rounded-md w-full hover:bg-green-600">
                                Verify & Complete Registration
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
