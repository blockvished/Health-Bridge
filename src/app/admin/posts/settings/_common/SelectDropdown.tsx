import React from "react";

// Single Select Dropdown
interface SingleSelectDropdownProps {
  label: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  options: string[];
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  label,
  selectedValue,
  setSelectedValue,
  options,
}) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row items-start">
      <label
        htmlFor="single-select-dropdown"
        className="block text-sm font-medium text-gray-700 mb-2 md:mb-0 md:w-3/10 flex items-center"
        style={{ lineHeight: "2.5rem" }} // Match input height
      >
        {label}
      </label>
      <select
        id="single-select-dropdown"
        className="mt-1 block w-full md:w-7/10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer p-2 appearance-none bg-white"
        value={selectedValue}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setSelectedValue(e.target.value)
        }
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

// Multi Select Dropdown
interface MultiSelectDropdownProps {
  label: string;
  selectedValue: string[];
  setSelectedValue: (value: string[]) => void;
  options: string[];
  description?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  selectedValue,
  setSelectedValue,
  options,
  description,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedValue(selectedOptions);
  };

  const handleSelectAll = () => {
    setSelectedValue(options);
  };

  const handleSelectNone = () => {
    setSelectedValue([]);
  };

  return (
    <div className="mb-4 flex flex-col md:flex-row items-start">
      <label
        htmlFor="multi-select-dropdown"
        className="block text-sm font-medium text-gray-700 mb-2 md:mb-0 md:w-3/10 flex items-center"
        style={{ lineHeight: "2.5rem" }} // Match input height
      >
        {label}
      </label>
      <div className="md:w-7/10">
        <select
          id="multi-select-dropdown"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer p-2 appearance-none bg-white"
          value={selectedValue}
          onChange={handleChange}
          multiple
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {description && (
          <p className="text-sm text-gray-500 mt-4">{description}</p>
        )}
        <div className="mt-2 flex space-x-2">
          <button
            onClick={handleSelectAll}
            className="bg-blue-500 text-gray-100 px-4 py-2 rounded"
          >
            Select All
          </button>
          <button
            onClick={handleSelectNone}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
          >
            Select None
          </button>
        </div>
      </div>
    </div>
  );
};

export { SingleSelectDropdown, MultiSelectDropdown };