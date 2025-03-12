"use client";

import React, { useState } from "react";

interface Drink {
    drink_name: string;
    alcohol_content?: string;
    description?: string;
    point_price?: number; // e.g. 100 = $1.00
    single_price?: number;
    single_happy_price?: number;
    double_price?: number;
    double_happy_price?: number;
}

export default function Page() {
    const [drinks, setDrinks] = useState<Drink[]>([
        {
            drink_name: "Margarita",
            alcohol_content: "40%",
            description: "Tequila, triple sec, lime juice",
            point_price: 100,
            single_price: 8,
            single_happy_price: 6,
            double_price: 14,
            double_happy_price: 10,
        },
        {
            drink_name: "Old Fashioned",
            alcohol_content: "37%",
            description: "Whiskey, sugar, bitters",
            point_price: 200,
            single_price: 10,
            single_happy_price: 8,
            double_price: 16,
            double_happy_price: 12,
        },
        {
            drink_name: "Mojito",
            alcohol_content: "35%",
            description: "White rum, mint, lime, sugar, soda",
            point_price: 150,
            single_price: 9,
            single_happy_price: 7,
            double_price: 15,
            double_happy_price: 11,
        },
    ]);

    const [editIndex, setEditIndex] = useState<number>(-1);
    const [editDrink, setEditDrink] = useState<Drink | null>(null);

    // When "Edit" is clicked:
    const handleEdit = (index: number) => {
        setEditIndex(index);
        setEditDrink({ ...drinks[index] });
    };

    // Handle field changes in the editing row
    const handleChange = (field: keyof Drink, value: string | number) => {
        if (!editDrink) return;
        setEditDrink({ ...editDrink, [field]: value });
    };

    // Save changes to the array
    const handleSave = () => {
        if (editDrink == null || editIndex < 0) return;
        const updatedDrinks = [...drinks];
        updatedDrinks[editIndex] = editDrink;
        setDrinks(updatedDrinks);
        setEditIndex(-1);
        setEditDrink(null);
    };

    // Cancel editing
    const handleCancel = () => {
        setEditIndex(-1);
        setEditDrink(null);
    };

    return (
        <div className="min-h-screen bg-white text-black p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Your Drinks Menu</h2>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-400 rounded-lg">
                    <thead className="bg-gray-300 text-black">
                    <tr>
                        <th className="border p-2">#</th>
                        <th className="border p-2">Drink Name</th>
                        <th className="border p-2">Alcohol Content</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Point Price</th>
                        <th className="border p-2">Single Price</th>
                        <th className="border p-2">Single Happy Price</th>
                        <th className="border p-2">Double Price</th>
                        <th className="border p-2">Double Happy Price</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {drinks.map((drink, index) => {
                        const isEditing = index === editIndex;
                        return (
                            <tr key={index} className="border text-center">
                                <td className="border p-2">{index + 1}</td>

                                {/* Drink Name */}
                                <td className="border p-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="border px-2 py-1 w-full text-black"
                                            value={editDrink?.drink_name ?? ""}
                                            onChange={(e) =>
                                                handleChange("drink_name", e.target.value)
                                            }
                                        />
                                    ) : (
                                        drink.drink_name
                                    )}
                                </td>

                                {/* Alcohol Content */}
                                <td className="border p-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="border px-2 py-1 w-full text-black"
                                            value={editDrink?.alcohol_content ?? ""}
                                            onChange={(e) =>
                                                handleChange("alcohol_content", e.target.value)
                                            }
                                        />
                                    ) : (
                                        drink.alcohol_content || "N/A"
                                    )}
                                </td>

                                {/* Description */}
                                <td className="border p-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="border px-2 py-1 w-full text-black"
                                            value={editDrink?.description ?? ""}
                                            onChange={(e) =>
                                                handleChange("description", e.target.value)
                                            }
                                        />
                                    ) : (
                                        drink.description || "N/A"
                                    )}
                                </td>

                                {/* Point Price (in cents) */}
                                <td className="border p-2">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            step="100"
                                            className="border px-2 py-1 w-full text-black"
                                            value={editDrink?.point_price ?? 0}
                                            onChange={(e) =>
                                                handleChange("point_price", parseInt(e.target.value))
                                            }
                                        />
                                    ) : (
                                        drink.point_price ?? "N/A"
                                    )}
                                </td>

                                {/* Single Price */}
                                <td className="border p-2">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="border px-2 py-1 w-full text-black"
                                            value={editDrink?.single_price ?? 0}
                                            onChange={(e) =>
                                                handleChange(
                                                    "single_price",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    ) : drink.single_price ? (
                                        `$${drink.single_price}`
                                    ) : (
                                        "N/A"
                                    )}
                                </td>

                                {/* Single Happy Price */}
                                <td className="border p-2">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="border px-2 py-1 w-full text-black"
                                            value={editDrink?.single_happy_price ?? 0}
                                            onChange={(e) =>
                                                handleChange(
                                                    "single_happy_price",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    ) : drink.single_happy_price ? (
                                        `$${drink.single_happy_price}`
                                    ) : (
                                        "N/A"
                                    )}
                                </td>

                                {/* Double Price */}
                                <td className="border p-2">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="border px-2 py-1 w-full text-black"
                                            value={editDrink?.double_price ?? 0}
                                            onChange={(e) =>
                                                handleChange(
                                                    "double_price",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    ) : drink.double_price ? (
                                        `$${drink.double_price}`
                                    ) : (
                                        "N/A"
                                    )}
                                </td>

                                {/* Double Happy Price */}
                                <td className="border p-2">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="border px-2 py-1 w-full text-black"
                                            value={editDrink?.double_happy_price ?? 0}
                                            onChange={(e) =>
                                                handleChange(
                                                    "double_happy_price",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    ) : drink.double_happy_price ? (
                                        `$${drink.double_happy_price}`
                                    ) : (
                                        "N/A"
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="border p-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="bg-gray-400 text-white px-2 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    {/* If no drinks, fallback row */}
                    {drinks.length === 0 && (
                        <tr>
                            <td colSpan={10} className="p-4 text-center text-gray-500">
                                No drinks found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
