import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-60 w-[calc(100%-15rem)] h-[30px] bg-gray-100 text-gray-500 text-xs border-t border-gray-300 flex items-center justify-center">
      <span>© {new Date().getFullYear()} Live Doctors. All Rights Reserved. An Initiative of Prgenix</span>
    </footer>
  );
};

export default Footer;

