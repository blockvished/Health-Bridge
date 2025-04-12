import { FaClock } from "react-icons/fa";
import { TimeInputProps } from "./utils";

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onClick,
  placeholder = "Select time",
  readOnly = true,
  hasError = false
}) => (
  <div className="relative flex-1">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <FaClock className={hasError ? "text-red-400" : "text-gray-400"} />
    </div>
    <input
      type="text"
      value={value}
      onClick={onClick}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`border ${hasError ? "border-red-300 bg-red-50" : "border-gray-200"} p-2 pl-10 rounded-md w-full bg-white cursor-pointer focus:outline-none focus:ring-2 ${hasError ? "focus:ring-red-500" : "focus:ring-blue-500"} focus:border-transparent transition-colors`}
    />
  </div>
);

export default TimeInput;