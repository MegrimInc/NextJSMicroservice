"use client";
import React, { useEffect, useState } from "react";
import { AppConfig } from "@/lib/api/config";

const API = `${AppConfig.postgresHttpBaseUrl}/merchant`;

/* --------------------------- TYPES ---------------------------- */
export interface Item {
    itemId: number;
    name: string;
    description: string;
    regularPrice: number | null;
    discountPrice: number | null;
    pointPrice: number;
    gratuityPercent: number | null;
    taxPercent: number | null;
    categoryIds: number[];
    // locally hold the selected file before upload
    imageFile?: File;
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
        regularPrice: 0,
        discountPrice: 0,
        pointPrice: 150,
        taxPercent: 0,
        gratuityPercent: 0,
        categoryIds: [],
        imageFile: undefined,
    };
    const [newItem, setNewItem] = useState<Item>({ ...blank });

    useEffect(() => {
        // load items
        AppConfig.fetchWithAuth(API, { credentials: "include" })
            .then((r) => {
                if (r.status === 401) throw new Error("Session expired. Please log in again.");
                return r.ok ? r.json() : Promise.reject("Cannot load menu");
            })
            .then(setItems)
            .catch((e) => setError(String(e)));

        // load categories
        AppConfig.fetchWithAuth(`${API}/configurations/categories`, { credentials: "include" })
            .then((r) => (r.ok ? r.json() : Promise.reject("Cannot load categories")))
            .then((data) => setCategories(data.categories || []))
            .catch((e) => setError(String(e)));
    }, []);

    const markEdited = (id: number) => {
        setEditedItems((prev) => {
            const s = new Set(prev);
            s.add(id);
            return s;
        });
    };

    const saveItem = async (item: Item) => {
        try {
            await AppConfig.fetchWithAuth(`${API}/${item.itemId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            setEditedItems((prev) => {
                const s = new Set(prev);
                s.delete(item.itemId);
                return s;
            });
        } catch (e) {
            setError(String(e));
        }
    };

    const updateField =
        (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            const formatted = ["regularPrice", "discountPrice", "pointPrice", "taxPercent", "gratuityPercent"].includes(
                name
            )
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

    const updateItemImage =
        (itemId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setItems((prev) =>
                prev.map((it) => (it.itemId === itemId ? { ...it, imageFile: file } : it))
            );
            markEdited(itemId);
        };

    const addItem = async () => {
        try {
            const res = await AppConfig.fetchWithAuth(API, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });
            if (!res.ok) throw new Error("Create failed");
            const created: Item = await res.json();
            setItems((prev) => [...prev, created]);
            setNewItem({ ...blank });
        } catch (err) {
            setError(String(err));
        }
    };

    const deleteItem = async (id: number) => {
        await AppConfig.fetchWithAuth(`${API}/${id}`, {
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
                    <Th className="w-24">$ Price</Th>
                    <Th className="w-24">Discount $</Th>
                    <Th className="w-24">Pts</Th>
                    <Th className="w-28">Tax %</Th>
                    <Th className="w-28">Gratuity %</Th>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Categories</Th>
                    <Th>Image</Th>
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
                                type="number"
                                step="0.01"
                                className="w-24"
                                value={it.regularPrice ?? ""}
                                onChange={updateField(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <Input
                                name="discountPrice"
                                type="number"
                                step="0.01"
                                className="w-24"
                                value={it.discountPrice ?? ""}
                                onChange={updateField(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <Input
                                name="pointPrice"
                                type="number"
                                className="w-24"
                                value={it.pointPrice}
                                onChange={updateField(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <Input
                                name="taxPercent"
                                type="number"
                                step="0.01"
                                className="w-28"
                                value={it.taxPercent ?? ""}
                                onChange={updateField(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <Input
                                name="gratuityPercent"
                                type="number"
                                step="0.01"
                                className="w-28"
                                value={it.gratuityPercent ?? ""}
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
                            <CategoryDropdown
                                selected={it.categoryIds}
                                onChange={(ids) => updateItemCategories(it.itemId, ids)}
                                categories={categories}
                            />
                        </Td>
                        <Td>
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={updateItemImage(it.itemId)}
                            />
                        </Td>
                        <Td>
                            <div className="flex flex-col gap-2">
                                <button
                                    className="text-red-600 font-semibold hover:underline"
                                    onClick={() => deleteItem(it.itemId)}
                                >
                                    Delete
                                </button>
                                {editedItems.has(it.itemId) && (
                                    <button
                                        className="text-blue-600 font-semibold hover:underline"
                                        onClick={() => saveItem(it)}
                                    >
                                        Save
                                    </button>
                                )}
                            </div>
                        </Td>
                    </tr>
                ))}

                {/* NEW ITEM ROW */}
                <tr className="hover:bg-gray-100">
                    <Td>new</Td>
                    <Td>
                        <Input
                            name="regularPrice"
                            type="number"
                            step="0.01"
                            className="w-24"
                            value={newItem.regularPrice ?? ""}
                            onChange={(e) => setNewItem({ ...newItem, regularPrice: +e.target.value })}
                        />
                    </Td>
                    <Td>
                        <Input
                            name="discountPrice"
                            type="number"
                            step="0.01"
                            className="w-24"
                            value={newItem.discountPrice ?? ""}
                            onChange={(e) => setNewItem({ ...newItem, discountPrice: +e.target.value })}
                        />
                    </Td>
                    <Td>
                        <Input
                            name="pointPrice"
                            type="number"
                            className="w-24"
                            value={newItem.pointPrice}
                            onChange={(e) => setNewItem({ ...newItem, pointPrice: +e.target.value })}
                        />
                    </Td>
                    <Td>
                        <Input
                            name="taxPercent"
                            type="number"
                            step="0.01"
                            className="w-28"
                            value={newItem.taxPercent ?? ""}
                            onChange={(e) => setNewItem({ ...newItem, taxPercent: +e.target.value })}
                        />
                    </Td>
                    <Td>
                        <Input
                            name="gratuityPercent"
                            type="number"
                            step="0.01"
                            className="w-28"
                            value={newItem.gratuityPercent ?? ""}
                            onChange={(e) => setNewItem({ ...newItem, gratuityPercent: +e.target.value })}
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
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        />
                    </Td>
                    <Td>
                        <CategoryDropdown
                            selected={newItem.categoryIds}
                            onChange={(ids) => setNewItem({ ...newItem, categoryIds: ids })}
                            categories={categories}
                        />
                    </Td>
                    <Td>
                        <input
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={(e) =>
                                setNewItem({ ...newItem, imageFile: e.target.files?.[0] })
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
        selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];

    const toggleAll = () =>
        onChange(selected.length === categories.length ? [] : categories.map((c) => c.categoryId));

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
                    <label
                        className="block cursor-pointer mb-1 text-blue-600 hover:underline"
                        onClick={toggleAll}
                    >
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
const Th = ({
                children,
                className = "",
            }: {
    children: React.ReactNode;
    className?: string;
}) => <th className={`p-2 text-left uppercase tracking-wide ${className}`}>{children}</th>;

const Td = ({
                children,
                className = "",
            }: {
    children: React.ReactNode;
    className?: string;
}) => <td className={`p-2 align-top ${className}`}>{children}</td>;

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`${props.className ?? ""} w-full px-2 py-0.5 border border-black rounded focus:ring-1 focus:ring-black`}
    />
);
