"use client";

import React from "react";

const QRCodePage: React.FC = () => {
  const qrSrc = "/path-to-your-existing-qrcode.png"; // Replace with actual QR code URL

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">QR Code</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md">
            🔗 Share QR Code
          </button>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
          <img src={qrSrc} alt="QR Code" className="w-56 h-56 rounded-lg border" />
          <button
            onClick={handleDownload}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            ⬇ Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
