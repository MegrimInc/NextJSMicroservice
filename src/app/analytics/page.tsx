"use client";

import React, { useEffect, useState } from "react";

// Adjust this to your actual domain or HTTP if not using SSL
const BASE_URL = "https://www.barzzy.site";

// --- Interfaces ---
interface GeneralData {
    revenue: number;
    drinks: number;
    tips: number;
    drinksPoints: number;
    points: number;
}

interface DrinkCount {
    drinkId: number;
    drinkName: string;
    doublePrice: number;
    soldWithDollars: number;
    soldWithPoints: number;
    totalSold: number;
}

interface Order {
    orderId: number;
    barId: number;
    userId: number;
    timestamp: string;
    totalPointPrice: number;
    totalRegularPrice: number;
    tip: number;
    inAppPayments: boolean;
    status: string;
    station: string;
    tipsClaimed: string;
    pointOfSale: boolean;
    // add more fields as needed
}

export default function AnalyticsPage() {
    const [generalData, setGeneralData] = useState<GeneralData | null>(null);

    // For top-selling items
    const [drinkCounts, setDrinkCounts] = useState<DrinkCount[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(10);

    // For orders by single day
    const [ordersByDay, setOrdersByDay] = useState<Order[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>(""); // e.g. "2025-04-14"

    // For date/time range on general data
    const [startDateTime, setStartDateTime] = useState<string>(""); // user picks a local date/time
    const [endDateTime, setEndDateTime] = useState<string>("");

    // For errors
    const [error, setError] = useState<string>("");

    // Credentials from localStorage
    const barEmail =
        typeof window !== "undefined" ? localStorage.getItem("barEmail") ?? "" : "";
    const barPW =
        typeof window !== "undefined" ? localStorage.getItem("barPW") ?? "" : "";

    // 1) Fetch general data with optional time range
    useEffect(() => {
        if (!barEmail || !barPW) {
            setError("Missing credentials. Please log in again.");
            return;
        }

        const fetchGeneralData = async () => {
            try {
                // Build the URL for generalData with optional start/end times
                let url = `${BASE_URL}/orders/generalData?barEmail=${encodeURIComponent(
                    barEmail
                )}&barPW=${encodeURIComponent(barPW)}`;

                // If user specified a start datetime, parse to epoch
                if (startDateTime) {
                    const startEpoch = new Date(startDateTime).getTime();
                    url += `&start=${startEpoch}`;
                }
                // If user specified an end datetime, parse to epoch
                if (endDateTime) {
                    const endEpoch = new Date(endDateTime).getTime();
                    url += `&end=${endEpoch}`;
                }

                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch general data");
                const data = await res.json();
                setGeneralData(data);
            } catch (err: any) {
                setError("Error: " + err.message);
            }
        };

        fetchGeneralData();
    }, [barEmail, barPW, startDateTime, endDateTime]);

    // 2) Fetch top selling items (allDrinkCounts)
    useEffect(() => {
        if (!barEmail || !barPW) return;

        const fetchDrinkCounts = async () => {
            try {
                const url = `${BASE_URL}/orders/allDrinkCounts?barEmail=${encodeURIComponent(
                    barEmail
                )}&barPW=${encodeURIComponent(barPW)}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch drink counts");
                const json = await res.json();
                setDrinkCounts(json.data || []);
            } catch (err: any) {
                console.error("Error fetching drink counts:", err);
            }
        };
        fetchDrinkCounts();
    }, [barEmail, barPW]);

    // 3) Orders by Day (single date)
    const searchOrdersByDay = async () => {
        if (!barEmail || !barPW || !selectedDay) {
            return;
        }
        try {
            const url = `${BASE_URL}/orders/byDay?barEmail=${encodeURIComponent(
                barEmail
            )}&barPW=${encodeURIComponent(barPW)}&date=${encodeURIComponent(
                selectedDay
            )}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch orders for the day");
            const json = await res.json();
            setOrdersByDay(json.orders || []);
        } catch (err: any) {
            console.error("Error fetching orders by day:", err);
        }
    };

    // Expandable table controls
    const showAll = () => setVisibleCount(drinkCounts.length);
    const showLess = () => setVisibleCount(10);
    const showMore = () => setVisibleCount((prev) => prev + 10);
    const isAllVisible = visibleCount >= drinkCounts.length;

    return (
        <div className="min-h-screen bg-gray-100 text-black py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-5xl font-extrabold">Analytics Dashboard</h1>
                </header>

                {error && (
                    <div className="bg-red-200 border-l-4 border-red-600 text-red-900 p-4 mb-6 rounded">
                        {error}
                    </div>
                )}

                {/* --- TIME RANGE FILTER for General Data --- */}
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 justify-center">
                    <div>
                        <label className="text-sm font-semibold">Start Date/Time</label>
                        <input
                            type="datetime-local"
                            className="block p-2 border rounded"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">End Date/Time</label>
                        <input
                            type="datetime-local"
                            className="block p-2 border rounded"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- General Data Summary Cards --- */}
                {generalData && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        <Card title="Revenue ($)" value={`$${generalData.revenue.toFixed(2)}`} />
                        <Card title="Revenue (pts)" value={`${generalData.points} pts`} />
                        <Card title="Units Sold ($)" value={`${generalData.drinks}`} />
                        <Card title="Units Sold (pts)" value={`${generalData.drinksPoints}`} />
                        <Card title="Tips" value={`$${generalData.tips.toFixed(2)}`} />
                    </div>
                )}

                {/* --- Top Selling Items (allDrinkCounts) --- */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="bg-gray-200 p-6">
                        <h2 className="text-3xl font-bold text-center">Top Selling Items</h2>
                    </div>
                    <div className="p-6">
                        {drinkCounts.length > 0 ? (
                            <>
                                <table className="min-w-full divide-y divide-gray-300 font-sans">
                                    <thead className="bg-gray-300">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">
                                            Item Name
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">
                                            $Price
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold font-bold">
                                            Total Sold
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">
                                            Sold with $
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">
                                            Sold with Points
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300">
                                    {drinkCounts.slice(0, visibleCount).map((drink) => (
                                        <tr key={drink.drinkId} className="hover:bg-gray-100">
                                            <td className="px-4 py-2">{drink.drinkName}</td>
                                            <td className="px-4 py-2">
                                                ${drink.doublePrice.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 font-bold text-lg">
                                                {drink.totalSold}
                                            </td>
                                            <td className="px-4 py-2">{drink.soldWithDollars}</td>
                                            <td className="px-4 py-2">{drink.soldWithPoints}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div className="mt-4 flex justify-center space-x-4">
                                    {!isAllVisible && (
                                        <>
                                            <button
                                                onClick={showMore}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                            >
                                                Show More
                                            </button>
                                            <button
                                                onClick={showAll}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                            >
                                                Show All
                                            </button>
                                        </>
                                    )}
                                    {visibleCount > 10 && (
                                        <button
                                            onClick={showLess}
                                            className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500 transition"
                                        >
                                            Show Less
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-600">No items found.</p>
                        )}
                    </div>
                </div>

                {/* --- Orders by Single Day (byDay) --- */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="bg-gray-200 p-6">
                        <h2 className="text-3xl font-bold text-center">Orders by Day</h2>
                    </div>
                    <div className="p-6">
                        {/* Single-day Date Picker */}
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                            <label
                                htmlFor="orderDate"
                                className="text-lg font-semibold mb-2 md:mb-0"
                            >
                                Select Date (yyyy-mm-dd):
                            </label>
                            <input
                                type="date"
                                id="orderDate"
                                className="border border-gray-400 p-2 rounded text-black"
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                            />
                            <button
                                onClick={searchOrdersByDay}
                                className="mt-2 md:mt-0 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                            >
                                Search Orders
                            </button>
                        </div>

                        {/* Orders Table */}
                        {ordersByDay.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-300 font-sans">
                                <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">
                                        Order ID
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">
                                        Timestamp
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">
                                        Total ($)
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">
                                        Tip ($)
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                {ordersByDay.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-gray-100">
                                        <td className="px-4 py-2">{order.orderId}</td>
                                        <td className="px-4 py-2">
                                            {new Date(order.timestamp).toLocaleString("en-US", {
                                                dateStyle: "short",
                                                timeStyle: "short",
                                                timeZone: "America/New_York",
                                            })}
                                        </td>
                                        <td className="px-4 py-2">
                                            ${order.totalRegularPrice.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2">${order.tip.toFixed(2)}</td>
                                        <td className="px-4 py-2">{order.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-600">
                                No orders found for this day.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Card component
const Card = ({ title, value }: { title: string; value: string }) => (
    <div className="bg-white bg-opacity-90 shadow-lg rounded p-4 text-gray-900">
        <h2 className="font-bold text-xl">{title}</h2>
        <p className="text-3xl">{value}</p>
    </div>
);
