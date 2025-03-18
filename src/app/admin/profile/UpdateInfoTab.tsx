import React from "react";

interface Doctor {
  name: string;
  specialty: string;
  degrees: string;
  email: string;
  city: string;
  country: string;
  experience: string;
  aboutMe: string;
  metaTags: string[];
  seoDescription: string;
}

interface UpdateInfoTabProps {
  doctor: Doctor;
}

const UpdateInfoTab: React.FC<UpdateInfoTabProps> = ({ doctor }) => (
    <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Name
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded p-2"
        defaultValue={doctor.name}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        className="w-full border border-gray-300 rounded p-2"
        defaultValue={doctor.email}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Phone
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded p-2"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Country
      </label>
      <div className="relative">
        <select className="w-full border border-gray-300 rounded p-2 appearance-none">
          <option>India</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        City
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded p-2"
        defaultValue={doctor.city}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Specialist
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded p-2"
        defaultValue={doctor.specialty}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Degree
      </label>
      <textarea
        className="w-full border border-gray-300 rounded p-2 h-24"
        defaultValue={doctor.degrees}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Experience Years
      </label>
      <input
        type="number"
        className="w-full border border-gray-300 rounded p-2"
        defaultValue={doctor.experience}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        About Me
      </label>
      <textarea
        className="w-full border border-gray-300 rounded p-2 h-24"
        defaultValue={doctor.aboutMe}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Signature
      </label>
      <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded flex items-center space-x-2 text-sm">
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
          />
        </svg>
        <span>Upload Signature</span>
      </button>
    </div>
  </div>
);

export default UpdateInfoTab;