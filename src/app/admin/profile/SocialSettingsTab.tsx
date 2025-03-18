import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const SocialSettingsTab: React.FC = () => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Facebook
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <FaFacebook className="text-blue-600 text-xl" />
        </span>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 pl-10 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
            outline-none transition-all"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Twitter
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <FaTwitter className="text-blue-400 text-xl" />
        </span>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 pl-10 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
            outline-none transition-all"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        LinkedIn
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <FaLinkedin className="text-blue-700 text-xl" />
        </span>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 pl-10 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
            outline-none transition-all"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Instagram
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <FaInstagram className="text-pink-500 text-xl" />
        </span>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 pl-10 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
            outline-none transition-all"
        />
      </div>
    </div>
  </div>
);

export default SocialSettingsTab;
