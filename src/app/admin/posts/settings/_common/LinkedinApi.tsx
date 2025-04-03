import React, { useState } from "react";
import AlertBanner from "./AlertBanner";
import FacebookGraphApiSettings from "./FacebookGraphApiSettings";
import LinkedinApi2 from "./LinkedinApi2";

interface ApiKeyPair {
  apiKey: string;
  apiSecret: string;
  redirectUrl: string;
}

const LinkedinApi: React.FC = () => {
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
    <div className="w-full space-y-6"> {/* Added padding and space-y for overall spacing */}
      <div className="mb-8"> {/* Increased margin bottom */}
        <p className="text-sm text-gray-600 leading-relaxed"> {/* Added leading-relaxed */}
          Before you start publishing your content to LinkedIn you need to
          create a LinkedIn Application. You can get a step by step tutorial
          on how to create a LinkedIn Application on ourBefore you start
          publishing your content to LinkedIn you need to create a LinkedIn
          Application. You can get a step by step tutorial on how to create a
          LinkedIn Application on our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Documentation
          </a>
        </p>
      </div>

      <div className="mb-8 flex items-center"> {/* Increased margin bottom */}
        <div className="w-1/4">
          <label className="text-sm font-medium text-gray-700">
            Allowing permissions
          </label>
        </div>
        <div className="w-3/4">
          <p className="text-sm text-gray-600 leading-relaxed"> {/* Added leading-relaxed */}
            Posting content to your chosen LinkedIn personal account requires
            you to grant extended permissions. If you want to use this feature
            you should grant the extended permissions now.
          </p>
        </div>
      </div>

      <div className="mb-8 flex items-center"> {/* Increased margin bottom */}
        <div className="w-1/4">
          <label className="text-sm font-medium text-gray-700">
            Enable Company Pages
          </label>
        </div>
        <div className="w-3/4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="mb-8"> {/* Increased margin bottom */}
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
              LinkedIn APP Method (Recommended)
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
            <span className="ml-2 text-sm text-gray-700">LinkedIn API</span>
          </label>
        </div>
      </div>

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
            Add LinkedIn Account
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-4"> {/* Added space-y for internal spacing */}
          <AlertBanner
            type="alert"
            message="As LinkedIn made some changes recently, graph API have some limitation. Graph API working with old App and this option just for backwards compatibility."
          />

          <LinkedinApi2 />
        </div>
      )}
    </div>
  );
};

export default LinkedinApi;