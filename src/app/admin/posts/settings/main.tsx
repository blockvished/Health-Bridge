"use client";

import React, { useState } from "react";

// Separate components for each tab panel
import GeneralSettings from "./GeneralSettings";
import FacebookSettings from "./FacebookSettings";
import TwitterSettings from "./TwitterSettings";
import LinkedInSettings from "./LinkedInSettings";
import TumblrSettings from "./TumblrSettings";
import PinterestSettings from "./PinterestSettings";
import GoogleBusinessProfileSettings from "./GoogleBusinessProfileSettings";
import RedditSettings from "./RedditSettings";
import InstagramSettings from "./InstagramSettings";
import YoutubeSettings from "./YoutubeSettings";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
};

// Define the tab data structure to avoid repetition
interface TabData {
  label: string;
  component: React.ReactNode;
}

const SocialSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Create an array of tab data to make the code more maintainable
  const tabs: TabData[] = [
    { label: "General", component: <GeneralSettings /> },
    { label: "Facebook", component: <FacebookSettings /> },
    { label: "Twitter", component: <TwitterSettings /> },
    { label: "LinkedIn", component: <LinkedInSettings /> },
    { label: "Tumblr", component: <TumblrSettings /> },
    { label: "Pinterest", component: <PinterestSettings /> },
    {
      label: "Google Business Profile",
      component: <GoogleBusinessProfileSettings />,
    },
    { label: "Reddit", component: <RedditSettings /> },
    { label: "Instagram", component: <InstagramSettings /> },
    { label: "Youtube", component: <YoutubeSettings /> },
  ];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 bg-white rounded-sm">
      <div>
        <div className="flex flex-wrap overflow-x-auto whitespace-nowrap">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-2 py-2 border-b-2 transition-colors focus:outline-none m-1 text-sm sm:text-base cursor-pointer ${
                // Added cursor-pointer
                activeTab === index
                  ? "border-blue-900 font-semibold text-blue-900"
                  : "border-transparent hover:text-blue-300 hover:border-blue-300"
              }`}
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
              aria-selected={activeTab === index}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={activeTab} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </div>
  );
};

export default SocialSettings;
