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

interface a11yProps {
  index: number;
  id: string;
  "aria-controls": string;
}

function a11yProps(index: number): a11yProps {
  return {
    index: index,
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SocialSettings: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: number
  ) => {
    setValue(newValue);
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-wrap border-b border-gray-300"> {/* Removed border-b from parent div */}
        <button
          onClick={() => handleChange(null, 0)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 0 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(0)}
        >
          General
        </button>
        <button
          onClick={() => handleChange(null, 1)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 1 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(1)}
        >
          Facebook
        </button>
        <button
          onClick={() => handleChange(null, 2)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 2 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(2)}
        >
          Twitter
        </button>
        <button
          onClick={() => handleChange(null, 3)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 3 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(3)}
        >
          LinkedIn
        </button>
        <button
          onClick={() => handleChange(null, 4)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 4 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(4)}
        >
          Tumblr
        </button>
        <button
          onClick={() => handleChange(null, 5)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 5 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(5)}
        >
          Pinterest
        </button>
        <button
          onClick={() => handleChange(null, 6)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 6 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(6)}
        >
          Google Business Profile
        </button>
        <button
          onClick={() => handleChange(null, 7)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 7 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(7)}
        >
          Reddit
        </button>
        <button
          onClick={() => handleChange(null, 8)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 8 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(8)}
        >
          Instagram
        </button>
        <button
          onClick={() => handleChange(null, 9)}
          className={`px-4 py-2 border-none bg-none cursor-pointer ${
            value === 9 ? "border-b-2 border-blue-500 font-bold" : "font-normal"
          }`}
          {...a11yProps(9)}
        >
          Youtube
        </button>
      </div>
      <TabPanel value={value} index={0}>
        <GeneralSettings />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <FacebookSettings />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <TwitterSettings />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <LinkedInSettings />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <TumblrSettings />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <PinterestSettings />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <GoogleBusinessProfileSettings />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <RedditSettings />
      </TabPanel>
      <TabPanel value={value} index={8}>
        <InstagramSettings />
      </TabPanel>
      <TabPanel value={value} index={9}>
        <YoutubeSettings />
      </TabPanel>
    </div>
  );
};

export default SocialSettings;