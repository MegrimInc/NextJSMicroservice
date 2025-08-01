"use client";

import React, { useEffect, useState } from "react";
import { AppConfig } from "@/lib/api/config";
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  Layers3,
  Star,
} from "lucide-react";

/* ─── API BASE ─────────────────────────────── */
const BASE_URL = `${AppConfig.postgresHttpBaseUrl}/merchant`;

/* ─── DATA TYPES ───────────────────────────── */
interface GeneralData {
  revenue: number;
  items: number;
  tips: number;
  itemsPoints: number;
  points: number;
}

interface DrinkCount {
  drinkId: number;
  itemName: string;
  doublePrice: number;
  soldWithDollars: number;
  soldWithPoints: number;
  totalSold: number;
}

interface Order {
  orderId: number;
  timestamp: string;
  totalRegularPrice: number;
  tip: number;
  status: string;
}

export default function AnalyticsPage() {
  const [general, setGeneral]   = useState<GeneralData | null>(null);
  const [drinks,  setDrinks]    = useState<DrinkCount[]>([]);
  const [visible, setVisible]   = useState(10);
  const [orders,  setOrders]    = useState<Order[]>([]);
  const [date,    setDate]      = useState("");
  const [err,     setErr]       = useState("");

  /* ── FETCH: General ──────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const g = await AppConfig.fetchWithAuth(`${BASE_URL}/generalData`)
            .then(r => r.json());
        setGeneral(g);
      } catch (e: any) { setErr(e.message); }
    })();
  }, []);

  /* ── FETCH: Top Items ────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const json = await AppConfig.fetchWithAuth(`${BASE_URL}/allItemCounts`)
            .then(r => { if (!r.ok) throw new Error("Cannot load item counts"); return r.json(); });
        setDrinks(json.data || []);
      } catch (e: any) { setErr(e.message); }
    })();
  }, []);

  /* ── FETCH: Orders by Day ────────────────── */
  const loadOrders = async () => {
    if (!date) return setErr("Pick a date first");
    try {
      const json = await AppConfig.fetchWithAuth(`${BASE_URL}/byDay?date=${date}`,
          { credentials: "include" })
          .then(r => { if (!r.ok) throw new Error("Cannot load orders"); return r.json(); });
      setOrders(json.orders || []);
    } catch (e: any) { setErr(e.message); }
  };

  /* ── Table pagination helpers ────────────── */
  const showMore = () => setVisible(n => n + 10);
  const showLess = () => setVisible(10);
  const showAll  = () => setVisible(drinks.length);
  const allVisible = visible >= drinks.length;

  /* ─── UI ─────────────────────────────────── */
  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-100 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* HEADER */}
          <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 text-transparent bg-clip-text">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Real-time performance of your store
            </p>
          </header>

          {/* ERROR */}
          {err && (
              <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-3 rounded-lg mx-auto max-w-md">
                {err}
              </div>
          )}

          {/* METRIC CARDS */}
          {general && (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard title="Revenue ($)"     value={`$${general.revenue.toFixed(2)}`} Icon={DollarSign} color="bg-emerald-500" />
                <MetricCard title="Revenue (pts)"   value={`${general.points}`}                Icon={Layers3}  color="bg-amber-500"   />
                <MetricCard title="Units Sold ($)"  value={`${general.items}`}                 Icon={BarChart2} color="bg-blue-500"   />
                <MetricCard title="Units Sold (pts)" value={`${general.itemsPoints}`}          Icon={TrendingUp} color="bg-violet-500" />
                <MetricCard title="Tips"            value={`$${general.tips.toFixed(2)}`}     Icon={Star}     color="bg-pink-500"    />
              </section>
          )}

          {/* TOP SELLING ITEMS */}
          <section className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-white via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 p-6">
              <h2 className="text-2xl font-bold text-black dark:text-white text-center">Top Selling Items</h2>
            </div>
            <div className="p-6 overflow-x-auto">
              {drinks.length ? (
                  <>
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-slate-200 dark:bg-slate-700 uppercase text-slate-600 dark:text-slate-300">
                      <tr>
                        <Th>Name</Th>
                        <Th>$ Price</Th>
                        <Th>Total Sold</Th>
                        <Th>With $</Th>
                        <Th>With Points</Th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {drinks.slice(0, visible).map(d => (
                          <tr key={d.drinkId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <Td>{d.itemName}</Td>
                            <Td>${d.doublePrice.toFixed(2)}</Td>
                            <Td>{d.totalSold}</Td>
                            <Td>{d.soldWithDollars}</Td>
                            <Td>{d.soldWithPoints}</Td>
                          </tr>
                      ))}
                      </tbody>
                    </table>

                    {/* Pagination buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                      {!allVisible && (
                          <>
                            <Button onClick={showMore} color="emerald">Show More</Button>
                            <Button onClick={showAll}  color="indigo">Show All</Button>
                          </>
                      )}
                      {visible > 10 && (
                          <Button onClick={showLess} color="rose">Show Less</Button>
                      )}
                    </div>
                  </>
              ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400">No items found.</p>
              )}
            </div>
          </section>

          {/* ORDERS BY DAY */}
          <section className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-white via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 p-6">
              <h2 className="text-2xl font-bold text-black dark:text-white text-center">Orders by Day</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="border rounded px-3 py-2 flex-1 bg-white text-black"
                />


                <Button onClick={loadOrders} color="neutral">Search</Button>
              </div>

              {orders.length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-slate-200 dark:bg-slate-700 uppercase text-slate-600 dark:text-slate-300">
                      <tr>
                        <Th>Order ID</Th>
                        <Th>Timestamp</Th>
                        <Th>Total ($)</Th>
                        <Th>Tip ($)</Th>
                        <Th>Status</Th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {orders.map(o => (
                          <tr key={o.orderId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <Td>{o.orderId}</Td>
                            <Td>
                              {new Date(o.timestamp).toLocaleString("en-US", {
                                dateStyle: "short",
                                timeStyle: "short",
                                timeZone: "America/New_York",
                              })}
                            </Td>
                            <Td>${o.totalRegularPrice.toFixed(2)}</Td>
                            <Td>${o.tip.toFixed(2)}</Td>
                            <Td>{o.status}</Td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400">No orders for that day.</p>
              )}
            </div>
          </section>
        </div>
      </div>
  );
}

/* ─── SMALL COMPONENTS ─────────────────────── */
const MetricCard = ({
                      title,
                      value,
                      Icon,
                      color,
                    }: {
  title: string;
  value: string;
  Icon: React.ElementType;
  color: string;
}) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow flex items-center p-4 gap-4">
      <div className={`${color} text-white rounded-full p-3 shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
    <th className="px-4 py-2 font-semibold tracking-wide whitespace-nowrap">{children}</th>
);
const Td = ({ children }: { children: React.ReactNode }) => (
    <td className="px-4 py-2 whitespace-nowrap">{children}</td>
);

const Button = ({
                  children,
                  onClick,
                  color,
                }: {
  children: React.ReactNode;
  onClick: () => void;
  color: "emerald" | "indigo" | "rose" | "neutral";
}) => {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white",
    indigo:  "bg-indigo-600  hover:bg-indigo-700  text-white",
    rose:    "bg-rose-500    hover:bg-rose-600    text-white",
    neutral: "bg-gradient-to-r from-white via-gray-200 to-gray-300 hover:from-white hover:via-gray-300 hover:to-gray-400 text-black",
  };
  return (
      <button
          onClick={onClick}
          className={`${colorMap[color]} px-4 py-2 rounded shadow`}
      >
        {children}
      </button>
  );
};
