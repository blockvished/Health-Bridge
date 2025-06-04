// src/app/doctor/domain/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { FaCog, FaPlus, FaTimes, FaCopy } from "react-icons/fa";

interface DomainData {
  id: number;
  currentUrl: string;
  customDomain: string | null;
  createdAt: string;
  status: "active" | "inactive";
}

interface DnsSettings {
  id: number;
  title: string;
  shortDetails: string;
  details: string;
  serverIp: string;
  type1: string;
  host1: string;
  value1: string;
  ttl1: string;
  type2: string;
  host2: string;
  value2: string;
  ttl2: string;
  createdAt: string;
  updatedAt: string;
}

const DomainTable = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDnsSettings, setShowDnsSettings] = useState(false);
  const [newCustomDomain, setNewCustomDomain] = useState("");
  const [domains, setDomains] = useState<DomainData[]>([]);
  const [dnsSettings, setDnsSettings] = useState<DnsSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [dnsLoading, setDnsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Fetch domains on component mount
  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    setFetchLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/doctor/custom_domain", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authentication token if required
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch domains.");
        return;
      }

      setDomains(data.data || []);
    } catch (err) {
      console.error("Error fetching domains:", err);
      setError("An unexpected error occurred while fetching domains.");
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchDnsSettings = async () => {
    setDnsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/domain-settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch DNS settings.");
        return;
      }

      setDnsSettings(data);
    } catch (err) {
      console.error("Error fetching DNS settings:", err);
      setError("An unexpected error occurred while fetching DNS settings.");
    } finally {
      setDnsLoading(false);
    }
  };

  const handleDnsSettingsClick = async () => {
    setShowDnsSettings(true);
    if (!dnsSettings) {
      await fetchDnsSettings();
    }
  };

  const handleCreateNewClick = () => {
    setShowCreateForm(true);
    setNewCustomDomain("");
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!newCustomDomain.trim()) {
      setError("Custom domain cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/doctor/custom_domain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authentication token if required
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ customDomain: newCustomDomain.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add custom domain.");
        return;
      }

      alert("Custom domain added successfully!");
      setShowCreateForm(false);
      setNewCustomDomain("");

      // Refresh the domains list
      await fetchDomains();

    } catch (err) {
      console.error("Error submitting custom domain:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(field);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (fetchLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 md:m-8 lg:m-8">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading domains...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:m-8 lg:m-8">
      <div className="flex justify-between items-center pb-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Domain</h2>
        <div className="flex gap-1.5">
          <button 
            onClick={handleDnsSettingsClick}
            className="bg-red-500 text-white px-2.5 py-1 rounded flex items-center gap-1 text-sm hover:bg-red-600"
          >
            <FaCog className="text-xs" /> DNS Settings
          </button>
          <button
            onClick={handleCreateNewClick}
            className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded flex items-center gap-1 text-sm hover:bg-gray-300"
          >
            <FaPlus className="text-xs" /> Create New
          </button>
        </div>
      </div>

      {error && !showCreateForm && !showDnsSettings && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchDomains}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* DNS Settings Modal/Panel */}
      {showDnsSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">DNS Settings Configuration</h3>
                <button
                  onClick={() => setShowDnsSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {dnsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">Loading DNS settings...</div>
                </div>
              ) : dnsSettings ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="font-medium text-blue-800 mb-2">{dnsSettings.title}</h4>
                    <p className="text-blue-700 text-sm mb-2">{dnsSettings.shortDetails}</p>
                    {dnsSettings.details && (
                      <p className="text-blue-600 text-sm">{dnsSettings.details}</p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-md p-4">
                    <h5 className="font-medium text-gray-800 mb-2">Server Information</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Server IP:</span>
                      <code className="bg-white px-2 py-1 rounded border text-sm">{dnsSettings.serverIp}</code>
                      <button
                        onClick={() => copyToClipboard(dnsSettings.serverIp, 'serverIp')}
                        className="text-blue-600 hover:text-blue-800"
                        title="Copy to clipboard"
                      >
                        <FaCopy className="text-xs" />
                      </button>
                      {copySuccess === 'serverIp' && (
                        <span className="text-green-600 text-xs">Copied!</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-800">DNS Records to Add:</h5>
                    
                    {/* DNS Record 1 */}
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 border-b">
                        <h6 className="font-medium text-gray-800">Record 1: {dnsSettings.type1}</h6>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm w-full">{dnsSettings.type1}</code>
                              <button
                                onClick={() => copyToClipboard(dnsSettings.type1, 'type1')}
                                className="text-blue-600 hover:text-blue-800"
                                title="Copy to clipboard"
                              >
                                <FaCopy className="text-xs" />
                              </button>
                              {copySuccess === 'type1' && <span className="text-green-600 text-xs">Copied!</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Host/Name</label>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm w-full">{dnsSettings.host1}</code>
                              <button
                                onClick={() => copyToClipboard(dnsSettings.host1, 'host1')}
                                className="text-blue-600 hover:text-blue-800"
                                title="Copy to clipboard"
                              >
                                <FaCopy className="text-xs" />
                              </button>
                              {copySuccess === 'host1' && <span className="text-green-600 text-xs">Copied!</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">TTL</label>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm w-full">{dnsSettings.ttl1}</code>
                              <button
                                onClick={() => copyToClipboard(dnsSettings.ttl1, 'ttl1')}
                                className="text-blue-600 hover:text-blue-800"
                                title="Copy to clipboard"
                              >
                                <FaCopy className="text-xs" />
                              </button>
                              {copySuccess === 'ttl1' && <span className="text-green-600 text-xs">Copied!</span>}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Value/Points to</label>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">{dnsSettings.value1}</code>
                            <button
                              onClick={() => copyToClipboard(dnsSettings.value1, 'value1')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Copy to clipboard"
                            >
                              <FaCopy className="text-xs" />
                            </button>
                            {copySuccess === 'value1' && <span className="text-green-600 text-xs">Copied!</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DNS Record 2 */}
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 border-b">
                        <h6 className="font-medium text-gray-800">Record 2: {dnsSettings.type2}</h6>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm w-full">{dnsSettings.type2}</code>
                              <button
                                onClick={() => copyToClipboard(dnsSettings.type2, 'type2')}
                                className="text-blue-600 hover:text-blue-800"
                                title="Copy to clipboard"
                              >
                                <FaCopy className="text-xs" />
                              </button>
                              {copySuccess === 'type2' && <span className="text-green-600 text-xs">Copied!</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Host/Name</label>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm w-full">{dnsSettings.host2}</code>
                              <button
                                onClick={() => copyToClipboard(dnsSettings.host2, 'host2')}
                                className="text-blue-600 hover:text-blue-800"
                                title="Copy to clipboard"
                              >
                                <FaCopy className="text-xs" />
                              </button>
                              {copySuccess === 'host2' && <span className="text-green-600 text-xs">Copied!</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">TTL</label>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm w-full">{dnsSettings.ttl2}</code>
                              <button
                                onClick={() => copyToClipboard(dnsSettings.ttl2, 'ttl2')}
                                className="text-blue-600 hover:text-blue-800"
                                title="Copy to clipboard"
                              >
                                <FaCopy className="text-xs" />
                              </button>
                              {copySuccess === 'ttl2' && <span className="text-green-600 text-xs">Copied!</span>}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Value/Points to</label>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">{dnsSettings.value2}</code>
                            <button
                              onClick={() => copyToClipboard(dnsSettings.value2, 'value2')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Copy to clipboard"
                            >
                              <FaCopy className="text-xs" />
                            </button>
                            {copySuccess === 'value2' && <span className="text-green-600 text-xs">Copied!</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h6 className="font-medium text-yellow-800 mb-2">Important Notes:</h6>
                    <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                      <li>DNS changes may take up to 24-48 hours to propagate globally</li>
                      <li>{`Make sure to add both records to your domain's DNS settings`}</li>
                      <li>Contact your domain registrar or hosting provider if you need help adding these records</li>
                      <li>You can use online DNS checker tools to verify the records are properly configured</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Failed to load DNS settings</p>
                  <button
                    onClick={fetchDnsSettings}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDnsSettings(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-md font-medium mb-3">Add New Custom Domain</h3>
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div>
              <label htmlFor="customDomain" className="block text-sm font-medium text-gray-700">
                Custom Domain Name:
              </label>
              <input
                type="text"
                id="customDomain"
                name="customDomain"
                value={newCustomDomain}
                onChange={(e) => setNewCustomDomain(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., mydoctorswebsite.com"
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setError(null);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Domain"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b border-gray-300">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Current URL</th>
              <th className="p-2 text-left">Custom Domain</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {domains.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No domain details found.
                </td>
              </tr>
            ) : (
              domains.map((domain, index) => (
                <tr key={domain.id} className="border-t border-gray-300">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{domain.currentUrl}</td>
                  <td className="p-2">{domain.customDomain || 'N/A'}</td>
                  <td className="p-2">{new Date(domain.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className={`p-2 ${domain.status === "active" ? "text-green-600" : "text-red-600"} capitalize`}>{domain.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DomainTable;