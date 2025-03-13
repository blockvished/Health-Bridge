"use client";

import React, { use } from "react";

interface QRCodeDisplayProps {
  qrSrc: string; // URL of the existing QR code image
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrSrc }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-xl p-6">
        <button className="text-blue-600 hover:underline mb-4">🔗 Share QR Code</button>
        <div className="border p-4 rounded-lg w-fit">
          <img src={qrSrc} alt="QR Code" className="w-56 h-56" />
        </div>
        <button
          onClick={handleDownload}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          ⬇ Download
        </button>
      </div>
    </div>
  );
};

// Example usage
const QRCodePage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <QRCodeDisplay qrSrc="/path-to-your-existing-qrcode.png" />
    </div>
  );
};

export default QRCodePage;
