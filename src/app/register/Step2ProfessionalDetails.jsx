import React from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Step2ProfessionalDetails = ({
  speciality,
  setSpeciality,
  practiceType,
  setPracticeType,
  yearsOfExperience,
  setYearsOfExperience,
  city,
  setCity,
  pincode,
  setPincode,
  handlePrevStep,
  handleNextStep,
  specialities,
  practiceTypes,
}) => {
  return (
    <div className="w-full space-y-3">
      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Speciality <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          required
        >
          <option value="">Select your speciality</option>
          {specialities.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Type of Practice <span className="text-gray-400">(optional)</span>
        </label>
        <select
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
          value={practiceType}
          onChange={(e) => setPracticeType(e.target.value)}
        >
          <option value="">Select practice type</option>
          {practiceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-600 text-sm font-medium mb-1">
          Years of Experience <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          max="70"
          placeholder="Years of professional experience"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Your city"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="6-digit pincode"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            pattern="[0-9]{6}"
            maxLength={6}
            required
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handlePrevStep}
          className="flex items-center px-6 py-2 rounded-lg text-blue-500 border border-blue-500 hover:bg-blue-50 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          disabled={!speciality || !yearsOfExperience || !city.trim() || !pincode.trim()}
          className={`flex items-center px-6 py-2 rounded-lg text-white ${
            !speciality || !yearsOfExperience || !city.trim() || !pincode.trim()
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          } transition`}
        >
          Next <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step2ProfessionalDetails;