"use client";

import React, { useEffect, useState } from "react";

// If you prefer to keep constants in a separate file, that's fine
const BASE_URL = "https://www.barzzy.site"; // Adjust if needed

interface GeneralData {
    revenue: number;
    drinks: number;
    tips: number;
    drinksPoints: number;
    points: number;
}

interface Order {
    orderId: number;
    barId: number;
    userId: number;
    timestamp: string; // or a date in your JSON
    totalPointPrice: number;
    totalRegularPrice: number;
    tip: number;
    status: string;
    pointOfSale: boolean;
    // etc. (match your actual structure)
}

export default function AnalyticsPage() {
    // --- State ---
    const [generalData, setGeneralData] = useState<GeneralData | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [error, setError] = useState<string>("");

    // Grab barEmail/barPW from localStorage
    // Make sure at login time you do:
    //   localStorage.setItem("barEmail", email);
    //   localStorage.setItem("barPW", password);
    const barEmail =
        typeof window !== "undefined" ? localStorage.getItem("barEmail") : null;
    const barPW =
        typeof window !== "undefined" ? localStorage.getItem("barPW") : null;

    // --- 1. Fetch the general data on first render ---
    useEffect(() => {
        if (!barEmail || !barPW) {
            setError("No barEmail/barPW found in localStorage. Please log in again.");
            return;
        }

        async function fetchGeneralData() {
            try {
                const barEmail = localStorage.getItem("barEmail") ?? "";
                const barPW = localStorage.getItem("barPW") ?? "";

// Now both are guaranteed strings (could be empty "")
                const url = `${BASE_URL}/orders/generalData?barEmail=${encodeURIComponent(barEmail)}&barPW=${encodeURIComponent(barPW)}`;


                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch general data");
                }

                const json = await response.json();
                setGeneralData(json); // {revenue, drinks, tips, drinksPoints, points}
            } catch (err: any) {
                setError(err.message);
            }
        }

        fetchGeneralData();
    }, [barEmail, barPW]);

    // --- 2. Fetch orders by date range ---
    const handleFilterOrders = async () => {
        if (!barEmail || !barPW) {
            setError("No barEmail/barPW found. Please log in again.");
            return;
        }

        // Convert selected date strings to epoch millis
        // e.g. if startDate = '2025-01-01' => new Date('2025-01-01').getTime()
        const startMillis = new Date(startDate).getTime();
        const endMillis = new Date(endDate).getTime();

        if (isNaN(startMillis) || isNaN(endMillis)) {
            setError("Please provide valid start/end dates.");
            return;
        }
        setError("");

        try {
            const url = `${BASE_URL}/orders/contributionByDateRange?barEmail=${encodeURIComponent(
                barEmail
            )}&barPW=${encodeURIComponent(
                barPW
            )}&start=${startMillis}&end=${endMillis}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch orders by date range");
            }

            const data = await response.json();
            // data format: { "orders": [ order1, order2, … orderN ] }
            if (!data.orders) {
                setError("No orders field in response.");
                return;
            }
            setOrders(data.orders);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
                Analytics Dashboard
            </h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                </div>
            )}

            {/* Summary Cards */}
            {generalData && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 max-w-5xl mx-auto">
                    <div className="bg-white shadow p-4 rounded">
                        <h2 className="font-semibold">Revenue</h2>
                        <p className="text-2xl text-green-600">
                            ${generalData.revenue.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white shadow p-4 rounded">
                        <h2 className="font-semibold">Drinks Sold</h2>
                        <p className="text-2xl text-purple-600">{generalData.drinks}</p>
                    </div>
                    <div className="bg-white shadow p-4 rounded">
                        <h2 className="font-semibold">Tips</h2>
                        <p className="text-2xl text-yellow-600">
                            ${generalData.tips.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white shadow p-4 rounded">
                        <h2 className="font-semibold">Drinks w/Points</h2>
                        <p className="text-2xl text-blue-600">{generalData.drinksPoints}</p>
                    </div>
                    <div className="bg-white shadow p-4 rounded">
                        <h2 className="font-semibold">Points Spent</h2>
                        <p className="text-2xl text-red-600">{generalData.points}</p>
                    </div>
                </div>
            )}

            {/* Date Range Filter */}
            <div className="bg-white shadow p-6 rounded mb-8 max-w-3xl mx-auto">
                <h2 className="text-xl font-bold mb-4">Filter Orders by Date Range</h2>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                    <div>
                        <label className="block text-gray-700">Start Date</label>
                        <input
                            type="date"
                            className="mt-1 p-2 border rounded w-48"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">End Date</label>
                        <input
                            type="date"
                            className="mt-1 p-2 border rounded w-48"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleFilterOrders}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 md:mt-6"
                    >
                        Filter Orders
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="max-w-5xl mx-auto bg-white shadow p-6 rounded overflow-x-auto">
                <h2 className="text-xl font-bold mb-4">Orders</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600">
                    <tr>
                        <th className="px-4 py-2 text-left text-white text-sm font-semibold">
                            Order ID
                        </th>
                        <th className="px-4 py-2 text-left text-white text-sm font-semibold">
                            Timestamp
                        </th>
                        <th className="px-4 py-2 text-left text-white text-sm font-semibold">
                            Total Price
                        </th>
                        <th className="px-4 py-2 text-left text-white text-sm font-semibold">
                            Tip
                        </th>
                        <th className="px-4 py-2 text-left text-white text-sm font-semibold">
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-gray-700">{order.orderId}</td>
                            <td className="px-4 py-2 text-gray-700">
                                {order.timestamp
                                    ? new Date(order.timestamp).toLocaleString()
                                    : "--"}
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                                ${order.totalRegularPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                                ${order.tip.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-gray-700">{order.status}</td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-4 text-center text-gray-500 italic"
                            >
                                No orders found for this date range
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
