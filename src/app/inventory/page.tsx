"use client";
import React, { useEffect, useState } from "react";

/* -------------------------------- CONFIG -------------------------------- */
// Back-end base URL
const API = "http://34.207.184.72:8080/api/items";

// Pull the logged-in merchant’s ID from localStorage (set at login)
const merchantId =
    typeof window !== "undefined" ? localStorage.getItem("merchantId") ?? "" : "";

/* -------------------------------- TYPES --------------------------------- */
export interface Item {
    itemId: number;
    regularPrice: number | null;
    discountPrice: number | null;
    pointPrice: number;
    name: string;
    description: string;
}

/* --------------------------- REACT COMPONENT ---------------------------- */
export default function InventoryPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [error, setError] = useState<string>("");

    /* ------------ Fetch menu once merchantId is available ------------- */
    useEffect(() => {
        if (!merchantId) {
            setError("Missing merchant credentials. Please log in again.");
            return;
        }
        fetch(API, { headers: { "X-MERCHANT-ID": merchantId } })
            .then((r) => (r.ok ? r.json() : Promise.reject("Cannot load menu")))
            .then(setItems)
            .catch((e) => setError(String(e)));
    }, []);

    /* ---------------------- New-item form state ----------------------- */
    const blank: Item = {
        itemId: 0,
        name: "",
        description: "",
        pointPrice: 150,
        regularPrice: 0,
        discountPrice: 0,
    };
    const [newItem, setNewItem] = useState<Item>(blank);

    /* ---------------------------- Helpers ----------------------------- */
    const updateField =
        (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            const formatted = ["regularPrice", "discountPrice", "pointPrice"].includes(
                name
            )
                ? parseFloat(value)
                : value;
            setItems((prev) =>
                prev.map((it) => (it.itemId === id ? { ...it, [name]: formatted } : it))
            );

            // Push change to server (debounced/throttled in real life)
            fetch(`${API}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-MERCHANT-ID": merchantId,
                },
                body: JSON.stringify({ [name]: formatted }),
            }).catch(console.error);
        };

    const addItem = async () => {
        try {
            const res = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-MERCHANT-ID": merchantId,
                },
                body: JSON.stringify(newItem),
            });
            if (!res.ok) throw new Error("Create failed");
            const created: Item = await res.json();
            setItems((prev) => [...prev, created]);
            setNewItem(blank); // reset
        } catch (err) {
            setError(String(err));
        }
    };

    const deleteItem = async (id: number) => {
        await fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: { "X-MERCHANT-ID": merchantId },
        });
        setItems((prev) => prev.filter((i) => i.itemId !== id));
    };

    /* ---------------------------- UI ----------------------------- */
    return (
        <div className="w-full min-h-screen p-6 bg-white text-black overflow-auto">
            <h1 className="text-4xl font-extrabold text-center mb-6">
                Inventory Dashboard
            </h1>

            {error && (
                <p className="bg-red-200 p-3 mb-4 rounded border-l-4 border-red-600">
                    {error}
                </p>
            )}

            <table className="w-full border-collapse text-sm">
                <thead className="border-b border-black">
                <tr>
                    <Th>ID</Th>
                    <Th>$ Price</Th>
                    <Th>Discount $</Th>
                    <Th>Pts</Th>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Actions</Th>
                </tr>
                </thead>
                <tbody>
                {items.map((it) => (
                    <tr key={it.itemId} className="hover:bg-gray-100">
                        <Td>{it.itemId}</Td>
                        <Td>
                            <Input
                                name="regularPrice"
                                value={it.regularPrice ?? ""}
                                onChange={updateField(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <Input
                                name="discountPrice"
                                value={it.discountPrice ?? ""}
                                onChange={updateField(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <Input
                                name="pointPrice"
                                value={it.pointPrice}
                                onChange={updateField(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <Input
                                name="name"
                                value={it.name}
                                onChange={updateField(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <Input
                                name="description"
                                value={it.description}
                                onChange={updateField(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <button
                                className="text-red-600 font-semibold hover:underline"
                                onClick={() => deleteItem(it.itemId)}
                            >
                                Delete
                            </button>
                        </Td>
                    </tr>
                ))}

                {/* --- NEW ITEM ROW --- */}
                <tr className="hover:bg-gray-100">
                    <Td>new</Td>
                    <Td>
                        <Input
                            name="regularPrice"
                            value={newItem.regularPrice ?? ""}
                            onChange={(e) =>
                                setNewItem({ ...newItem, regularPrice: +e.target.value })
                            }
                        />

                    </Td>
                    <Td>
                        <Input
                            name="discountPrice"
                            value={newItem.discountPrice ?? ""}
                            onChange={(e) =>
                                setNewItem({ ...newItem, discountPrice: +e.target.value })
                            }
                        />
                    </Td>
                    <Td>
                        <Input
                            name="pointPrice"
                            value={newItem.pointPrice}
                            onChange={(e) =>
                                setNewItem({ ...newItem, pointPrice: +e.target.value })
                            }
                        />
                    </Td>
                    <Td>
                        <Input
                            name="name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                    </Td>
                    <Td>
                        <Input
                            name="description"
                            value={newItem.description}
                            onChange={(e) =>
                                setNewItem({ ...newItem, description: e.target.value })
                            }
                        />
                    </Td>
                    <Td>
                        <button
                            className="text-green-600 font-semibold hover:underline"
                            onClick={addItem}
                        >
                            Add
                        </button>
                    </Td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

/* ---------- tiny presentational helpers ---------- */
const Th = ({ children }: { children: React.ReactNode }) => (
    <th className="p-2 text-left uppercase tracking-wide">{children}</th>
);
const Td = ({ children }: { children: React.ReactNode }) => (
    <td className="p-2">{children}</td>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full px-2 py-0.5 border border-black rounded focus:ring-1 focus:ring-black"
    />
);
