import React from "react";
import {TimeDropdownProps} from "./utils";
import { FaTimes } from "react-icons/fa";

const TimeDropdown: React.FC<TimeDropdownProps> = ({
  timeOptions,
  selectedTime,
  onSelect,
  onClose
}) => (
  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
    <div className="sticky top-0 bg-white border-b border-gray-100 p-2 flex justify-between items-center">
      <span className="text-sm font-medium">Select Time</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <FaTimes size={14} />
      </button>
    </div>
    <div className="p-1">
      {timeOptions.map((option, i) => (
        <div
          key={i}
          className={`p-2 hover:bg-gray-100 cursor-pointer rounded ${
            option === selectedTime ? "bg-blue-50 text-blue-700" : ""
          }`}
          onClick={() => onSelect(option)}
        >
          {option}
        </div>
      ))}
    </div>
  </div>
);


export default TimeDropdown;