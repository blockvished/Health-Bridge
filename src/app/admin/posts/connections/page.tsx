"use client";
// pages/social-connections.jsx
import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function SocialConnections() {
  // Initial state for social connections
  const [socialConnections, setSocialConnections] = useState({
    facebook: { connected: true, account: 'fff', autoposting: true },
    twitter: { connected: false, account: '', autoposting: false },
    linkedin: { connected: false, account: '', autoposting: false },
    linkedinCompany: { connected: true, account: 'fff', autoposting: true },
    instagram: { connected: true, account: 'fff', autoposting: true },
    googleBusiness: { connected: true, account: 'fff', autoposting: true },
  });

  // Handle connection/disconnection
  const toggleConnection = (platform) => {
    if (platform === 'twitter' && !socialConnections.twitter.connected) {
      // Redirect to the Twitter API authentication link
      window.location.href = '/api/auth/twitter';
      return; // Stop the toggle logic here
    }

    setSocialConnections({
      ...socialConnections,
      [platform]: {
        ...socialConnections[platform],
        connected: !socialConnections[platform].connected,
        account: socialConnections[platform].connected ? '' : 'Live Doctors', // Default account name
      },
    });
  };

  // Toggle autoposting setting
  const toggleAutoposting = (platform) => {
    setSocialConnections({
      ...socialConnections,
      [platform]: {
        ...socialConnections[platform],
        autoposting: !socialConnections[platform].autoposting,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Social Channels | Dashboard</title>
        <meta name="description" content="Manage your social media connections" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-medium text-gray-800">Social Channels</h1>
          </div>

          <div className="divide-y divide-gray-200">
            {/* Facebook */}
            <SocialChannel
              icon="/facebook.svg"
              name="Facebook Page"
              platform="facebook"
              connection={socialConnections.facebook}
              onToggleConnection={() => toggleConnection('facebook')}
              onToggleAutoposting={() => toggleAutoposting('facebook')}
            />

            {/* Twitter / X */}
            <SocialChannel
              icon="/twitter-x.svg"
              name="X Profile"
              platform="twitter"
              connection={socialConnections.twitter}
              onToggleConnection={() => toggleConnection('twitter')}
              onToggleAutoposting={() => toggleAutoposting('twitter')}
            />

            {/* LinkedIn */}
            <SocialChannel
              icon="/linkedin.svg"
              name="LinkedIn Profile"
              platform="linkedin"
              connection={socialConnections.linkedin}
              onToggleConnection={() => toggleConnection('linkedin')}
              onToggleAutoposting={() => toggleAutoposting('linkedin')}
            />

            {/* LinkedIn Company */}
            <SocialChannel
              icon="/linkedin-company.svg"
              name="LinkedIn Company Page"
              platform="linkedinCompany"
              connection={socialConnections.linkedinCompany}
              onToggleConnection={() => toggleConnection('linkedinCompany')}
              onToggleAutoposting={() => toggleAutoposting('linkedinCompany')}
            />

            {/* Instagram */}
            <SocialChannel
              icon="/instagram.svg"
              name="Instagram Profile"
              platform="instagram"
              connection={socialConnections.instagram}
              onToggleConnection={() => toggleConnection('instagram')}
              onToggleAutoposting={() => toggleAutoposting('instagram')}
            />

            {/* Google Business */}
            <SocialChannel
              icon="/google-business.svg"
              name="Google Business Profile"
              platform="googleBusiness"
              connection={socialConnections.googleBusiness}
              onToggleConnection={() => toggleConnection('googleBusiness')}
              onToggleAutoposting={() => toggleAutoposting('googleBusiness')}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// Component for each social channel row
function SocialChannel({ icon, name, platform, connection, onToggleConnection, onToggleAutoposting }) {
  return (
    <div className="flex items-center justify-between py-4 px-6">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 flex-shrink-0">
          <div className="h-full w-full rounded-full overflow-hidden relative">
            <Image
              src={icon}
              alt={`${name} icon`}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </div>
        <div className="font-medium">{name}</div>
      </div>

      <div className="flex items-center space-x-4">
        {connection.connected ? (
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center text-sm">
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-blue-100 flex-shrink-0">
                <Image
                  src="/avatar-placeholder.svg"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span>Connected as <span className="text-blue-600">{connection.account}</span></span>
                <button
                  onClick={onToggleConnection}
                  className="text-blue-600 text-left hover:underline"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleConnection}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Connect
          </button>
        )}

        {connection.connected && (
          <button
            onClick={onToggleAutoposting}
            className={`px-3 py-1 rounded-md text-sm flex items-center ${
              connection.autoposting ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
            }`}
          >
            {connection.autoposting ? 'Disable Autoposting' : 'Enable Autoposting'}
          </button>
        )}
      </div>
    </div>
  );
}