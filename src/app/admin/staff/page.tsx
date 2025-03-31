"use client";
import React, { useState, useRef } from "react";
import { FiArrowLeft, FiCamera, FiEdit, FiTrash2 } from "react-icons/fi";

type StaffMember = {
  id: number;
  name: string;
  email: string;
  role: string;
  clinics: string;
  initial: string;
  imageUrl?: string;
};

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "vi",
    email: "vivi",
    role: "huh",
    clinics: "All Clinics",
    initial: "V",
  },
  {
    id: 2,
    name: "Jatin Gupta",
    email: "Gjatin782@gmail.com",
    role: "ASM",
    clinics: "All Clinics",
    initial: "J",
  },
];

const rolePermissions = [
  "Services",
  "Drugs",
  "Ratings & Review",
  "Consultation",
  "Custom Domain",
  "Schedule",
  "Blogs",
  "Appointments",
  "Prescription",
  "Affiliate",
  "QR Code",
  "Department",
  "Doctor Profile",
  "Patients",
  "Prescription Settings",
  "Payouts",
  "Consultation Settings",
];

interface AddStaffFormProps {
  onBack: () => void;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onBack }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg max-w-4xl mx-auto w-full p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-xl font-medium">Add new staff</h1>
        <button
          onClick={onBack}
          className="flex items-center bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          <FiArrowLeft className="mr-2" /> All staffs
        </button>
      </div>

      {/* Profile Image Uploader */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={triggerFileInput}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <FiCamera className="text-gray-500 text-xl" />
              </div>
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border shadow-sm"
            onClick={triggerFileInput}
          >
            <FiEdit className="text-gray-600 text-sm" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chambers
          </label>
          <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 appearance-none">
            <option>Select</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Designation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (Username) <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Role Permissions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Role Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolePermissions.map((permission) => (
            <label key={permission} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{permission}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
          Save
        </button>
      </div>
    </div>
  );
};

const StaffPage: React.FC = () => {
  const [showAddStaff, setShowAddStaff] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {showAddStaff ? (
        <AddStaffForm onBack={() => setShowAddStaff(false)} />
      ) : (
        <div className="bg-white shadow-md rounded-xl overflow-hidden w-full p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Staff
            </h1>
            <button
              onClick={() => setShowAddStaff(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow-md"
            >
              + Add new staff
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-0">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left p-3 font-medium">#</th>
                  <th className="text-left p-3 font-medium">Thumb</th>
                  <th className="text-left p-3 font-medium">Information</th>
                  <th className="text-left p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff, index) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50 transition border-b border-gray-200"
                  >
                    <td className="p-3 text-gray-700">{index + 1}</td>
                    <td className="p-3">
                      {staff.imageUrl ? (
                        <img
                          src={staff.imageUrl}
                          alt={staff.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold text-lg">
                          {staff.initial}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">
                        {staff.name}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        {staff.clinics}
                      </div>
                      <div className="text-sm text-gray-500">{staff.email}</div>
                      <div className="text-sm text-gray-500">{staff.role}</div>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button className="p-1.5 border rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center w-8 h-8">
                        <FiEdit className="text-gray-600" />
                      </button>
                      <button className="p-1.5 border rounded-md bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center w-8 h-8">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
