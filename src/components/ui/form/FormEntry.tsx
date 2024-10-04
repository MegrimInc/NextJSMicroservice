import React from "react";

type FormEntryProps = {
    type: string;
    name: string;
    label: string;
    value: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormEntry({
                                      type,
                                      name,
                                      label,
                                      value,
                                      handleChange,
                                  }: FormEntryProps) {
    return (
        <div>
            <label className="block text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                required
            />
        </div>
    );
}
