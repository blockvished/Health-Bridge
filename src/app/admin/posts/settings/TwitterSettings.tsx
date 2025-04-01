import React, { useState, ChangeEvent } from 'react';

interface Account {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
}

const TwitterSettings: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([
        {
            apiKey: '',
            apiSecret: '',
            accessToken: '',
            accessTokenSecret: '',
        },
    ]);
    const [autopostEnabled, setAutopostEnabled] = useState<boolean>(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [users, setUsers] = useState<string[]>(['User 1', 'User 2', 'User 3']); // Placeholder users
    const [disableImagePosting, setDisableImagePosting] = useState<boolean>(false);
    const [linkShortener, setLinkShortener] = useState<string>('');

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const values = [...accounts];
        values[index][event.target.name as keyof Account] = event.target.value;
        setAccounts(values);
    };

    const handleAddAccount = () => {
        setAccounts([
            ...accounts,
            {
                apiKey: '',
                apiSecret: '',
                accessToken: '',
                accessTokenSecret: '',
            },
        ]);
    };

    const handleUserSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedUsers(selectedOptions);
    };

    const handleSelectAll = () => {
        setSelectedUsers(users);
    };

    const handleSelectNone = () => {
        setSelectedUsers([]);
    };

    const handleDisableImagePostingToggle = () => {
        setDisableImagePosting(!disableImagePosting);
    };

    const handleLinkShortenerChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setLinkShortener(event.target.value);
    };

    return (
        <div className="p-6 space-y-8">
            {/* API Settings */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">API Settings</h2>
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Note:</strong>
                    <span className="block sm:inline"> You have only 1 account to add.</span>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2">
                        Before you start publishing your content to Twitter you need to create a Twitter Application. You can get a step by step tutorial on how to create a Twitter Application on our{' '}
                        <a href="#" className="text-blue-600">
                            Documentation
                        </a>.
                    </p>
                    {accounts.map((account, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 mt-4">
                            <input
                                type="text"
                                name="apiKey"
                                placeholder="Enter Twitter API Key"
                                value={account.apiKey}
                                onChange={(event) => handleInputChange(index, event)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="apiSecret"
                                placeholder="Enter Twitter API Secret"
                                value={account.apiSecret}
                                onChange={(event) => handleInputChange(index, event)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="accessToken"
                                placeholder="Enter Twitter Access Token"
                                value={account.accessToken}
                                onChange={(event) => handleInputChange(index, event)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="accessTokenSecret"
                                placeholder="Enter Twitter Access Token Secret"
                                value={account.accessTokenSecret}
                                onChange={(event) => handleInputChange(index, event)}
                                className="border p-2 rounded"
                            />
                        </div>
                    ))}
                    <button onClick={handleAddAccount} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                        + Add more
                    </button>
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>

            {/* Autopost Settings */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Autopost Settings</h2>
                <div>
                    <label htmlFor="autopostUsers" className="block text-sm font-medium text-gray-700">
                        Autopost Posts to Twitter of the user(s)
                    </label>
                    <select
                        id="autopostUsers"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        multiple
                        value={selectedUsers}
                        onChange={handleUserSelect}
                    >
                        {users.map((user) => (
                            <option key={user} value={user}>
                                {user}
                            </option>
                        ))}
                    </select>
                    <div className="mt-2">
                        <button onClick={handleSelectAll} className="bg-gray-200 text-gray-700 px-3 py-1 rounded mr-2">
                            Select All
                        </button>
                        <button onClick={handleSelectNone} className="bg-gray-200 text-gray-700 px-3 py-1 rounded">
                            Select None
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            checked={disableImagePosting}
                            onChange={handleDisableImagePostingToggle}
                        />
                        <span className="ml-2 text-sm text-gray-700">Disable image posting</span>
                    </label>
                    <span className="text-sm text-gray-500">Enable this button, if you want to disable image posting the twitter</span>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Twitter Post Image</label>
                    <button className="mt-1 px-4 py-2 bg-gray-200 text-gray-700 rounded">+ Browse...</button>
                </div>

                <div className="mt-4">
                    <label htmlFor="linkShortener" className="block text-sm font-medium text-gray-700">
                        Link Shortener
                    </label>
                    <select
                        id="linkShortener"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={linkShortener}
                        onChange={handleLinkShortenerChange}
                    >
                        <option value="">Select Shortener Type</option>
                        <option value="bitly">Bitly</option>
                        <option value="tinyurl">TinyURL</option>
                        {/* Add more options as needed */}
                    </select>
                </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
    );
};

export default TwitterSettings;