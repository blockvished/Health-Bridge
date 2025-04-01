import React from "react";

interface SelectDropdownProps {
  label: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  options: string[];
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ label, selectedValue, setSelectedValue, options }) => {
  return (
    <div>
      <label htmlFor="dropdown" className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        id="dropdown"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer p-2 appearance-none bg-white"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDropdown;