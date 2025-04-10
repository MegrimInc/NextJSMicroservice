"use client";
import React, { useState } from 'react';

interface Drink {
    bar_id: number;
    drink_id: number;
    point_price: number;
    single_price: number | null;
    single_happy_price: number | null;
    double_price: number | null;
    double_happy_price: number | null;
    drink_name: string;
    alcohol_content: string;
    drink_image: string;
    drink_tags: string;
    description: string;
}

const initialDrinks: Drink[] = [
    {
        bar_id: 96,
        drink_id: 1,
        point_price: 10,
        single_price: 8.5,
        single_happy_price: 6.5,
        double_price: 12.5,
        double_happy_price: 10.5,
        drink_name: "Sample Drink",
        alcohol_content: "25-30%",
        drink_image: "",
        drink_tags: "Refreshing, Fruity",
        description: "A sample description of the drink."
    }
];

const DrinksTable: React.FC = () => {
    const [drinks, setDrinks] = useState<Drink[]>(initialDrinks);
    const [newDrink, setNewDrink] = useState<Drink>({
        bar_id: 96,
        drink_id: drinks.length + 1,
        point_price: 0,
        single_price: null,
        single_happy_price: null,
        double_price: null,
        double_happy_price: null,
        drink_name: "",
        alcohol_content: "",
        drink_image: "",
        drink_tags: "",
        description: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number) => {
        const { name, value } = e.target;
        setDrinks(drinks.map(drink => drink.drink_id === id ? { ...drink, [name]: value } : drink));
    };

    const handleNewDrinkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewDrink({ ...newDrink, [name]: value });
    };

    const addDrink = () => {
        setDrinks([...drinks, { ...newDrink, drink_id: drinks.length + 1 }]);
        setNewDrink({
            bar_id: 96,
            drink_id: drinks.length + 2,
            point_price: 0,
            single_price: null,
            single_happy_price: null,
            double_price: null,
            double_happy_price: null,
            drink_name: "",
            alcohol_content: "",
            drink_image: "",
            drink_tags: "",
            description: ""
        });
    };

    const deleteDrink = (id: number) => {
        setDrinks(drinks.filter(drink => drink.drink_id !== id));
    };

    return (
        <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Drinks</h2>
            <table className="min-w-full table-auto">
                <thead className="bg-blue-700 text-white">
                <tr>
                    <th className="py-2 px-4 border-b uppercase text-sm">Drink ID</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Point Price</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Single Price</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Single Happy Price</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Double Price</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Double Happy Price</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Drink Name</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Alcohol Content</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Drink Image</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Tags</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Description</th>
                    <th className="py-2 px-4 border-b uppercase text-sm">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {drinks.map((drink) => (
                    <tr key={drink.drink_id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-gray-800">{drink.drink_id}</td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="number"
                                name="point_price"
                                value={drink.point_price}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="number"
                                name="single_price"
                                value={drink.single_price || ""}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="number"
                                name="single_happy_price"
                                value={drink.single_happy_price || ""}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="number"
                                name="double_price"
                                value={drink.double_price || ""}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="number"
                                name="double_happy_price"
                                value={drink.double_happy_price || ""}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="text"
                                name="drink_name"
                                value={drink.drink_name}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="text"
                                name="alcohol_content"
                                value={drink.alcohol_content}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="text"
                                name="drink_image"
                                value={drink.drink_image}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Image URL"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="text"
                                name="drink_tags"
                                value={drink.drink_tags}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <input
                                type="text"
                                name="description"
                                value={drink.description}
                                onChange={(e) => handleInputChange(e, drink.drink_id)}
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </td>
                        <td className="py-2 px-4 border-b">
                            <button onClick={() => deleteDrink(drink.drink_id)} className="text-red-500 hover:underline">
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                <tr className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-gray-800">{newDrink.drink_id}</td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="number"
                            name="point_price"
                            value={newDrink.point_price}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="number"
                            name="single_price"
                            value={newDrink.single_price || ""}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="number"
                            name="single_happy_price"
                            value={newDrink.single_happy_price || ""}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="number"
                            name="double_price"
                            value={newDrink.double_price || ""}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="number"
                            name="double_happy_price"
                            value={newDrink.double_happy_price || ""}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="text"
                            name="drink_name"
                            value={newDrink.drink_name}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="New Drink"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="text"
                            name="alcohol_content"
                            value={newDrink.alcohol_content}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="text"
                            name="drink_image"
                            value={newDrink.drink_image}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Image URL"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="text"
                            name="drink_tags"
                            value={newDrink.drink_tags}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <input
                            type="text"
                            name="description"
                            value={newDrink.description}
                            onChange={handleNewDrinkChange}
                            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </td>
                    <td className="py-2 px-4 border-b">
                        <button onClick={addDrink} className="text-green-500 hover:underline">
                            Add
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DrinksTable;
