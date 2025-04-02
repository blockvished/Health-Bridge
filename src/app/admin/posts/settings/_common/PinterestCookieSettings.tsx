import React, { useState } from "react";

interface ApiKeyPair {
  sessionId: string;
}

const PinterestCookieSettings: React.FC = () => {
  const [sessionIds, setSessionIds] = useState<ApiKeyPair[]>([
    { sessionId: "" },
  ]);

  const handleSessionIdChange = (index: number, value: string) =>
    setSessionIds((prev) =>
      prev.map((session, i) => (i === index ? { sessionId: value } : session))
    );

  const addMore = () => console.log("hello");

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row mb-4">
        <div className="w-full md:w-1/4 mb-2 md:mb-0">
          <h3 className="text-base font-medium text-gray-700">
            Pinterest Cookie
          </h3>
        </div>
        <div className="w-full md:w-3/4">
          <p className="text-sm text-gray-600">
            Here you do not need to create an APP in Pinterest, you simply need
            to login to your pinterest account and copy _pinterest_sess and
            paste it to here. You can get a step by step tutorial on how to
            create a Pinterest Application on our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Documentation
            </a>
          </p>
        </div>
      </div>

      {sessionIds.map((session, index) => (
        <div key={index} className="flex flex-col md:flex-row mb-4">
          <div className="w-full md:w-1/4 mb-2 md:mb-0">
            <h3 className="text-base font-medium text-gray-700">
              Session ID {index + 1}
            </h3>
          </div>
          <div className="w-full md:w-3/4 flex flex-col">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder=""
              value={session.sessionId}
              onChange={(e) => handleSessionIdChange(index, e.target.value)}
            />
            {index === sessionIds.length - 1 && (
              <div className="mt-2">
                <button
                  onClick={addMore}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition-colors duration-200 cursor-pointer"
                >
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
                  Add Pinterest Account
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PinterestCookieSettings;
