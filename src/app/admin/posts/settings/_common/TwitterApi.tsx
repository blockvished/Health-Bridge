import React, { useState } from 'react';

interface ApiKeyPair {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

const TwitterApi: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyPair[]>([
    { apiKey: '', apiSecret: '', accessToken: '', accessTokenSecret: '' },
  ]);

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

  const handleAccessTokenChange = (index: number, value: string) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].accessToken = value;
    setApiKeys(updatedKeys);
  };

  const handleAccessTokenSecretChange = (index: number, value: string) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].accessTokenSecret = value;
    setApiKeys(updatedKeys);
  };

  const removeApiKey = (index: number) => {
    const updatedKeys = apiKeys.filter((_, i) => i !== index);
    setApiKeys(updatedKeys);
  };

  const addMore = () => {
    setApiKeys([...apiKeys, { apiKey: '', apiSecret: '', accessToken: '', accessTokenSecret: '' }]);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-700">Twitter Application</h3>
        <p className="text-sm text-gray-600">
          Before you start publishing your content to Twitter you need to create a Twitter Application. You can get a step by step
          tutorial on how to create a Twitter Application on our{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Documentation
          </a>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <div>
          <h3 className="text-base font-medium text-gray-700">API Key</h3>
        </div>
        <div>
          <h3 className="text-base font-medium text-gray-700">API Secret</h3>
        </div>
        <div>
          <h3 className="text-base font-medium text-gray-700">Access Token</h3>
        </div>
        <div>
          <h3 className="text-base font-medium text-gray-700">Access Token Secret</h3>
        </div>
      </div>

      {apiKeys.map((keyPair, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 items-center sm:border sm:rounded-md sm:border-gray-200"> {/* Conditional border here */}
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter Twitter API Key"
              value={keyPair.apiKey}
              onChange={(e) => handleApiKeyChange(index, e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter Twitter API Secret"
              value={keyPair.apiSecret}
              onChange={(e) => handleApiSecretChange(index, e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter Twitter Access Token"
              value={keyPair.accessToken}
              onChange={(e) => handleAccessTokenChange(index, e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter Twitter Access Token Secret"
              value={keyPair.accessTokenSecret}
              onChange={(e) => handleAccessTokenSecretChange(index, e.target.value)}
            />
            {index > 0 && (
              <button
                onClick={() => removeApiKey(index)}
                className="p-1 bg-red-100 rounded-full text-red-500 hover:bg-red-200 focus:outline-none ml-2"
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

      <div className="mt-4 flex justify-end">
        <button
          onClick={addMore}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add more
        </button>
      </div>
    </div>
  );
};

export default TwitterApi;