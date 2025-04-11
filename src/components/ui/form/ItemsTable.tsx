"use client";
import React, { useState } from "react";

interface Item {
    item_id: number;
    regular_price: number;
    discount_price: number;
    point_price: number;
    name: string;
    description: string;
    categories: string;
}

const initialItems: Item[] = [
    {
        item_id: 1,
        regular_price: 8.5,
        discount_price: 6.5,
        point_price: 10,
        name: "Sample Item",
        description: "A sample product description.",
        categories: "Fruity, Refreshing",
    },
];

const ItemsTable: React.FC = () => {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [newItem, setNewItem] = useState<Item>({
        item_id: items.length + 1,
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
                item.item_id === id ? { ...item, [name]: value } : item
            )
        );
    };

    const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const addItem = () => {
        setItems([...items, { ...newItem, item_id: items.length + 1 }]);
        setNewItem({
            item_id: items.length + 2,
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
        <div className="overflow-x-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-black">Manage Items</h2>
            <table className="min-w-full table-auto text-black">
                <thead className="bg-gray-100">
                <tr>
                    <th className="py-2 px-4 text-left text-sm uppercase">Item ID</th>
                    <th className="py-2 px-4 text-left text-sm uppercase">Regular Price</th>
                    <th className="py-2 px-4 text-left text-sm uppercase">Discount Price</th>
                    <th className="py-2 px-4 text-left text-sm uppercase">Point Price</th>
                    <th className="py-2 px-4 text-left text-sm uppercase">Name</th>
                    <th className="py-2 px-4 text-left text-sm uppercase">Description</th>
                    <th className="py-2 px-4 text-left text-sm uppercase">Categories</th>
                    <th className="py-2 px-4 text-left text-sm uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                    <tr key={item.item_id} className="hover:bg-gray-50">
                        <td className="py-2 px-4">{item.item_id}</td>
                        <td className="py-2 px-4">
                            <input
                                type="number"
                                name="regular_price"
                                value={item.regular_price}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </td>
                        <td className="py-2 px-4">
                            <input
                                type="number"
                                name="discount_price"
                                value={item.discount_price}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </td>
                        <td className="py-2 px-4">
                            <input
                                type="number"
                                name="point_price"
                                value={item.point_price}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </td>
                        <td className="py-2 px-4">
                            <input
                                type="text"
                                name="name"
                                value={item.name}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </td>
                        <td className="py-2 px-4">
                            <input
                                type="text"
                                name="description"
                                value={item.description}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </td>
                        <td className="py-2 px-4">
                            <input
                                type="text"
                                name="categories"
                                value={item.categories}
                                onChange={(e) => handleInputChange(e, item.item_id)}
                                className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </td>
                        <td className="py-2 px-4">
                            <button
                                onClick={() => deleteItem(item.item_id)}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}

                {/* Row for new item */}
                <tr className="hover:bg-gray-50">
                    <td className="py-2 px-4">{newItem.item_id}</td>
                    <td className="py-2 px-4">
                        <input
                            type="number"
                            name="regular_price"
                            value={newItem.regular_price}
                            onChange={handleNewItemChange}
                            className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </td>
                    <td className="py-2 px-4">
                        <input
                            type="number"
                            name="discount_price"
                            value={newItem.discount_price}
                            onChange={handleNewItemChange}
                            className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </td>
                    <td className="py-2 px-4">
                        <input
                            type="number"
                            name="point_price"
                            value={newItem.point_price}
                            onChange={handleNewItemChange}
                            className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </td>
                    <td className="py-2 px-4">
                        <input
                            type="text"
                            name="name"
                            value={newItem.name}
                            onChange={handleNewItemChange}
                            className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholder="New Item"
                        />
                    </td>
                    <td className="py-2 px-4">
                        <input
                            type="text"
                            name="description"
                            value={newItem.description}
                            onChange={handleNewItemChange}
                            className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </td>
                    <td className="py-2 px-4">
                        <input
                            type="text"
                            name="categories"
                            value={newItem.categories}
                            onChange={handleNewItemChange}
                            className="w-full px-2 py-1 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </td>
                    <td className="py-2 px-4">
                        <button onClick={addItem} className="text-green-500 hover:underline">
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
