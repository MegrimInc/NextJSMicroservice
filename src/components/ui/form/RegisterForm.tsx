"use client";

import React, { useState } from "react";
import FormEntry from "./FormEntry";
import {CountryDropdown, RegionDropdown} from "react-country-region-selector";

export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        companyName: "",
        companyNickname: "",
        country: "",
        region: "",
        city: "",
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
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData + "add logic here!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
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
                    <FormEntry
                        type="text"
                        name="address"
                        label="Address"
                        value={formData.address}
                        handleChange={handleChange}
                    />
                    <FormEntry
                        type="text"
                        name="city"
                        label="City"
                        value={formData.city}
                        handleChange={handleChange}
                    />
                    <div>
                        <label className="block text-gray-700">Country</label>
                        <CountryDropdown
                            classes="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                            value={country}
                            onChange={(val: React.SetStateAction<string>) => setCountry(val)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Region</label>
                        <RegionDropdown
                            country={country}
                            classes="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                            value={region}
                            onChange={(val: React.SetStateAction<string>) => setRegion(val)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
