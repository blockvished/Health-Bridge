import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-3 px-4 text-center text-sm text-gray-500 border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p>© 2025 Digambar Healthcare. All rights reserved.</p>
        <div className="mt-2 md:mt-0 flex space-x-4">
        </div>
      </div>
    </footer>
  );
};

export default Footer;