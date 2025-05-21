"use client";

import { useEffect, useState } from "react";
import { AppConfig } from "@/lib/api/config";

const API = `${AppConfig.postgresHttpBaseUrl}/merchant`;

interface Category {
    categoryId: number;
    name: string;
}

export default function ConfigurationsPage() {
    const [inputs, setInputs] = useState<string[]>(Array(10).fill(""));
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    useEffect(() => {
        fetch(`${API}/configurations/categories`, { credentials: "include" })
            .then((res) => {
                if (res.status === 401) throw new Error("Unauthorized");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data.categories)) {
                    setCategories(data.categories);
                    const names = data.categories.map((c: Category) => c.name).slice(0, 10);
                    setInputs([...names, ...Array(10 - names.length).fill("")]);

                } else {
                    setError("Invalid category response format.");
                }
            })
            .catch((err) => setError(err.message));
    }, []);

    const handleInputChange = (index: number, value: string) => {
        setInputs((prev) => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    const handleSaveCategories = async () => {
        const parsed = inputs.map((s) => s.trim()).filter((s) => s.length > 0);

        if (parsed.length < 3 || parsed.length > 8) {
            setError("You must provide between 3 and 8 categories.");
            return;
        }

        try {
            const res = await fetch(`${API}/configurations/categories`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed),
            });

            if (!res.ok) throw new Error("Failed to save categories");

            const data = await res.json();
            const updated = data.categories as Category[];
            setCategories(updated);
            const updatedNames = updated.map((c) => c.name);
            setInputs([...updatedNames, ...Array(10 - updatedNames.length).fill("")]);
            setError("");
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="p-6 bg-white min-h-screen text-black">
            <h1 className="text-4xl font-bold mb-6 text-center">Configurations</h1>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-2">Item Categories</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Enter 3–8 category names. Leave others blank.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {inputs.map((val, idx) => (
                        <input
                            key={idx}
                            type="text"
                            className="border px-3 py-2 rounded"
                            placeholder={`Category ${idx + 1}`}
                            value={val}
                            onChange={(e) => handleInputChange(idx, e.target.value)}
                        />
                    ))}
                </div>

                <button
                    onClick={handleSaveCategories}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Categories
                </button>

                <ul className="list-disc pl-6 mt-4">
                    {categories.map((cat) => (
                        <li key={cat.categoryId}>
                            {cat.name} (ID: {cat.categoryId})
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-2">Discount Schedule</h2>
                <p className="text-sm text-gray-600 mb-4">This is not connected yet.</p>
                <div className="flex gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <input
                            type="time"
                            className="border px-3 py-2 rounded"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <input
                            type="time"
                            className="border px-3 py-2 rounded"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
