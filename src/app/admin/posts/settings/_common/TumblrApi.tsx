import React, { useState } from "react";
import AlertBanner from "./AlertBanner";
import TumblrApi2 from "./TumblrApi2";

interface ApiKeyPair {
  apiKey: string;
  apiSecret: string;
  redirectUrl: string;
}

const TumblrApi: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyPair[]>([
    { apiKey: "", apiSecret: "", redirectUrl: "" },
  ]);
  const [authType, setAuthType] = useState("appMethod");

  const handleApiKeyChange = (index: number, value: string) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].apiKey = value;
    setApiKeys(updatedKeys);
  };

  const handleApiSecretChange = (index: number, value: string) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].apiSecret = value;
    setApiKeys(updatedKeys);
  };

  const handleRedirectUrlChange = (index: number, value: string) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].redirectUrl = value;
    setApiKeys(updatedKeys);
  };

  const removeApiKey = (index: number) => {
    const updatedKeys = apiKeys.filter((_, i) => i !== index);
    setApiKeys(updatedKeys);
  };

  const addMore = () => {
    setApiKeys([...apiKeys, { apiKey: "", apiSecret: "", redirectUrl: "" }]);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700">
          Select Authentication Type
        </label>
        <div className="flex items-center mt-2">
          <label className="flex items-center mr-4">
            <input
              type="radio"
              name="authType"
              value="appMethod"
              className="form-radio h-4 w-4 text-blue-600"
              checked={authType === "appMethod"}
              onChange={() => setAuthType("appMethod")}
            />
            <span className="ml-2 text-sm text-gray-700">
              Tumblr APP Method
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="authType"
              value="api"
              className="form-radio h-4 w-4 text-blue-600"
              checked={authType === "api"}
              onChange={() => setAuthType("api")}
            />
            <span className="ml-2 text-sm text-gray-700">Tumblr API</span>
          </label>
        </div>
      </div>

      <AlertBanner
        type="note"
        message="You've reached the maximum of 1 account"
      />

      {authType === "appMethod" ? (
        <div className="mt-8">
          <button className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-600 hover:text-white focus:outline-none border border-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Tumblr Account
          </button>
        </div>
      ) : (
        <>
          {" "}
          <div className="mb-4 flex items-center">
            <div className="w-full">
              <p className="text-sm text-gray-600">
                Before you start publishing your content to Tumblr you need to
                create a Tumblr Application. You can get a step by step tutorial
                on how to create a Tumblr Application on our
                <a href="#" className="text-blue-600 hover:underline">
                  Documentation
                </a>
              </p>
            </div>
          </div>
          <TumblrApi2 />
        </>
      )}
    </div>
  );
};

export default TumblrApi;
