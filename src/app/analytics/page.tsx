'use client';

import React, { useEffect, useState } from 'react';
import { AppConfig } from '@/lib/api/config';


const BASE_URL = `${AppConfig.postgresHttpBaseUrl}/merchant`;

// --- Interfaces ---
interface GeneralData {
  revenue: number;
  items: number; // matches the JSON "items" key
  tips: number;
  itemsPoints: number; // matches the JSON "itemsPoints" key
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
}

export default function AnalyticsPage() {
  const [generalData, setGeneralData] = useState<GeneralData | null>(null);
  const [drinkCounts, setDrinkCounts] = useState<DrinkCount[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [ordersByDay, setOrdersByDay] = useState<Order[]>([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [error, setError] = useState('');

  // Fetch General Data
  useEffect(() => {
    AppConfig.fetchWithAuth(`${BASE_URL}/generalData`)
      .then((res) => res.json())
      .then((data: GeneralData) => setGeneralData(data))
      .catch((e) => setError(e.message));
  }, []);

  // Fetch Top Selling Items
  useEffect(() => {
    AppConfig.fetchWithAuth(`${BASE_URL}/allItemCounts`)
      .then((res) => {
        if (!res.ok) throw new Error('Cannot load item counts');
        return res.json();
      })
      .then((json: { data: DrinkCount[] }) => setDrinkCounts(json.data || []))
      .catch((e) => setError(String(e.message || e)));
  }, []);

  // Fetch Orders By Day
  const searchOrdersByDay = async () => {
    if (!selectedDay) {
      setError('Please select a date first.');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/byDay?date=${selectedDay}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Cannot load orders for that day');
      const json = await res.json();
      setOrdersByDay(json.orders || []);
    } catch (e) {
      setError(String(e));
    }
  };

  const showAll = () => setVisibleCount(drinkCounts.length);
  const showLess = () => setVisibleCount(10);
  const showMore = () => setVisibleCount((n) => n + 10);
  const isAllVisible = visibleCount >= drinkCounts.length;

  return (
    <div className="min-h-screen bg-gray-100 text-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-8">
          Analytics Dashboard
        </h1>

        {error && (
          <div className="bg-red-200 border-l-4 border-red-600 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {/* General Data */}
        {generalData && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card
              title="Revenue ($)"
              value={`$${generalData.revenue.toFixed(2)}`}
            />
            <Card title="Revenue (pts)" value={`${generalData.points} pts`} />
            <Card title="Units Sold ($)" value={`${generalData.items}`} />
            <Card
              title="Units Sold (pts)"
              value={`${generalData.itemsPoints}`}
            />
            <Card title="Tips" value={`$${generalData.tips.toFixed(2)}`} />
          </div>
        )}

        {/* Top Selling Items */}
        <div className="bg-white shadow-lg rounded-lg mb-8">
          <div className="bg-gray-200 p-6">
            <h2 className="text-3xl font-bold text-center">
              Top Selling Items
            </h2>
          </div>
          <div className="p-6">
            {drinkCounts.length ? (
              <>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">
                        $Price
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">
                        Total Sold
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">
                        With $
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">
                        With Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {drinkCounts.slice(0, visibleCount).map((d) => (
                      <tr key={d.drinkId} className="hover:bg-gray-100">
                        <td className="px-4 py-2">{d.drinkName}</td>
                        <td className="px-4 py-2">
                          ${d.doublePrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-2">{d.totalSold}</td>
                        <td className="px-4 py-2">{d.soldWithDollars}</td>
                        <td className="px-4 py-2">{d.soldWithPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex justify-center space-x-4">
                  {!isAllVisible && (
                    <>
                      <button
                        onClick={showMore}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                      >
                        Show More
                      </button>
                      <button
                        onClick={showAll}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        Show All
                      </button>
                    </>
                  )}
                  {visibleCount > 10 && (
                    <button
                      onClick={showLess}
                      className="px-4 py-2 bg-red-400 text-white rounded"
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

        {/* Orders by Day */}
        <div className="bg-white shadow-lg rounded-lg mb-8">
          <div className="bg-gray-200 p-6">
            <h2 className="text-3xl font-bold text-center">Orders by Day</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
              <label
                htmlFor="orderDate"
                className="text-lg font-semibold mb-2 md:mb-0"
              >
                Select Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                id="orderDate"
                className="border p-2 rounded"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              />
              <button
                onClick={searchOrdersByDay}
                className="mt-2 md:mt-0 px-4 py-2 bg-purple-600 text-white rounded"
              >
                Search
              </button>
            </div>

            {ordersByDay.length ? (
              <table className="min-w-full divide-y divide-gray-300">
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
                  {ordersByDay.map((o) => (
                    <tr key={o.orderId} className="hover:bg-gray-100">
                      <td className="px-4 py-2">{o.orderId}</td>
                      <td className="px-4 py-2">
                        {new Date(o.timestamp).toLocaleString('en-US', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                          timeZone: 'America/New_York',
                        })}
                      </td>
                      <td className="px-4 py-2">
                        ${o.totalRegularPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">${o.tip.toFixed(2)}</td>
                      <td className="px-4 py-2">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">
                No orders for that day.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white shadow-lg rounded p-4 text-gray-900">
    <h2 className="font-bold text-xl">{title}</h2>
    <p className="text-3xl">{value}</p>
  </div>
);
