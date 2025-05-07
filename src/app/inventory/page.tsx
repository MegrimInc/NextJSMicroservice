"use client";
import React, { useEffect, useState } from "react";

const API = "https://www.barzzy.site/postgres-test-api/merchant";

/* --------------------------- TYPES ---------------------------- */
export interface Item {
    itemId: number;
    regularPrice: number | null;
    discountPrice: number | null;
    pointPrice: number;
    taxPercent: number | null;
    name: string;
    description: string;
    categoryIds: number[];
}

interface Category {
    categoryId: number;
    name: string;
}

/* ------------------------ COMPONENT -------------------------- */
export default function InventoryPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string>("");
    const [editedItems, setEditedItems] = useState<Set<number>>(new Set());

    const blank: Item = {
        itemId: 0,
        name: "",
        description: "",
        pointPrice: 150,
        regularPrice: 0,
        discountPrice: 0,
        taxPercent: 0,
        categoryIds: [],
    };
    const [newItem, setNewItem] = useState<Item>(blank);

    useEffect(() => {
        fetch(API, { credentials: "include" })
            .then((r) => {
                if (r.status === 401) throw new Error("Session expired. Please log in again.");
                return r.ok ? r.json() : Promise.reject("Cannot load menu");
            })
            .then(setItems)
            .catch((e) => setError(String(e)));

        fetch(`${API}/configurations/categories`, { credentials: "include" })
            .then((r) => r.ok ? r.json() : Promise.reject("Cannot load categories"))
            .then((data) => setCategories(data.categories || []))
            .catch((e) => setError(String(e)));
    }, []);

    const markEdited = (id: number) => {
        setEditedItems((prev) => new Set(prev).add(id));
    };

    const saveItem = async (item: Item) => {
        try {
            const res = await fetch(`${API}/${item.itemId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (!res.ok) throw new Error("Update failed");
            setEditedItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(item.itemId);
                return newSet;
            });
        } catch (e) {
            setError(String(e));
        }
    };

    const updateField = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const formatted = ["regularPrice", "discountPrice", "pointPrice", "taxPercent"].includes(name)
            ? parseFloat(value)
            : value;

        setItems((prev) =>
            prev.map((it) => (it.itemId === id ? { ...it, [name]: formatted } : it))
        );
        markEdited(id);
    };

    const updateItemCategories = (itemId: number, newCategoryIds: number[]) => {
        setItems((prev) =>
            prev.map((it) => (it.itemId === itemId ? { ...it, categoryIds: newCategoryIds } : it))
        );
        markEdited(itemId);
    };

    const addItem = async () => {
        try {
            const res = await fetch(API, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });
            if (!res.ok) throw new Error("Create failed");
            const created: Item = await res.json();
            setItems((prev) => [...prev, created]);
            setNewItem(blank);
        } catch (err) {
            setError(String(err));
        }
    };

    const deleteItem = async (id: number) => {
        await fetch(`${API}/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        setItems((prev) => prev.filter((i) => i.itemId !== id));
    };

    return (
        <div className="w-full min-h-screen p-6 bg-white text-black overflow-auto">
            <h1 className="text-4xl font-extrabold text-center mb-6">Inventory Dashboard</h1>

            {error && <p className="bg-red-200 p-3 mb-4 rounded border-l-4 border-red-600">{error}</p>}

            <table className="w-full border-collapse text-sm">
                <thead className="border-b border-black">
                <tr>
                    <Th>ID</Th>
                    <Th>$ Price</Th>
                    <Th>Discount $</Th>
                    <Th>Pts</Th>
                    <Th>Tax %</Th>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Categories</Th>
                    <Th>Actions</Th>
                </tr>
                </thead>
                <tbody>
                {items.map((it) => (
                    <tr key={it.itemId} className="hover:bg-gray-100">
                        <Td>{it.itemId}</Td>
                        <Td><Input name="regularPrice" value={it.regularPrice ?? ""} onChange={updateField(it.itemId)} /></Td>
                        <Td><Input name="discountPrice" value={it.discountPrice ?? ""} onChange={updateField(it.itemId)} /></Td>
                        <Td><Input name="pointPrice" value={it.pointPrice} onChange={updateField(it.itemId)} /></Td>
                        <Td><Input name="taxPercent" value={it.taxPercent ?? ""} onChange={updateField(it.itemId)} /></Td>
                        <Td><Input name="name" value={it.name} onChange={updateField(it.itemId)} /></Td>
                        <Td><Input name="description" value={it.description} onChange={updateField(it.itemId)} /></Td>
                        <Td>
                            <CategoryDropdown
                                selected={it.categoryIds}
                                onChange={(ids) => updateItemCategories(it.itemId, ids)}
                                categories={categories}
                            />
                        </Td>
                        <Td>
                            <div className="flex flex-col gap-2">
                                <button className="text-red-600 font-semibold hover:underline" onClick={() => deleteItem(it.itemId)}>Delete</button>
                                {editedItems.has(it.itemId) && (
                                    <button className="text-blue-600 font-semibold hover:underline" onClick={() => saveItem(it)}>Save</button>
                                )}
                            </div>
                        </Td>
                    </tr>
                ))}

                {/* NEW ITEM ROW */}
                <tr className="hover:bg-gray-100">
                    <Td>new</Td>
                    <Td><Input name="regularPrice" value={newItem.regularPrice ?? ""} onChange={(e) => setNewItem({ ...newItem, regularPrice: +e.target.value })} /></Td>
                    <Td><Input name="discountPrice" value={newItem.discountPrice ?? ""} onChange={(e) => setNewItem({ ...newItem, discountPrice: +e.target.value })} /></Td>
                    <Td><Input name="pointPrice" value={newItem.pointPrice} onChange={(e) => setNewItem({ ...newItem, pointPrice: +e.target.value })} /></Td>
                    <Td><Input name="taxPercent" value={newItem.taxPercent ?? ""} onChange={(e) => setNewItem({ ...newItem, taxPercent: +e.target.value })} /></Td>
                    <Td><Input name="name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /></Td>
                    <Td><Input name="description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} /></Td>
                    <Td>
                        <CategoryDropdown
                            selected={newItem.categoryIds}
                            onChange={(ids) => setNewItem({ ...newItem, categoryIds: ids })}
                            categories={categories}
                        />
                    </Td>
                    <Td>
                        <button className="text-green-600 font-semibold hover:underline" onClick={addItem}>Add</button>
                    </Td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

/* ---------------------- CATEGORY DROPDOWN ---------------------- */
function CategoryDropdown({
                              selected,
                              onChange,
                              categories,
                          }: {
    selected: number[];
    onChange: (newIds: number[]) => void;
    categories: Category[];
}) {
    const toggle = (id: number) =>
        selected.includes(id)
            ? selected.filter((x) => x !== id)
            : [...selected, id];

    const toggleAll = () =>
        onChange(
            selected.length === categories.length
                ? []
                : categories.map((c) => c.categoryId)
        );

    return (
        <div className="relative">
            <details className="w-full">
                <summary className="cursor-pointer border px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 truncate">
                    {selected.length === 0
                        ? "Select categories"
                        : selected.length === categories.length
                            ? "All selected"
                            : `${selected.length} selected`}
                </summary>
                <div className="absolute z-10 bg-white shadow border mt-1 w-60 max-h-48 overflow-y-auto p-2 text-sm">
                    <label className="block cursor-pointer mb-1 text-blue-600 hover:underline" onClick={toggleAll}>
                        {selected.length === categories.length ? "Unselect All" : "Select All"}
                    </label>
                    {categories.map((cat) => (
                        <label key={cat.categoryId} className="block cursor-pointer">
                            <input
                                type="checkbox"
                                className="mr-1"
                                checked={selected.includes(cat.categoryId)}
                                onChange={() => onChange(toggle(cat.categoryId))}
                            />
                            {cat.name}
                        </label>
                    ))}
                </div>
            </details>
        </div>
    );
}

/* ---------------------- UI HELPERS ---------------------- */
const Th = ({ children }: { children: React.ReactNode }) => (
    <th className="p-2 text-left uppercase tracking-wide">{children}</th>
);
const Td = ({ children }: { children: React.ReactNode }) => (
    <td className="p-2 align-top">{children}</td>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full px-2 py-0.5 border border-black rounded focus:ring-1 focus:ring-black"
    />
);
