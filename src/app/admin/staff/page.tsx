"use client";
import Cookies from "js-cookie";
import React, { useState, useRef, useEffect } from "react";
import { FiArrowLeft, FiCamera, FiEdit, FiTrash2 } from "react-icons/fi";

type StaffMember = {
  id: number;
  name: string;
  email: string;
  role: string;
  clinicName: string;
  imageLink?: string;
};

type PermissionType = {
  id: number;
  name: string;
  description: string | null;
};

interface AddStaffFormProps {
  onBack: () => void;
  onStaffAdded: () => void;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({
  onBack,
  onStaffAdded,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [clinicsData, setClinicsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<PermissionType[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [permissions, setPermissions] = useState<number[]>([]); // Store IDs


  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
    clinicId: "",
  });

  // Get user ID from cookie
  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchClinics();
      fetchRolePermissions();
    }
  }, [userId]);

  // Fetch clinics when userId is available
  useEffect(() => {
    fetchClinics();
  }, [userId]);

  const fetchClinics = async () => {
    if (userId) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/doctor/clinic/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to fetch clinics: ${response.status}`
          );
        }
        const data = await response.json();
        console.log(data);
        setClinicsData(data);
      } catch (err: any) {
        console.error("Error fetching clinics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchRolePermissions = async () => {
    console.log("fetching roles");
    setLoadingPermissions(true);
    setError(null);
    try {
      const response = await fetch("/api/doctor/staff/role_permissions", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to fetch role permissions: ${response.status}`
        );
      }
      const data = await response.json();
      console.log("Role Permissions:", data);
      setRolePermissions(data);
    } catch (err: any) {
      console.error("Error fetching role permissions:", err);
      setError(err.message);
    } finally {
      setLoadingPermissions(false);
    }
  };
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox changes
  const handlePermissionChange = (permissionId: number) => {
    setPermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Create FormData object for file upload and other data
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("role", formData.role);
      submitData.append("password", formData.password);
      submitData.append("clinicId", formData.clinicId);

      // Add permissions as JSON string
      submitData.append("permissions", JSON.stringify(permissions));

      // Add image if available
      if (fileInputRef.current?.files?.[0]) {
        submitData.append("image", fileInputRef.current.files[0]);
      }

      // Send the data to the API
      const response = await fetch(`/api/doctor/staff/${userId}`, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      onStaffAdded();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create staff member");
      }

      // Success - go back to staff list
      onBack();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chambers
          </label>
          <select
            name="clinicId"
            value={formData.clinicId}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 appearance-none"
          >
            <option value="">Select</option>
            {clinicsData.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
          {loading && (
            <p className="text-sm text-gray-500 mt-1">Loading clinics...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (Username) <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Role Permissions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Role Permissions</h2>
          {loadingPermissions ? (
            <p className="text-sm text-gray-500">Loading permissions...</p>
          ) : error && loadingPermissions ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rolePermissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(permission.id)}
                    onChange={() => handlePermissionChange(permission.id)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    {permission.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        {/* Save Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

const StaffPage: React.FC = () => {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleteStaffId, setDeleteStaffId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchStaff();
    }
  }, [userId]);

  const handleShowDeleteModal = (staffId: number) => {
    setDeleteStaffId(staffId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteStaffId(null);
    setIsDeleteModalOpen(false);
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch(`/api/doctor/staff/${userId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: StaffMember[] = await res.json();
      setStaffMembers(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleDeleteStaff = async () => {
    if (!userId || !deleteStaffId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/doctor/staff/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ staffIdToDelete: deleteStaffId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Failed to delete staff: ${res.status}`
        );
      }
      // Re-fetch staff after successful deletion
      fetchStaff();
      handleCloseDeleteModal();
    } catch (err: any) {
      console.error("Error deleting staff:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffAdded = () => {
    fetchStaff();
    setShowAddStaff(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {showAddStaff ? (
        <AddStaffForm
          onBack={() => setShowAddStaff(false)}
          onStaffAdded={handleStaffAdded}
        />
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

          {loading ? (
            <p>Loading staff...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
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
                        {staff.imageLink ? (
                          <img
                            src={staff.imageLink}
                            alt={staff.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold text-lg">
                            {staff.name.trim().charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900">
                          {staff.name}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          {staff.clinicName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {staff.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {staff.role}
                        </div>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button className="p-1.5 border rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center w-8 h-8">
                          <FiEdit className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleShowDeleteModal(staff.id)}
                          className="p-1.5 border rounded-md bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center w-8 h-8"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete this staff member?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseDeleteModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStaff}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
