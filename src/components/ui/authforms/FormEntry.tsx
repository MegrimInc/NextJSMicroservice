import React from 'react';

type FormEntryProps = {
  type: string;
  name: string;
  label: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pattern?: string;
  disabled?: boolean;
  maxLength?: number;
};

export default function FormEntry({
  type,
  name,
  label,
  value,
  handleChange,
  pattern,
  disabled = false,
  maxLength,
}: FormEntryProps) {
  return (
    <div>
      <label className="block text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        pattern={pattern}
        maxLength={maxLength}
        required
        className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none ${
          disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'focus:ring focus:ring-indigo-300'
        }`}
      />
    </div>
  );
}
