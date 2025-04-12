"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "https://www.barzzy.site"; // Used only for fetching summary numbers

// ---- Interfaces ----
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
    customer: string;
    timestamp: string;
    totalPointPrice: number;
    totalRegularPrice: number;
    tip: number;
    status: string;
    pointOfSale: boolean;
    drinks: string;
}

// ---- Hard-coded Data ----

// Hard-code 30 sample orders for "2025-04-04" with timestamps between 20:05 and 23:59
// Hard-code 30 sample orders for "2025-04-04" with timestamps between 20:05 and 23:59
const HARDCODED_ORDERS = [
    {
        orderId: 1074,
        barId: 55,
        customer: "Alex Micheo",
        timestamp: "2025-04-04T20:05:00",
        totalPointPrice: 0,
        totalRegularPrice: 10.71,  // base + 5% tax
        tip: 2.14,                 // 20% of 10.71
        status: "Completed",
        pointOfSale: false,
        drinks: "Vodka Shot"
    },
    {
        orderId: 1075,
        barId: 55,
        customer: "Mathias yohannes",
        timestamp: "2025-04-04T20:06:00",
        totalPointPrice: 0,
        totalRegularPrice: 15.75,
        tip: 3.15,
        status: "Completed",
        pointOfSale: true,
        drinks: "Vodka Shot, Tequila Shot"
    },
    {
        orderId: 1076,
        barId: 55,
        customer: "Masen Price",
        timestamp: "2025-04-04T20:24:00",
        totalPointPrice: 0,
        totalRegularPrice: 9.45,
        tip: 1.89,
        status: "Completed",
        pointOfSale: false,
        drinks: "Tequila Soda"
    },
    {
        orderId: 1077,
        barId: 55,
        customer: "Savana McLaughlin",
        timestamp: "2025-04-04T20:41:00",
        totalPointPrice: 0,
        totalRegularPrice: 11.55,
        tip: 2.31,
        status: "Completed",
        pointOfSale: false,
        drinks: "Vodka Red Bull"
    },
    {
        orderId: 1078,
        barId: 55,
        customer: "brandon Barenz",
        timestamp: "2025-04-04T20:51:00",
        totalPointPrice: 0,
        totalRegularPrice: 5.25,
        tip: 1.05,
        status: "Completed",
        pointOfSale: false,
        drinks: "Rum Shot"
    },
    {
        orderId: 1079,
        barId: 55,
        customer: "alex hetzel",
        timestamp: "2025-04-04T21:00:00",
        totalPointPrice: 0,
        totalRegularPrice: 12.60,
        tip: 2.52,
        status: "Completed",
        pointOfSale: true,
        drinks: "Vodka Sprite"
    },
    {
        orderId: 1080,
        barId: 55,
        customer: "Rohan Chodapunedi",
        timestamp: "2025-04-04T21:22:00",
        totalPointPrice: 0,
        totalRegularPrice: 5.46,
        tip: 1.09,
        status: "Completed",
        pointOfSale: false,
        drinks: "Tequila Shot"
    },
    {
        orderId: 1081,
        barId: 55,
        customer: "ani china",
        timestamp: "2025-04-04T21:31:00",
        totalPointPrice: 0,
        totalRegularPrice: 20.16,
        tip: 4.03,
        status: "Completed",
        pointOfSale: false,
        drinks: "Vodka Red Bull, Tequila Soda"
    },
    {
        orderId: 1082,
        barId: 55,
        customer: "Kshitij sharma",
        timestamp: "2025-04-04T21:40:00",
        totalPointPrice: 0,
        totalRegularPrice: 9.03,
        tip: 1.81,
        status: "Completed",
        pointOfSale: true,
        drinks: "Vodka Coke"
    },
    {
        orderId: 1083,
        barId: 55,
        customer: "Riya Gunda",
        timestamp: "2025-04-04T21:43:00",
        totalPointPrice: 0,
        totalRegularPrice: 12.39,
        tip: 2.48,
        status: "Completed",
        pointOfSale: false,
        drinks: "Lemon Drop"
    },
    {
        orderId: 1084,
        barId: 55,
        customer: "Sarah Hernandez",
        timestamp: "2025-04-04T21:57:00",
        totalPointPrice: 0,
        totalRegularPrice: 5.04,
        tip: 1.01,
        status: "Completed",
        pointOfSale: false,
        drinks: "Rum Shot"
    },
    {
        orderId: 1085,
        barId: 55,
        customer: "bill nicoue",
        timestamp: "2025-04-04T22:05:00",
        totalPointPrice: 0,
        totalRegularPrice: 19.11,
        tip: 3.82,
        status: "Completed",
        pointOfSale: true,
        drinks: "Vodka Sprite, Tequila Soda"
    },
    {
        orderId: 1086,
        barId: 55,
        customer: "Sarthak Shrivastava",
        timestamp: "2025-04-04T22:07:00",
        totalPointPrice: 0,
        totalRegularPrice: 5.46,
        tip: 1.09,
        status: "Completed",
        pointOfSale: false,
        drinks: "Vodka Shot"
    },
    {
        orderId: 1087,
        barId: 55,
        customer: "arav tripathi",
        timestamp: "2025-04-04T22:19:00",
        totalPointPrice: 0,
        totalRegularPrice: 22.05,
        tip: 4.41,
        status: "Completed",
        pointOfSale: false,
        drinks: "Tequila Shot, Vodka Red Bull"
    },
    {
        orderId: 1088,
        barId: 55,
        customer: "jake thomas",
        timestamp: "2025-04-04T22:22:00",
        totalPointPrice: 0,
        totalRegularPrice: 9.66,
        tip: 1.93,
        status: "Completed",
        pointOfSale: true,
        drinks: "Vodka Coke"
    },
    {
        orderId: 1089,
        barId: 55,
        customer: "Wyatt Smith",
        timestamp: "2025-04-04T22:28:00",
        totalPointPrice: 0,
        totalRegularPrice: 11.97,
        tip: 2.39,
        status: "Completed",
        pointOfSale: false,
        drinks: "Lemon Drop"
    },
    {
        orderId: 1090,
        barId: 55,
        customer: "Gavin Byrnes",
        timestamp: "2025-04-04T22:28:00",
        totalPointPrice: 0,
        totalRegularPrice: 15.75,
        tip: 3.15,
        status: "Completed",
        pointOfSale: false,
        drinks: "Rum Shot, Vodka Red Bull"
    },
    {
        orderId: 1091,
        barId: 55,
        customer: "esteban Herdocia",
        timestamp: "2025-04-04T22:33:00",
        totalPointPrice: 0,
        totalRegularPrice: 12.81,
        tip: 2.56,
        status: "Completed",
        pointOfSale: true,
        drinks: "Vodka Sprite"
    },
    {
        orderId: 1092,
        barId: 55,
        customer: "Jonathan Michael",
        timestamp: "2025-04-04T22:40:00",
        totalPointPrice: 0,
        totalRegularPrice: 9.45,
        tip: 1.89,
        status: "Completed",
        pointOfSale: false,
        drinks: "Tequila Soda"
    },
    {
        orderId: 1093,
        barId: 55,
        customer: "Caleb Gumpf",
        timestamp: "2025-04-04T22:47:00",
        totalPointPrice: 0,
        totalRegularPrice: 10.92,
        tip: 2.18,
        status: "Completed",
        pointOfSale: false,
        drinks: "Vodka Red Bull"
    },
    {
        orderId: 1094,
        barId: 55,
        customer: "Amanuel Sisay",
        timestamp: "2025-04-04T22:51:00",
        totalPointPrice: 0,
        totalRegularPrice: 5.67,
        tip: 1.13,
        status: "Completed",
        pointOfSale: false,
        drinks: "Vodka Shot"
    },
    {
        orderId: 1095,
        barId: 55,
        customer: "ayman adam",
        timestamp: "2025-04-04T22:53:00",
        totalPointPrice: 0,
        totalRegularPrice: 15.75,
        tip: 3.15,
        status: "Completed",
        pointOfSale: true,
        drinks: "Vodka Shot, Tequila Shot"
    },
    {
        orderId: 1096,
        barId: 55,
        customer: "Nathan Tieu",
        timestamp: "2025-04-04T22:57:00",
        totalPointPrice: 0,
        totalRegularPrice: 15.54,
        tip: 3.11,
        status: "Completed",
        pointOfSale: false,
        drinks: "Tequila Soda, Rum Shot"
    },
    {
        orderId: 1097,
        barId: 55,
        customer: "Malia Bullen",
        timestamp: "2025-04-04T23:15:00",
        totalPointPrice: 0,
        totalRegularPrice: 13.65,
        tip: 2.73,
        status: "Completed",
        pointOfSale: false,
        drinks: "Vodka Sprite"
    },
    {
        orderId: 1098,
        barId: 55,
        customer: "Nicholas Creamer",
        timestamp: "2025-04-04T23:22:00",
        totalPointPrice: 0,
        totalRegularPrice: 10.29,
        tip: 2.06,
        status: "Completed",
        pointOfSale: true,
        drinks: "Lemon Drop"
    },
    {
        orderId: 1099,
        barId: 55,
        customer: "Connor Fabrie",
        timestamp: "2025-04-04T23:35:00",
        totalPointPrice: 0,
        totalRegularPrice: 21.00,
        tip: 4.20,
        status: "Completed",
        pointOfSale: false,
        drinks: "Vodka Red Bull, Vodka Coke"
    },
    {
        orderId: 1100,
        barId: 55,
        customer: "carleigh brescia",
        timestamp: "2025-04-04T23:44:00",
        totalPointPrice: 0,
        totalRegularPrice: 5.25,
        tip: 1.05,
        status: "Completed",
        pointOfSale: false,
        drinks: "Tequila Shot"
    },
    {
        orderId: 1101,
        barId: 55,
        customer: "Eliana Tamrat",
        timestamp: "2025-04-04T23:51:00",
        totalPointPrice: 0,
        totalRegularPrice: 10.29,
        tip: 2.06,
        status: "Completed",
        pointOfSale: true,
        drinks: "Rum Shot, Vodka Shot"
    },
    {
        orderId: 1102,
        barId: 55,
        customer: "Dj chavis",
        timestamp: "2025-04-04T23:55:00",
        totalPointPrice: 0,
        totalRegularPrice: 5.25,
        tip: 1.05,
        status: "Completed",
        pointOfSale: false,
        drinks: "Vodka Shot"
    },
    {
        orderId: 1103,
        barId: 55,
        customer: "Caroline Thornburg",
        timestamp: "2025-04-04T23:59:00",
        totalPointPrice: 0,
        totalRegularPrice: 17.85,
        tip: 3.57,
        status: "Completed",
        pointOfSale: true,
        drinks: "Vodka Red Bull, Tequila Shot"
    }
];




// Hard-coded top 5 items sold
const HARDCODED_TOP5: Record<string, number> = {
    "Vodka Shot": 334,
    "Tequila Shot": 179,
    "Vodka Coke": 98,
    "Lemon Drop": 74,
    "Trash Can": 51,
};

export default function AnalyticsPage() {
    // State for summary cards (fetched from backend)
    const [generalData, setGeneralData] = useState<GeneralData | null>(null);
    // Hard-coded orders by day
    const [ordersByDay, setOrdersByDay] = useState<Order[]>([]);
    // Error state
    const [error, setError] = useState<string>("");

    // Grab credentials for the summary fetch
    const barEmail = typeof window !== "undefined" ? localStorage.getItem("barEmail") ?? "" : "";
    const barPW = typeof window !== "undefined" ? localStorage.getItem("barPW") ?? "" : "";

    // Hard-code the dayFilter to "2025-04-04"
    const [dayFilter, setDayFilter] = useState<string>("yyyy-mm-dd");

    // Fetch general data (for summary cards)
    useEffect(() => {
        if (!barEmail || !barPW) {
            setError("Missing credentials. Please log in again.");
            return;
        }
        const fetchGeneralData = async () => {
            try {
                const url = `${BASE_URL}/orders/generalData?barEmail=${encodeURIComponent(barEmail)}&barPW=${encodeURIComponent(barPW)}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch general data");
                const data = await res.json();
                setGeneralData(data);
            } catch (err: any) {
                setError("Error: " + err.message);
            }
        };
        fetchGeneralData();
    }, [barEmail, barPW]);

    // "Filter Orders by Day" simply sets ordersByDay to our hard-coded sample orders
    const handleFilterByDay = () => {
        setOrdersByDay(HARDCODED_ORDERS);
    };

    return (
        <div className="min-h-screen bg-white text-black py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Analytics Dashboard</h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            {generalData && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 max-w-5xl mx-auto">
                    <Card title="Revenue ($)" value={`$${generalData.revenue.toFixed(2)}`} />
                    <Card title="Revenue (pts)" value={`${generalData.points} pts`} />
                    <Card title="Units Sold ($)" value={`${generalData.drinks}`} />
                    <Card title="Units Sold (pts)" value={`${generalData.drinksPoints}`} />
                    <Card title="Tips" value={`$${generalData.tips.toFixed(2)}`} />
                </div>
            )}

            {/* Filter Orders by Day (Hard-coded) */}
            <div className="bg-white shadow p-6 rounded mb-8 max-w-3xl mx-auto border border-gray-300">
                <h2 className="text-xl font-bold mb-4">Filter Orders by Day</h2>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                    <div>
                        <label className="block text-gray-700">Select Date</label>
                        <input
                            type="date"
                            className="mt-1 p-2 border border-gray-300 rounded w-48 bg-white text-black"
                            value={dayFilter}
                            onChange={(e) => setDayFilter(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleFilterByDay}
                        className="bg-black text-white px-4 py-2 rounded mt-4 md:mt-6 border border-gray-300"
                    >
                        Filter Orders by Day
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            {ordersByDay.length > 0 && <OrdersTable title="Orders (By Day)" orders={ordersByDay} />}

            {/* Top 5 Items Sold */}
            <div className="bg-white shadow p-6 rounded mb-8 max-w-3xl mx-auto border border-gray-300">
                <h2 className="text-3xl font-black mb-4 text-center">Top 5 Items Sold</h2>
                <div className="space-y-2">
                    {Object.entries(HARDCODED_TOP5).map(([name, qty]) => (
                        <div key={name} className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-semibold text-lg">{name}</span>
                            <span className="text-lg">{qty}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Reusable Card Component
const Card = ({ title, value }: { title: string; value: string }) => (
    <div className="bg-white shadow p-4 rounded border border-gray-300">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-2xl">{value}</p>
    </div>
);

// Reusable OrdersTable Component
function OrdersTable({ title, orders }: { title: string; orders: Order[] }) {
    return (
        <div className="max-w-5xl mx-auto bg-white shadow p-6 rounded overflow-x-auto border border-gray-300 mb-8">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-200">
                <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Customer</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Drinks</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Timestamp</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Total Price</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Tip</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                {orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-100">
                        <td className="px-4 py-2">{order.orderId}</td>
                        <td className="px-4 py-2">{order.customer}</td>
                        <td className="px-4 py-2">{order.drinks}</td>
                        <td className="px-4 py-2">
                            {new Date(order.timestamp).toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short",
                            })}
                        </td>
                        <td className="px-4 py-2">${order.totalRegularPrice.toFixed(2)}</td>
                        <td className="px-4 py-2">${order.tip.toFixed(2)}</td>
                        <td className="px-4 py-2">{order.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}