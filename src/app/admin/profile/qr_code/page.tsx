"use client";

import React from "react";
import { FaShareAlt, FaDownload } from "react-icons/fa";

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
    <div className="w-full">
      <div className="bg-white shadow-md rounded-xl p-4 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-semibold text-gray-800">QR Code</h1>
          <button className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
            <FaShareAlt className="mr-2" /> Share QR Code
          </button>
        </div>

        <div className="flex flex-col p-6 rounded-lg ">
          <img src={qrSrc} alt="QR Code" className="w-77 h-77 rounded-lg border" />
          <button
            onClick={handleDownload}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center w-1/3"
          >
            <FaDownload className="mr-2" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
