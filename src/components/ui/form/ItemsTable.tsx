"use client";
import React, { useState } from "react";

interface Item {
    item_id: number;
    regular_price: number; // single_price
    discount_price: number; // single_happy_price
    point_price: number;
    name: string;
    description: string;
    categories: string;
}

// Your initial items data
const initialItems: Item[] = [
    {
        item_id: 2046,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Rum & Sprite",
        description: "Served over ice with a lime wedge.",
        categories: "Rum, Carbonated",
    },
    {
        item_id: 2047,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Tequila Cranberry",
        description: "Tequila and cranberry juice, served over ice.",
        categories: "Tequila, Fruity",
    },
    {
        item_id: 2048,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Vodka & Coke",
        description: "Made with vodka and Coca-Cola, served over ice.",
        categories: "Vodka, Carbonated",
    },
    {
        item_id: 2049,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Vodka Sour",
        description: "Vodka, simple syrup, and lemon juice, topped with a lemon twist.",
        categories: "Vodka, Sour",
    },
    {
        item_id: 2050,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Whiskey Sour",
        description:
            "Whiskey, lemon juice, simple syrup, and (optionally) egg white for a creamy texture.",
        categories: "Whiskey, Sour",
    },
    {
        item_id: 2051,
        regular_price: 5,
        discount_price: 2.5,
        point_price: 300,
        name: "Corona",
        description: "A light and refreshing beer, often served with a lime wedge.",
        categories: "Beer",
    },
    {
        item_id: 2053,
        regular_price: 3,
        discount_price: 1,
        point_price: 150,
        name: "Rum Shot",
        description: "Often served chilled.",
        categories: "Rum, Shot",
    },
    {
        item_id: 2054,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Screwdriver",
        description: "Made with vodka and orange juice, served over ice.",
        categories: "Vodka, Fruity",
    },
    {
        item_id: 2055,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Tequila Orange",
        description: "Tequila and orange juice, served over ice.",
        categories: "Tequila, Fruity",
    },
    {
        item_id: 2056,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Vodka Cranberry",
        description: "Vodka and cranberry juice, served over ice.",
        categories: "Vodka, Fruity",
    },
    {
        item_id: 2057,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Vodka Sprite",
        description: "Vodka and Sprite, served over ice.",
        categories: "Vodka, Carbonated",
    },
    {
        item_id: 2059,
        regular_price: 5,
        discount_price: 2.5,
        point_price: 300,
        name: "Fireball Shot",
        description: "Whiskey known for its spicy, cinnamon flavor.",
        categories: "Whiskey, Shot",
    },
    {
        item_id: 2060,
        regular_price: 9,
        discount_price: 9, // same price for Midori Sour
        point_price: 600,
        name: "Midori Sour",
        description: "Midori (melon liqueur), lemon juice, and simple syrup, served over ice.",
        categories: "Liqueur, Sour",
    },
    {
        item_id: 2061,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Rum & Coke",
        description: "Rum and Coca-Cola, served over ice.",
        categories: "Rum, Carbonated",
    },
    {
        item_id: 2062,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Sex On The Beach",
        description: "Vodka, peach schnapps, orange juice, and cranberry juice.",
        categories: "Vodka, Fruity",
    },
    {
        item_id: 2063,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Tequila Pineapple",
        description: "Tequila and pineapple juice, served over ice.",
        categories: "Tequila, Fruity",
    },
    {
        item_id: 2064,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Vodka Pineapple",
        description: "Vodka and pineapple juice, served over ice.",
        categories: "Vodka, Fruity",
    },
    {
        item_id: 2065,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Vodka Tonic",
        description: "Vodka and tonic water, served over ice with a lime.",
        categories: "Vodka, Carbonated",
    },
    {
        item_id: 2066,
        regular_price: 4,
        discount_price: 2,
        point_price: 225,
        name: "Whiteclaw",
        description: "Hard seltzer with various flavors—light and refreshing taste.",
        categories: "Seltzer, Light",
    },
    {
        item_id: 2067,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Gin & Cranberry",
        description: "Gin and cranberry juice, served over ice.",
        categories: "Gin, Fruity",
    },
    {
        item_id: 2068,
        regular_price: 4,
        discount_price: 2,
        point_price: 225,
        name: "Miller Light",
        description: "Light beer with a clean flavor.",
        categories: "Beer",
    },
    {
        item_id: 2069,
        regular_price: 5,
        discount_price: 1.5,
        point_price: 150,
        name: "Vodka Shot",
        description: "Straight vodka, served with a lime.",
        categories: "Vodka, Shot",
    },
    {
        item_id: 2071,
        regular_price: 3,
        discount_price: 1,
        point_price: 150,
        name: "Tequila Shot",
        description: "Straight tequila, traditionally served with salt and lime.",
        categories: "Tequila, Shot",
    },
    {
        item_id: 2073,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Whiskey & Ginger Ale",
        description: "Whiskey and ginger ale, served over ice.",
        categories: "Whiskey, Carbonated",
    },
    {
        item_id: 2074,
        regular_price: 7,
        discount_price: 3.5,
        point_price: 450,
        name: "Gin & Soda",
        description: "Gin and club soda, served over ice.",
        categories: "Gin, Carbonated",
    },
    {
        item_id: 2075,
        regular_price: 5,
        discount_price: 2.5,
        point_price: 300,
        name: "Modelo",
        description: "A crisp lager with a slightly sweet and malty taste.",
        categories: "Beer",
    },
];

const ItemsTable: React.FC = () => {
    const [items, setItems] = useState<Item[]>(initialItems);

    const [newItem, setNewItem] = useState<Item>({
        item_id: items.length ? Math.max(...items.map((i) => i.item_id)) + 1 : 1,
        regular_price: 0,
        discount_price: 0,
        point_price: 0,
        name: "",
        description: "",
        categories: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: number
    ) => {
        const { name, value } = e.target;
        setItems((prev) =>
            prev.map((item) =>
                item.item_id === id
                    ? {
                        ...item,
                        [name]: parseFloat(value) || value,
                    }
                    : item
            )
        );
    };

    const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({
            ...prev,
            [name]: parseFloat(value) || value,
        }));
    };

    const addItem = () => {
        setItems([...items, { ...newItem }]);
        setNewItem({
            item_id: newItem.item_id + 1,
            regular_price: 0,
            discount_price: 0,
            point_price: 0,
            name: "",
            description: "",
            categories: "",
        });
    };

    const deleteItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.item_id !== id));
    };

    return (
        <div className="w-full h-screen p-6 bg-white text-black overflow-auto">
            {/* Title */}
            <div className="text-center mb-6">
                <h1 className="text-5xl font-extrabold font-serif tracking-wide uppercase">
                    The Burg Restro-Bar
                </h1>
            </div>

            {/* Table */}
            <table className="w-full border-collapse text-sm">
                <thead className="border-b border-black">
                <tr>
                    <th className="p-2 text-left uppercase tracking-wide">Item ID</th>
                    <th className="p-2 text-left uppercase tracking-wide">Regular Price</th>
                    <th className="p-2 text-left uppercase tracking-wide">Discount Price</th>
                    <th className="p-2 text-left uppercase tracking-wide">Point Price</th>
                    <th className="p-2 text-left uppercase tracking-wide">Name</th>
                    <th className="p-2 text-left uppercase tracking-wide">Description</th>
                    <th className="p-2 text-left uppercase tracking-wide">Categories</th>
                    <th className="p-2 text-left uppercase tracking-wide">Upload Image</th>
                    <th className="p-2 text-left uppercase tracking-wide">Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr
                        key={item.item_id}
                        className="hover:bg-gray-100 transition"
                    >
                        <td className="p-2">{item.item_id}</td>

                        {/* Skinnier input fields for prices */}
                        <td className="p-2">
                            <input
                                type="number"
                                name="regular_price"
                                value={item.regular_price}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-16 px-1 py-0.5 border border-black rounded focus:ring-1 focus:ring-black"
                            />
                        </td>
                        <td className="p-2">
                            <input
                                type="number"
                                name="discount_price"
                                value={item.discount_price}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-16 px-1 py-0.5 border border-black rounded focus:ring-1 focus:ring-black"
                            />
                        </td>
                        <td className="p-2">
                            <input
                                type="number"
                                name="point_price"
                                value={item.point_price}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-16 px-1 py-0.5 border border-black rounded focus:ring-1 focus:ring-black"
                            />
                        </td>

                        <td className="p-2">
                            <input
                                type="text"
                                name="name"
                                value={item.name}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-full px-2 py-1 border border-black rounded focus:ring-1 focus:ring-black"
                            />
                        </td>
                        <td className="p-2">
                            <input
                                type="text"
                                name="description"
                                value={item.description}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-full px-2 py-1 border border-black rounded focus:ring-1 focus:ring-black"
                            />
                        </td>
                        <td className="p-2">
                            <input
                                type="text"
                                name="categories"
                                value={item.categories}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-full px-2 py-1 border border-black rounded focus:ring-1 focus:ring-black"
                            />
                        </td>

                        {/* New "Upload Image" column */}
                        <td className="p-2 text-center">
                            <button className="flex items-center gap-1 text-blue-600 hover:underline">
                                {/* A simple “upload” SVG icon: */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M.5 9.9a.5.5 0 0 1 .5.5v3.3a.5.5 0 0 0 .5.5h13.5a.5.5 0 0 0 .5-.5V10.4a.5.5 0 0 1 1 0v3.3a1.5 1.5 0 0 1-1.5 1.5H1.5a1.5 1.5 0 0 1-1.5-1.5V10.4a.5.5 0 0 1 .5-.5z"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        d="M7.646 1.146a.5.5 0 0 1 .708 0l3.182 3.182a.5.5 0 0 1-.708.708L8.5
                        2.707V10a.5.5 0 0 1-1 0V2.707L5.146 5.036a.5.5 0 1 1-.708-.708L7.646 1.146z"
                                    />
                                </svg>
                                <span>Upload</span>
                            </button>
                        </td>

                        <td className="p-2">
                            <button
                                onClick={() => deleteItem(item.item_id)}
                                className="text-red-600 font-semibold hover:underline"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}

                {/* New Item Row */}
                <tr className="hover:bg-gray-100 transition">
                    <td className="p-2">{newItem.item_id}</td>

                    {/* Skinnier input fields for new item prices */}
                    <td className="p-2">
                        <input
                            type="number"
                            name="regular_price"
                            value={newItem.regular_price}
                            onChange={handleNewItemChange}
                            className="w-16 px-1 py-0.5 border border-black rounded focus:ring-1 focus:ring-black"
                        />
                    </td>
                    <td className="p-2">
                        <input
                            type="number"
                            name="discount_price"
                            value={newItem.discount_price}
                            onChange={handleNewItemChange}
                            className="w-16 px-1 py-0.5 border border-black rounded focus:ring-1 focus:ring-black"
                        />
                    </td>
                    <td className="p-2">
                        <input
                            type="number"
                            name="point_price"
                            value={newItem.point_price}
                            onChange={handleNewItemChange}
                            className="w-16 px-1 py-0.5 border border-black rounded focus:ring-1 focus:ring-black"
                        />
                    </td>

                    <td className="p-2">
                        <input
                            type="text"
                            name="name"
                            value={newItem.name}
                            onChange={handleNewItemChange}
                            className="w-full px-2 py-1 border border-black rounded focus:ring-1 focus:ring-black"
                            placeholder="New Item"
                        />
                    </td>
                    <td className="p-2">
                        <input
                            type="text"
                            name="description"
                            value={newItem.description}
                            onChange={handleNewItemChange}
                            className="w-full px-2 py-1 border border-black rounded focus:ring-1 focus:ring-black"
                        />
                    </td>
                    <td className="p-2">
                        <input
                            type="text"
                            name="categories"
                            value={newItem.categories}
                            onChange={handleNewItemChange}
                            className="w-full px-2 py-1 border border-black rounded focus:ring-1 focus:ring-black"
                        />
                    </td>

                    {/* "Upload Image" column for the new item row */}
                    <td className="p-2 text-center">
                        <button className="flex items-center gap-1 text-blue-600 hover:underline">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M.5 9.9a.5.5 0 0 1 .5.5v3.3a.5.5 0 0 0 .5.5h13.5a.5.5 0 0 0
                      .5-.5V10.4a.5.5 0 0 1 1 0v3.3a1.5 1.5 0 0 1-1.5 1.5H1.5a1.5
                      1.5 0 0 1-1.5-1.5V10.4a.5.5 0 0 1 .5-.5z"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M7.646 1.146a.5.5 0 0 1 .708 0l3.182
                      3.182a.5.5 0 0 1-.708.708L8.5 2.707V10a.5.5 0 0 1-1
                      0V2.707L5.146 5.036a.5.5 0 1 1-.708-.708L7.646
                      1.146z"
                                />
                            </svg>
                            <span>Upload</span>
                        </button>
                    </td>

                    <td className="p-2">
                        <button
                            onClick={addItem}
                            className="text-green-600 font-semibold hover:underline"
                        >
                            Add
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ItemsTable;