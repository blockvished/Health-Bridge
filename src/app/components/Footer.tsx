import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-gray-800 text-white text-center">
      <p>&copy; {new Date().getFullYear()} B-School. All Rights Reserved.</p>
      <p className="mt-2 text-sm">
        <a href="#" className="underline">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a href="#" className="underline">
          Terms of Use
        </a>
      </p>
    </footer>
  );
};

export default Footer;
