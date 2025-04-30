import React, { useState, useEffect } from "react";
import { FaTimes, FaDownload, FaSpinner } from "react-icons/fa";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  filename: string;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  filename,
}) => {
  const [loading, setLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset states when opening modal
      setLoading(true);
      setPreviewError(false);

      // Determine file type based on extension
      const extension = filename.split('.').pop()?.toLowerCase();
      if (extension) {
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
          setFileType('image');
        } else if (extension === 'pdf') {
          setFileType('pdf');
        } else {
          setFileType('other');
        }
      } else {
        setFileType('other');
      }
    }
  }, [isOpen, filename]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setPreviewError(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {filename}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer"
              title="Download"
            >
              <FaDownload />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer"
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 relative h-full">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            </div>
          )}

          {fileType === 'image' && (
            <div className="flex items-center justify-center h-full">
              <img
                src={documentUrl}
                alt={filename}
                className="max-w-full max-h-full object-contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          )}

          {fileType === 'pdf' && (
            <div className="h-full w-full">
              <iframe
                src={`${documentUrl}#toolbar=0`}
                className="w-full h-full"
                title={filename}
                onLoad={() => setLoading(false)}
                onError={handleImageError}
              />
            </div>
          )}

          {(fileType === 'other' || previewError) && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  {previewError 
                    ? "Unable to preview this file type" 
                    : "This file type cannot be previewed directly"}
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <FaDownload /> Download File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;