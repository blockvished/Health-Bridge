import React from 'react';
import { AlertTriangle, Info } from 'lucide-react'; // Import both icons

interface AlertBannerProps {
  type: 'alert' | 'note'; // Define the type of banner
  message: string;
  error?: string; // Optional error message for alert type
}

const AlertBanner: React.FC<AlertBannerProps> = ({ type, message, error }) => {
  const isAlert = type === 'alert';

  return (
    <div
      className={`${
        isAlert
          ? 'bg-red-100 border border-red-400 text-red-700'
          : 'bg-gray-100 border border-gray-300 text-gray-700'
      } px-4 py-3 rounded relative mb-4`}
      role="alert"
    >
      <strong className="font-bold flex items-center">
        {isAlert ? (
          <AlertTriangle className="h-5 w-5 mr-2" />
        ) : (
          <Info className="h-5 w-5 mr-2 text-blue-600" />
        )}
        {isAlert ? 'Alert: ' : 'Note: '}
        {message}
      </strong>
      {isAlert && error && <span className="block sm:inline">{error}</span>}
    </div>
  );
};

export default AlertBanner;