import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface AlertBannerProps {
  type: 'alert' | 'note';
  message: string;
  error?: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ type, message, error }) => {
  const isAlert = type === 'alert';

  return (
    <div
      className={`${
        isAlert
          ? 'bg-red-100 border border-red-400 text-red-700'
          : 'bg-gray-100 border border-gray-300 text-gray-700'
      } px-2 py-1.5 rounded relative mb-4 block text-xs`} // Reduced padding, height, and font size
      style={{ width: 'fit-content' }}
      role="alert"
    >
      <strong className="font-semibold flex items-center">
        {isAlert ? (
          <AlertTriangle className="h-3 w-3 mr-1" /> // Reduced icon size
        ) : (
          <Info className="h-3 w-3 mr-1 text-blue-600" /> // Reduced icon size
        )}
        {isAlert ? 'Alert: ' : 'Note: '}
        {message}
      </strong>
      {isAlert && error && <span className="block sm:inline">{error}</span>}
    </div>
  );
};

export default AlertBanner;