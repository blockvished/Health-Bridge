"use client";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { FiArrowLeft, FiCamera, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type StaffMember = {
  id: number;
  name: string;
  email: string;
  role: string;
  imageLink?: string;
  clinicId: string;
  clinicName: string;
  permissionIds: number[];
};

type PermissionType = {
  id: number;
  name: string;
  description: string | null;
};

type ClinicData = {
  id: string;
  name: string;
  // Add other properties as needed
};

interface StaffFormProps {
  onBack: () => void;
  onStaffUpdated?: () => void;
  rolePermissions: PermissionType[];
  clinicsData: ClinicData[];
  initialStaffData?: StaffMember | null;
}

const StaffForm: React.FC<StaffFormProps> = ({
  onBack,
  onStaffUpdated,
  rolePermissions,
  clinicsData,
  initialStaffData,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialStaffData?.imageLink || null
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [permissions, setPermissions] = useState<number[]>(
    initialStaffData?.permissionIds || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: initialStaffData?.name || "",
    role: initialStaffData?.role || "",
    email: initialStaffData?.email || "",
    password: "", // Password should be empty for edit unless they want to change it
    clinicId: initialStaffData?.clinicId || "",
  });

  // Get user ID from cookie
  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    if (initialStaffData) {
      setFormData({
        name: initialStaffData.name || "",
        role: initialStaffData.role || "",
        email: initialStaffData.email || "",
        password: "", // Always reset password field
        clinicId: initialStaffData.clinicId || "",
      });
      console.log(initialStaffData);
      setPermissions(initialStaffData.permissionIds || []);
      setImagePreview(initialStaffData.imageLink || null);
    }
  }, [initialStaffData]);

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
      [name]: name === "email" ? value.toLowerCase() : value,
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
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("role", formData.role);
      submitData.append("clinicId", formData.clinicId);
      submitData.append("permissions", JSON.stringify(permissions));

      if (formData.password) {
        submitData.append("password", formData.password);
      }

      if (fileInputRef.current?.files?.[0]) {
        submitData.append("image", fileInputRef.current.files[0]);
      }

      const method = initialStaffData?.id ? "PUT" : "POST";
      console.log("staffdit", initialStaffData?.id);
      const apiUrl = initialStaffData?.id
        ? `/api/doctor/staff/put/${userId}`
        : `/api/doctor/staff/${userId}`;

      let response;

      if (initialStaffData?.id) {
        submitData.append("staffId", String(initialStaffData?.id));
        response = await fetch(apiUrl, {
          method: method,
          body: submitData,
        });
      } else {
        response = await fetch(apiUrl, {
          method: method,
          body: submitData,
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Failed to ${method === "PUT" ? "update" : "create"} staff member`
        );
      }

      if (method === "PUT" && onStaffUpdated) {
        onStaffUpdated();
      } else if (method === "POST") {
        onBack(); // Go back after successful creation
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-white rounded-lg max-w-4xl mx-auto w-full p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-xl font-medium">
          {initialStaffData?.id ? "Edit Staff" : "Add new staff"}
        </h1>
        <button
          onClick={onBack}
          className="flex items-center bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
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
              <Image
                src={imagePreview}
                alt="Profile Preview"
                width={96} // Equivalent to w-24 (96px)
                height={96} // Equivalent to h-24 (96px)
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <FiCamera className="text-gray-500 text-xl" />
              </div>
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border shadow-sm cursor-pointer"
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
            Chambers <span className="text-red-500">*</span>
          </label>
          <select
            name="clinicId"
            value={formData.clinicId}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 appearance-none"
            required
          >
            <option value="">Select</option>
            {clinicsData.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
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

        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            {...(!initialStaffData?.id && { required: true })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Role Permissions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Role Permissions</h2>

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
                <span className="text-sm text-gray-700">{permission.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        {/* Save Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center cursor-pointer"
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
  const [showEditStaff, setShowEditStaff] = useState<number | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleteStaffId, setDeleteStaffId] = useState<number | null>(null);
  const [rolePermissions, setRolePermissions] = useState<PermissionType[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clinicsData, setClinicsData] = useState<ClinicData[]>([]);

  // Fetch clinics data - using useCallback to prevent recreation on each render
  const fetchClinics = React.useCallback(async () => {
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
        setClinicsData(data);
      } catch (err: unknown) {
        console.error("Error fetching clinics:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err)); // Fallback if it's not an Error
        }
      } finally {
        setLoading(false);
      }
    }
  }, [userId]);

  // Fetch staff data - using useCallback to prevent recreation on each render
  const fetchStaff = React.useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/doctor/staff/${userId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: StaffMember[] = await res.json();
      console.log(data);
      setStaffMembers(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  }, [userId]);

  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    setUserId(idFromCookie || null);
  }, []);

  // Effect to fetch clinics when userId changes
  useEffect(() => {
    if (userId) {
      fetchClinics();
      fetchRolePermissions();
    }
  }, [userId, fetchClinics]);

  // Effect to fetch staff when relevant states change
  useEffect(() => {
    if (userId) {
      fetchStaff();
    }
    // We intentionally don't include fetchStaff in the dependency array
    // as it would cause an infinite loop
  }, [userId, fetchStaff, showAddStaff, showEditStaff]);

  const fetchRolePermissions = async () => {
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
      setRolePermissions(data);
    } catch (err: unknown) {
      console.error("Error fetching role permissions:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err)); // Fallback if it's not an Error
      }
    }
  };

  const handleShowDeleteModal = (staffId: number) => {
    setDeleteStaffId(staffId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteStaffId(null);
    setIsDeleteModalOpen(false);
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
      fetchStaff();
      handleCloseDeleteModal();
    } catch (err: unknown) {
      console.error("Error deleting staff:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err)); // Fallback if it's not an Error
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStaffAdded = () => {
    fetchStaff();
    setShowAddStaff(false);
  };

  const handleStaffUpdated = () => {
    fetchStaff();
    setShowEditStaff(null);
  };

  const handleEditClick = (staffId: number) => {
    setShowEditStaff(staffId);
  };

  const currentStaffToEdit = staffMembers.find(
    (staff) => staff.id === showEditStaff
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {showAddStaff ? (
        <StaffForm
          onBack={() => setShowAddStaff(false)}
          onStaffUpdated={handleStaffAdded}
          rolePermissions={rolePermissions}
          clinicsData={clinicsData}
        />
      ) : showEditStaff !== null && currentStaffToEdit ? (
        <StaffForm
          onBack={() => setShowEditStaff(null)}
          onStaffUpdated={handleStaffUpdated}
          rolePermissions={rolePermissions}
          clinicsData={clinicsData}
          initialStaffData={currentStaffToEdit}
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow-md cursor-pointer"
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
                          <Image
                            src={staff.imageLink}
                            alt={staff.name}
                            width={40} // w-10 = 40px
                            height={40} // h-10 = 40px
                            className="rounded-full object-cover"
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
                        <button
                          onClick={() => handleEditClick(staff.id)}
                          className="p-1.5 border rounded-md bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center w-8 h-8 cursor-pointer"
                        >
                          <FiEdit className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleShowDeleteModal(staff.id)}
                          className="p-1.5 border rounded-md bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center w-8 h-8 cursor-pointer"
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
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStaff}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded cursor-pointer"
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
