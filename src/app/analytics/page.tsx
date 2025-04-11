"use client";

import React, { useEffect, useState } from "react";

const BASE_URL = "https://www.barzzy.site";

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
    timestamp: string;
    totalPointPrice: number;
    totalRegularPrice: number;
    tip: number;
    status: string;
    pointOfSale: boolean;
}

export default function AnalyticsPage() {
    const [generalData, setGeneralData] = useState<GeneralData | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersByDay, setOrdersByDay] = useState<Order[]>([]);
    const [top5, setTop5] = useState<Record<string, number> | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [dayFilter, setDayFilter] = useState<string>("");
    const [error, setError] = useState<string>("");

    const barEmail = typeof window !== "undefined" ? localStorage.getItem("barEmail") ?? "" : "";
    const barPW = typeof window !== "undefined" ? localStorage.getItem("barPW") ?? "" : "";

    useEffect(() => {
        if (!barEmail || !barPW) {
            setError("Missing credentials. Please log in again.");
            return;
        }

        const fetchGeneralData = async () => {
            const url = `${BASE_URL}/orders/generalData?barEmail=${encodeURIComponent(barEmail)}&barPW=${encodeURIComponent(barPW)}`;
            try {
                const res = await fetch(url);
                console.log("GeneralData response status:", res.status);
                if (!res.ok) throw new Error("Failed to fetch general data");
                const data = await res.json();
                setGeneralData(data);
            } catch (err: any) {
                setError("Error: " + err.message);
                console.error("GeneralData fetch failed:", err);
            }
        };

        fetchGeneralData();
    }, [barEmail, barPW]);

    const handleFilterOrders = async () => {
        setError("");
        const startMillis = new Date(startDate).getTime();
        const endMillis = new Date(endDate).getTime();
        if (isNaN(startMillis) || isNaN(endMillis)) {
            setError("Invalid date range.");
            return;
        }
        try {
            const url = `${BASE_URL}/orders/contributionByDateRange?barEmail=${encodeURIComponent(barEmail)}&barPW=${encodeURIComponent(barPW)}&start=${startMillis}&end=${endMillis}`;
            const res = await fetch(url);
            console.log("contributionByDateRange status:", res.status);
            if (!res.ok) throw new Error("Failed to fetch range orders");
            const data = await res.json();
            if (!data.orders) {
                throw new Error("No 'orders' in response.");
            }
            setOrders(data.orders);
        } catch (err: any) {
            setError("Error: " + err.message);
            console.error("Date range fetch error:", err);
        }
    };

    const handleFilterByDay = async () => {
        setError("");
        if (!dayFilter) {
            setError("Select a day.");
            return;
        }
        try {
            const url = `${BASE_URL}/orders/byDay?barEmail=${encodeURIComponent(barEmail)}&barPW=${encodeURIComponent(barPW)}&date=${encodeURIComponent(dayFilter)}`;
            const res = await fetch(url);
            console.log("byDay status:", res.status);
            if (!res.ok) throw new Error("Failed to fetch daily orders");
            const data = await res.json();
            if (!data.orders) throw new Error("Missing 'orders' in daily result.");
            setOrdersByDay(data.orders);
        } catch (err: any) {
            setError("Error: " + err.message);
            console.error("ByDay fetch error:", err);
        }
    };

    const fetchTop5 = async () => {
        setError("");
        try {
            const url = `${BASE_URL}/orders/top5Drinks?barEmail=${encodeURIComponent(barEmail)}&barPW=${encodeURIComponent(barPW)}`;
            const res = await fetch(url);
            console.log("top5Drinks status:", res.status);
            if (!res.ok) throw new Error("Top 5 fetch failed");
            const data = await res.json();
            if (!data.data) throw new Error("No 'data' in Top 5 response.");
            setTop5(data.data);
        } catch (err: any) {
            setError("Error: " + err.message);
            console.error("Top5 fetch error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Analytics Dashboard</h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    {error}
                </div>
            )}

            {generalData && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 max-w-5xl mx-auto">
                    <Card title="Revenue ($)" value={`$${generalData.revenue.toFixed(2)}`} />
                    <Card title="Revenue (pts)" value={`${generalData.points} pts`} />
                    <Card title="Units Sold ($)" value={`${generalData.drinks}`} />
                    <Card title="Units Sold (pts)" value={`${generalData.drinksPoints}`} />
                    <Card title="Tips" value={`$${generalData.tips.toFixed(2)}`} />
                </div>
            )}

            {/* Date Filter */}
            <DateFilter
                title="Filter Orders by Date Range"
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
                onSubmit={handleFilterOrders}
            />

            {orders.length > 0 && <OrdersTable title="Orders (Date Range)" orders={orders} />}

            {/* By Day */}
            <DateFilter
                title="Filter Orders by Day"
                dayOnly
                startDate={dayFilter}
                onStartChange={setDayFilter}
                onSubmit={handleFilterByDay}
            />
            {ordersByDay.length > 0 && <OrdersTable title="Orders (By Day)" orders={ordersByDay} />}

            {/* Top 5 */}
            <div className="bg-white shadow p-6 rounded mb-8 max-w-3xl mx-auto border border-gray-300">
                <h2 className="text-xl font-bold mb-4">Top 5 Items Sold</h2>
                <button onClick={fetchTop5} className="bg-black text-white px-4 py-2 rounded mb-4 border border-gray-300">
                    Load Top 5 Items
                </button>
                {top5 && (
                    <div className="space-y-2">
                        {Object.entries(top5).map(([name, qty]) => (
                            <div key={name} className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-semibold">{name}</span>
                                <span>{qty}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Utility Components
const Card = ({ title, value }: { title: string; value: string }) => (
    <div className="bg-white shadow p-4 rounded border border-gray-300">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-2xl">{value}</p>
    </div>
);

const OrdersTable = ({ title, orders }: { title: string; orders: Order[] }) => (
    <div className="max-w-5xl mx-auto bg-white shadow p-6 rounded overflow-x-auto border border-gray-300 mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-200">
            <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Order ID</th>
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
                    <td className="px-4 py-2">{new Date(order.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2">${order.totalRegularPrice.toFixed(2)}</td>
                    <td className="px-4 py-2">${order.tip.toFixed(2)}</td>
                    <td className="px-4 py-2">{order.status}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

const DateFilter = ({
                        title,
                        startDate,
                        endDate,
                        onStartChange,
                        onEndChange,
                        onSubmit,
                        dayOnly = false,
                    }: {
    title: string;
    startDate: string;
    endDate?: string;
    onStartChange: (s: string) => void;
    onEndChange?: (s: string) => void;
    onSubmit: () => void;
    dayOnly?: boolean;
}) => (
    <div className="bg-white shadow p-6 rounded mb-8 max-w-3xl mx-auto border border-gray-300">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div>
                <label className="block text-gray-700">{dayOnly ? "Date" : "Start Date"}</label>
                <input
                    type="date"
                    className="mt-1 p-2 border border-gray-300 rounded w-48 bg-white text-black"
                    value={startDate}
                    onChange={(e) => onStartChange(e.target.value)}
                />
            </div>
            {!dayOnly && endDate && onEndChange && (
                <div>
                    <label className="block text-gray-700">End Date</label>
                    <input
                        type="date"
                        className="mt-1 p-2 border border-gray-300 rounded w-48 bg-white text-black"
                        value={endDate}
                        onChange={(e) => onEndChange(e.target.value)}
                    />
                </div>
            )}
            <button
                onClick={onSubmit}
                className="bg-black text-white px-4 py-2 rounded mt-4 md:mt-6 border border-gray-300"
            >
                {dayOnly ? "Filter Day" : "Filter"}
            </button>
        </div>
    </div>
);
