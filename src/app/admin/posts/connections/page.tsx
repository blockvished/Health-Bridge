"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  BriefcaseBusiness,
  Instagram,
  Building2,
  UserCircle,
  AlertCircle,
} from "lucide-react";
// import { toast } from "react-hot-toast";

export default function ConnectionsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [processingPlatform, setProcessingPlatform] = useState(null);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);

  // Track connections for each platform separately
  const [socialConnections, setSocialConnections] = useState({
    facebook: { connected: false, account: "", autoposting: false, disconnected: false },
    twitter: { connected: false, account: "", autoposting: false, disconnected: false },
    linkedin: { connected: false, account: "", autoposting: false, disconnected: false },
    instagram: { connected: false, account: "", autoposting: false, disconnected: false },
    googleBusiness: { connected: false, account: "", autoposting: false, disconnected: false },
  });

  // Fetch connections from API
  const fetchConnections = async () => {
    setIsLoadingConnections(true);
    try {
      const response = await fetch("/api/auth/connections/get_all");
      if (response.ok) {
        const data = await response.json();
        console.log("API connections data:", data);
        
        // Update social connections based on API data
        const updatedConnections = { ...socialConnections };
        
        data.connections.forEach(connection => {
          if (updatedConnections[connection.provider]) {
            updatedConnections[connection.provider] = {
              connected: !connection.expired && !connection.disconnected,
              account: connection.accountName,
              autoposting: connection.autoposting,
              id: connection.id,
              accessToken: connection.accessToken,
              refreshToken: connection.refreshToken,
              disconnected: connection.disconnected
            };
          }
        });
        
        setSocialConnections(updatedConnections);
      } else {
        console.error("Failed to fetch connections");
        setConnectionError("Failed to load your connections");
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
      setConnectionError("Could not connect to the server");
    } finally {
      setIsLoadingConnections(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (session) {
      const provider = session.provider || "twitter";
      console.log("Session data:", session);

      const saveDataToBackend = async () => {
        try {
          const response = await fetch("/api/auth/connections/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              accessToken: session.accessToken,
              expires: session.expires,
              expiresAt: session.expiresAt,
              provider: session.provider,
              refreshToken: session.refreshToken,
              user: {
                email: session.user?.email,
                image: session.user?.image,
                name: session.user?.name,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Backend response:", data);
            
            // Refresh the connections list after saving a new connection
            fetchConnections();
          } else {
            console.error("Failed to save connection data to backend");
            setConnectionError("Failed to save connection");
          }
        } catch (error) {
          console.error("Error sending data to backend:", error);
          setConnectionError("Connection error");
        }
      };

      saveDataToBackend();
    }
  }, [session]);

  // Helper function to get platform display name
  const getPlatformName = (platform) => {
    const names = {
      facebook: "Facebook Page",
      twitter: "X Profile",
      linkedin: "LinkedIn Profile",
      linkedinCompany: "LinkedIn Company Page",
      instagram: "Instagram Profile",
      googleBusiness: "Google Business Profile",
    };
    return names[platform] || platform;
  };

  const handleToggleConnection = async (platform) => {
    setProcessingPlatform(platform);
    setIsLoading(true);

    if (socialConnections[platform].connected) {
      try {
        const response = await fetch(`/api/auth/connections/disconnect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: platform,
            connectionId: socialConnections[platform].id
          }),
        });

        if (response.ok) {
          // Update local state
          setSocialConnections((prev) => ({
            ...prev,
            [platform]: {
              ...prev[platform],
              connected: false,
              disconnected: true
            },
          }));
          
          // You could add toast notification here
          // toast.success(`Successfully disconnected ${getPlatformName(platform)}`);
        } else {
          const errorData = await response.json();
          console.error("Failed to disconnect account:", errorData);
          setConnectionError(`Failed to disconnect account: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error disconnecting:", error);
        setConnectionError("Connection error while disconnecting");
      } finally {
        setIsLoading(false);
        setProcessingPlatform(null);
      }
    } else {
      // Use shared handleConnect for OAuth providers
      if (["twitter", "linkedin", "googleBusiness", "facebook", "instagram"].includes(platform)) {
        setProcessingPlatform(platform);
        setIsLoading(true);
        await signIn(platform);
      } else {
        // Mock connection for non-OAuth platforms
        setTimeout(() => {
          setSocialConnections((prev) => ({
            ...prev,
            [platform]: {
              ...prev[platform],
              connected: true,
              disconnected: false,
              account: `Demo ${getPlatformName(platform)} Account`,
            },
          }));
          setIsLoading(false);
          setProcessingPlatform(null);
        }, 500);
      }
    }
  };

  // Implement the API call for toggling autoposting
  const handleToggleAutoposting = async (platform) => {
    setProcessingPlatform(platform);
    setIsLoading(true);
    
    try {
      const newAutopostingState = !socialConnections[platform].autoposting;
      const connectionId = socialConnections[platform].id;
      
      const response = await fetch(`/api/auth/connections/update_autoposting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: platform,
          connectionId: connectionId,
          autoposting: newAutopostingState
        }),
      });

      if (response.ok) {
        // Update the local state with the new autoposting setting
        setSocialConnections((prev) => ({
          ...prev,
          [platform]: {
            ...prev[platform],
            autoposting: newAutopostingState,
          },
        }));
        // You could add a toast notification here if desired
        // toast.success(`Autoposting ${newAutopostingState ? 'enabled' : 'disabled'} for ${getPlatformName(platform)}`);
      } else {
        const errorData = await response.json();
        console.error("Failed to update autoposting settings:", errorData);
        setConnectionError(`Failed to update autoposting settings: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating autoposting:", error);
      setConnectionError("Connection error while updating settings");
    } finally {
      setIsLoading(false);
      setProcessingPlatform(null);
    }
  };

  // Add a helper to determine if a platform can be reconnected
  const canReconnect = (platform) => {
    return socialConnections[platform].disconnected && ["twitter", "linkedin", "facebook", "instagram"].includes(platform);
  };

  if (status === "loading" || isLoadingConnections) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
          <p className="mt-2">Loading your connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {connectionError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">
                There was an error connecting to the service: {connectionError}
              </p>
            </div>
            <button 
              onClick={() => setConnectionError(null)} 
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-medium text-gray-800">
              Social Media Channels
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Connect your social media accounts to publish content directly
              from your dashboard.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {Object.keys(socialConnections).map((platform) => (
              <SocialChannel
                key={platform}
                platform={platform}
                name={getPlatformName(platform)}
                connection={socialConnections[platform]}
                onToggleConnection={() => handleToggleConnection(platform)}
                onToggleAutoposting={() => handleToggleAutoposting(platform)}
                isLoading={isLoading && processingPlatform === platform}
                isConfigured={
                  ["twitter", "linkedin","googleBusiness", "facebook", "instagram"].includes(platform)
                } // Set based on your provider configuration
                canReconnect={canReconnect(platform)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function SocialChannel({
  platform,
  name,
  connection,
  onToggleConnection,
  onToggleAutoposting,
  isLoading,
  isConfigured = true,
  canReconnect = false,
}) {
  const iconMap = {
    facebook: <Facebook className="w-6 h-6 text-blue-600" />,
    twitter: <Twitter className="w-6 h-6 text-sky-500" />,
    linkedin: <Linkedin className="w-6 h-6 text-blue-700" />,
    linkedinCompany: <BriefcaseBusiness className="w-6 h-6 text-gray-800" />,
    instagram: <Instagram className="w-6 h-6 text-pink-500" />,
    googleBusiness: <Building2 className="w-6 h-6 text-green-600" />,
  };

  return (
    <div className="flex items-center justify-between py-4 px-6">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
          {iconMap[platform]}
        </div>
        <div>
          <div className="font-medium">{name}</div>
          {!isConfigured && (
            <div className="text-xs text-red-500">Provider not configured</div>
          )}
          {canReconnect && (
            <div className="text-xs text-amber-600">Previously connected</div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {connection.connected ? (
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center text-sm">
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-blue-100 flex items-center justify-center">
                <UserCircle className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span>
                  Connected as
                  <span className="text-blue-600">{connection.account}</span>
                </span>
                <button
                  onClick={onToggleConnection}
                  disabled={isLoading}
                  className="text-blue-600 text-left hover:underline disabled:opacity-50"
                >
                  {isLoading ? "Disconnecting..." : "Disconnect"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleConnection}
            disabled={isLoading || !isConfigured}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 
              (canReconnect ? "Reconnecting..." : "Connecting...") : 
              (canReconnect ? "Reconnect" : "Connect")
            }
          </button>
        )}

        {connection.connected && (
          <button
            onClick={onToggleAutoposting}
            disabled={isLoading}
            className={`px-3 py-1 rounded-md text-sm flex items-center disabled:opacity-50 ${
              connection.autoposting
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
          >
            {isLoading
              ? "Updating..."
              : connection.autoposting
              ? "Disable Autoposting"
              : "Enable Autoposting"}
          </button>
        )}
      </div>
    </div>
  );
}