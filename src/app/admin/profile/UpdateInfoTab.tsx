import Cookies from "js-cookie";
import { Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";

interface Doctor {
  name: string;
  email: string;
  phone: string;
  city: string;
  specialization: string;
  degree: string;
  experience: string;
  aboutSelf: string;
  aboutClinic?: string;
  profileImage?: string;
  signatureImage?: string;
}

interface UpdateInfoTabProps {
  doctor: Doctor | null;
}

const UpdateInfoTab: React.FC<UpdateInfoTabProps> = ({ doctor }) => {
  const [doctorData, setDoctorData] = useState({
    profilePreview: doctor?.profileImage || "",
    signaturePreview: doctor?.signatureImage || "",
    name: doctor?.name || "",
    email: doctor?.email || "",
    phone: doctor?.phone || "",
    city: doctor?.city || "",
    specialization: doctor?.specialization || "",
    degree: doctor?.degree || "",
    experience: doctor?.experience || "",
    aboutSelf: doctor?.aboutSelf || "",
    aboutClinic: doctor?.aboutClinic || "",
  });

  const [errors, setErrors] = useState({
    email: "",
    experience: "",
  });

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const roleFromCookie = Cookies.get("userRole");
    const idFromCookie = Cookies.get("userId");

    setRole(roleFromCookie || null);
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    if (doctor) {
      setDoctorData({
        profilePreview: doctor.profileImage || "",
        signaturePreview: doctor.signatureImage || "",
        name: doctor.name || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        city: doctor.city || "",
        specialization: doctor.specialization || "",
        degree: doctor.degree || "",
        experience: doctor.experience || "",
        aboutSelf: doctor.aboutSelf || "",
        aboutClinic: doctor.aboutClinic || "",
      });
    }
  }, [doctor]);

  const handleProfileClick = () => profileInputRef.current?.click();
  const handleSignatureClick = () => signatureInputRef.current?.click();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDoctorData((prev) => ({
          ...prev,
          profilePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDoctorData((prev) => ({
          ...prev,
          signaturePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setDoctorData({ ...doctorData, email: newEmail });

    if (newEmail && !validateEmail(newEmail)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  // Handle experience change with validation
  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Don't allow negative numbers by checking the input value
    if (value === "" || parseInt(value, 10) >= 0) {
      setDoctorData({ ...doctorData, experience: value });
      setErrors((prev) => ({ ...prev, experience: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        experience: "Experience cannot be negative",
      }));
    }
  };

  // Initialize textarea heights on component mount
  useEffect(() => {
    const textareas = document.querySelectorAll("textarea.auto-resize");
    textareas.forEach((textarea) => {
      const element = textarea as HTMLTextAreaElement;
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    });
  }, []);

  const handleSaveChanges = async () => {
    // Validate before saving
    const newErrors = {
      email:
        doctorData.email && !validateEmail(doctorData.email)
          ? "Please enter a valid email address"
          : "",
      experience:
        doctorData.experience && parseInt(doctorData.experience, 10) < 0
          ? "Experience cannot be negative"
          : "",
    };

    setErrors(newErrors);

    // If there are validation errors, don't proceed
    if (newErrors.email || newErrors.experience) {
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append doctor text fields
      Object.entries(doctorData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append files
      if (profileFile) {
        formData.append("profileImage", profileFile);
      }
      if (signatureFile) {
        formData.append("signatureImage", signatureFile);
      }

      const response = await fetch(
        `/api/doctor/profile/info/create_update/${userId}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update doctor info");

      const data = await response.json();
      alert("Doctor information updated successfully!");
      console.log(data);
    } catch (error) {
      console.error("Error updating doctor info:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-60">
        Loading doctor information...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Profile Image and Signature Upload Section */}
      <div className="flex flex-wrap gap-8 mb-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2 overflow-hidden cursor-pointer">
            {doctorData.profilePreview ? (
              <img
                src={doctorData.profilePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">No image</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            onChange={handleProfileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleProfileClick}
            className="mt-2 bg-gray-100 text-gray-600 px-3 py-2 rounded flex items-center space-x-2 text-sm cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-32 bg-gray-100 rounded-md flex items-center justify-center mb-2 cursor-pointer overflow-hidden">
            {doctorData.signaturePreview ? (
              <img
                src={doctorData.signaturePreview}
                alt="Signature Preview"
                className="w-3/4 h-auto object-contain"
              />
            ) : (
              <span className="text-sm text-gray-400">No signature</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={signatureInputRef}
            onChange={handleSignatureChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleSignatureClick}
            className="mt-2 bg-gray-100 text-gray-600 px-3 py-2 rounded flex items-center space-x-2 text-sm cursor-pointer"
          >
            <Upload className="w-4 h-4" />
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
          value={doctorData.name}
          onChange={(e) =>
            setDoctorData({ ...doctorData, name: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className={`w-full border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded p-2`}
          value={doctorData.email}
          onChange={handleEmailChange}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <div>
          <style jsx>{`
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
          `}</style>
          <input
            type="number"
            className="w-full border border-gray-300 rounded p-2"
            value={doctorData.phone}
            onChange={(e) =>
              setDoctorData({ ...doctorData, phone: e.target.value })
            }
          />
        </div>
      </div>
      <div></div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          value={doctorData.city}
          onChange={(e) =>
            setDoctorData({ ...doctorData, city: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialist
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded p-2"
          value={doctorData.specialization}
          onChange={(e) =>
            setDoctorData({ ...doctorData, specialization: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Degree
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          value={doctorData.degree}
          onChange={(e) =>
            setDoctorData({ ...doctorData, degree: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience Years
        </label>
        <input
          type="number"
          min="0"
          className={`w-full border ${
            errors.experience ? "border-red-500" : "border-gray-300"
          } rounded p-2`}
          value={doctorData.experience}
          onChange={handleExperienceChange}
        />
        {errors.experience && (
          <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About Me
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          value={doctorData.aboutSelf}
          onChange={(e) =>
            setDoctorData({ ...doctorData, aboutSelf: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About My Clinic
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 min-h-24 auto-resize overflow-hidden resize-none"
          value={doctorData.aboutClinic}
          onChange={(e) =>
            setDoctorData({ ...doctorData, aboutClinic: e.target.value })
          }
        />
      </div>
      <button
        className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm shadow-md hover:bg-blue-600 transition cursor-pointer"
        onClick={handleSaveChanges}
        disabled={isLoading}
      >
        <FaCheck className="mr-2" />
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default UpdateInfoTab;
