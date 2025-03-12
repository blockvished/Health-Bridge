import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full p-2 text-center text-xs text-gray-500 border-t border-gray-300 flex justify-center">
      <span>© {new Date().getFullYear()} Live Doctors. All Rights Reserved. An Initiative of Prgenix</span>
    </footer>
  );
};

export default Footer;
