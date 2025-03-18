const SocialSettingsTab: React.FC = () => (
    <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Facebook
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          #
        </span>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 pl-8"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Twitter
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          #
        </span>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 pl-8"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Linked in
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          #
        </span>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 pl-8"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Instagram
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          #
        </span>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2 pl-8"
        />
      </div>
    </div>
  </div>
);

export default SocialSettingsTab;