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
  // const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const [socialConnections, setSocialConnections] = useState({
    facebook: { connected: false, account: "", autoposting: false },
    twitter: { connected: false, account: "", autoposting: false },
    linkedin: { connected: false, account: "", autoposting: false },
    linkedinCompany: { connected: false, account: "", autoposting: false },
    instagram: { connected: false, account: "", autoposting: false },
    googleBusiness: { connected: false, account: "", autoposting: false },
  });

  // Load OAuth providers
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const availableProviders = await getProviders();
        setProviders(availableProviders);
      } catch (error) {
        console.error("Failed to load providers:", error);
      }
    };

    loadProviders();
  }, []);

  const toggleConnection = async (platform) => {
    // If already connected, disconnect
    if (socialConnections[platform].connected) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/admin/posts/disconnect/${platform}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to disconnect: ${response.statusText}`);
        }

        // Update local state after successful disconnection
        setSocialConnections({
          ...socialConnections,
          [platform]: {
            connected: false,
            account: "",
            autoposting: false,
          },
        });

        // toast.success(`Successfully disconnected ${getPlatformName(platform)}`);
      } catch (error) {
        console.error(`Failed to disconnect ${platform}:`, error);
        toast.error(`Failed to disconnect: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If not connected, initiate connection
    try {
      setIsLoading(true);

      // Map platform to provider name
      let provider;
      let options = { callbackUrl: "/admin/posts/connections" };

      switch (platform) {
        case "facebook":
          provider = "facebook";
          break;
        case "twitter":
          provider = "twitter";
          break;
        case "linkedin":
          provider = "linkedin";
          break;
        case "linkedinCompany":
          provider = "linkedin";
          options.isCompany = true;
          break;
        case "instagram":
          provider = "instagram";
          break;
        case "googleBusiness":
          provider = "google";
          break;
        default:
          provider = platform;
      }

      // Check if provider exists before signing in
      if (!providers || !providers[provider]) {
        throw new Error(`Provider ${provider} is not configured`);
      }

      // Redirect to the provider's OAuth flow
      await signIn(provider, options);
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
      toast.error(`Failed to connect: ${error.message}`);
      setIsLoading(false);
    }
  };

  const toggleAutoposting = async (platform) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/posts/autoposting/${platform}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !socialConnections[platform].autoposting,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update autoposting: ${response.statusText}`);
      }

      setSocialConnections({
        ...socialConnections,
        [platform]: {
          ...socialConnections[platform],
          autoposting: !socialConnections[platform].autoposting,
        },
      });

      toast.success(
        `${
          socialConnections[platform].autoposting ? "Disabled" : "Enabled"
        } autoposting for ${getPlatformName(platform)}`
      );
    } catch (error) {
      console.error(`Failed to toggle autoposting for ${platform}:`, error);
      toast.error(`Failed to update autoposting: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
          <p className="mt-2">Loading your connections...</p>
        </div>
      </div>
    );
  }

  //
  const { data: session } = useSession();
  //

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
            <p className="mt-2 text-sm text-red-600">
              Please try again or contact support if the issue persists.
            </p>
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
            <SocialChannel
              name="Facebook Page"
              platform="facebook"
              connection={socialConnections.facebook}
              onToggleConnection={() => toggleConnection("facebook")}
              onToggleAutoposting={() => toggleAutoposting("facebook")}
              isLoading={isLoading}
              isConfigured={providers && !!providers.facebook}
            />
            <main className="p-4">
              {!session ? (
                <button onClick={() => signIn("twitter")}>
                  Connect Twitter
                </button>
              ) : (
                <>
                  <p>Connected as {session?.user?.name}</p>
                  <p>Access Token: {session?.accessToken}</p>
                  <button onClick={() => signOut()}>Disconnect</button>
                </>
              )}
            </main>
            <SocialChannel
              name="LinkedIn Profile"
              platform="linkedin"
              connection={socialConnections.linkedin}
              onToggleConnection={() => toggleConnection("linkedin")}
              onToggleAutoposting={() => toggleAutoposting("linkedin")}
              isLoading={isLoading}
              isConfigured={providers && !!providers.linkedin}
            />
            <SocialChannel
              name="LinkedIn Company Page"
              platform="linkedinCompany"
              connection={socialConnections.linkedinCompany}
              onToggleConnection={() => toggleConnection("linkedinCompany")}
              onToggleAutoposting={() => toggleAutoposting("linkedinCompany")}
              isLoading={isLoading}
              isConfigured={providers && !!providers.linkedin}
            />
            <SocialChannel
              name="Instagram Profile"
              platform="instagram"
              connection={socialConnections.instagram}
              onToggleConnection={() => toggleConnection("instagram")}
              onToggleAutoposting={() => toggleAutoposting("instagram")}
              isLoading={isLoading}
              isConfigured={providers && !!providers.instagram}
            />
            <SocialChannel
              name="Google Business Profile"
              platform="googleBusiness"
              connection={socialConnections.googleBusiness}
              onToggleConnection={() => toggleConnection("googleBusiness")}
              onToggleAutoposting={() => toggleAutoposting("googleBusiness")}
              isLoading={isLoading}
              isConfigured={providers && !!providers.google}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function SocialChannel({
  name,
  platform,
  connection,
  onToggleConnection,
  onToggleAutoposting,
  isLoading,
  isConfigured = true,
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
                  Connected as{" "}
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
            {isLoading ? "Connecting..." : "Connect"}
          </button>
        )}

        {connection.connected && (
          <button
            onClick={onToggleAutoposting}
            disabled={isLoading}
            className={`px-3 py-1 rounded-md text-sm flex items-center disabled:opacity-50 ${
              connection.autoposting
                ? "text-red-600 hover:text-red-700"
                : "text-green-600 hover:text-green-700"
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
