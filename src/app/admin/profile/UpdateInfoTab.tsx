import React from "react";

interface Doctor {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  specialization: string;
  degrees: string;
  experience: string;
  aboutSelf: string;
  aboutClinic?: string;
}

interface UpdateInfoTabProps {
  doctor: Doctor | null;
}

const UpdateInfoTab: React.FC<UpdateInfoTabProps> = ({ doctor }) => {
  const [metaTags, setMetaTags] = React.useState<string[]>([]);
  const [seoDescription, setSeoDescription] = React.useState<string>("");

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Initialize textarea heights on component mount
  React.useEffect(() => {
    const textareas = document.querySelectorAll('textarea.auto-resize');
    textareas.forEach(textarea => {
      const element = textarea as HTMLTextAreaElement;
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    });
  }, []);

  return (
    <div className="space-y-3">
      {/* Profile Image and Signature Upload Section */}
      <div className="flex flex-wrap gap-8 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2 overflow-hidden">
            {/* <img 
              src="/api/placeholder/128/128" 
              alt="Doctor profile" 
              className="w-full h-full object-cover"
            /> */}
          </div>
          <button className="mt-2 bg-gray-100 text-gray-600 px-3 py-2 rounded flex items-center space-x-2 text-sm">
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
            <span>Upload Image</span>
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-48 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2">
            {/* <img 
              src="/api/placeholder/192/128" 
              alt="Doctor signature" 
              className="w-3/4 h-auto object-contain"
            /> */}
          </div>
          <button className="mt-2 bg-gray-100 text-gray-600 px-3 py-2 rounded flex items-center space-x-2 text-sm">
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

      {/* Form Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor?.name}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor?.email}
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
          defaultValue={doctor?.city}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialist
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor?.specialization}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Degree
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          defaultValue={doctor?.degrees}
          onChange={handleTextareaChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience Years
        </label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded p-2"
          defaultValue={doctor?.experience}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About Me
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          defaultValue={doctor?.aboutSelf}
          onChange={handleTextareaChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About My Clinic
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          defaultValue={doctor?.aboutClinic || ""}
          onChange={handleTextareaChange}
        />
      </div>
    </div>
  );
};

export default UpdateInfoTab;