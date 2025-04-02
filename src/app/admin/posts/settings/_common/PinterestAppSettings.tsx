import React, { useState } from "react";
import AlertBanner from "./AlertBanner";

interface ApiKeyPair {
  appId: string;
  appSecret: string;
}

const PinterestAppSettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyPair[]>([
    { appId: "", appSecret: "" },
  ]);

  const handleAppIdChange = (index: number, value: string) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].appId = value;
    setApiKeys(updatedKeys);
  };

  const handleAppSecretChange = (index: number, value: string) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].appSecret = value;
    setApiKeys(updatedKeys);
  };

  const removeApiKey = (index: number) => {
    const updatedKeys = apiKeys.filter((_, i) => i !== index);
    setApiKeys(updatedKeys);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row mb-4">
        <div className="w-full md:w-1/4 mb-2 md:mb-0">
          <h3 className="text-base font-medium text-gray-700">
            Pinterest Application
          </h3>
        </div>
        <div className="w-full md:w-3/4">
          <p className="text-sm text-gray-600">
            Before you can start publishing your content to Pinterest you need
            to create a Pinterest Application. You can get a step by step
            tutorial on how to create a Pinterest Application on our
            <a href="#" className="text-blue-600 hover:underline">
              Documentation
            </a>
            .
          </p>
        </div>
      </div>

      <AlertBanner
        type="note"
        message="You need to define redirect uri as mentioned below when you create Pinterest Application. Otherwise pinterest won't redirect you to the correct page after authorization. Replace {app_id} with your pinterest application key/id. https://post.livedoctors.in/settings/"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="col-span-1">
          <h3 className="text-base font-medium text-gray-700">Enter App ID/API Key</h3>
        </div>
        <div className="col-span-1">
          <h3 className="text-base font-medium text-gray-700">Enter App Secret</h3>
        </div>
        <div className="col-span-1">
          <h3 className="text-base font-medium text-gray-700">Allowing permissions</h3>
        </div>
      </div>

      {apiKeys.map((keyPair, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-center">
          <div className="col-span-1">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter Pinterest App ID / API Key"
              value={keyPair.appId}
              onChange={(e) => handleAppIdChange(index, e.target.value)}
            />
          </div>
          <div className="col-span-1">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter Pinterest App Secret"
              value={keyPair.appSecret}
              onChange={(e) => handleAppSecretChange(index, e.target.value)}
            />
          </div>
          <div className="col-span-1">
          </div>
          <div className="col-span-3 flex justify-end">
            {index > 0 && (
              <button
                onClick={() => removeApiKey(index)}
                className="p-1 bg-red-100 rounded-full text-red-500 hover:bg-red-200 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}

      <AlertBanner
        type="alert"
        message="You've reached the maximum of 1 account"
      />
    </div>
  );
};

export default PinterestAppSettings;