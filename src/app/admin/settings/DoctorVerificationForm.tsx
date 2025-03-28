// DoctorVerificationForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Info } from "lucide-react"; // Import Trash2 and Info icons

const DoctorVerificationForm: React.FC = () => {
  const [enableVerification, setEnableVerification] = useState(true);
  const [verificationFields, setVerificationFields] = useState([
    "State Medical Council Registration",
    "NHA HPR Registration",
    "IMR Registration",
  ]);

  const handleAddVerificationField = () => {
    setVerificationFields([...verificationFields, ""]); // Add an empty field
  };

  const handleRemoveVerificationField = (index: number) => {
    setVerificationFields(verificationFields.filter((_, i) => i !== index));
  };

  const handleVerificationFieldChange = (index: number, value: string) => {
    const newFields = [...verificationFields];
    newFields[index] = value;
    setVerificationFields(newFields);
  };

  const handleSaveSettings = () => {
    // Implement logic to save doctor verification settings
    console.log("Saving Doctor Verification Settings:", {
      enableVerification,
      verificationFields,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Enable Verification</h2>

      <div className="flex items-center mb-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enableVerification}
            onChange={(e) => setEnableVerification(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-focus:outline-none peer-checked:bg-blue-600 transition-all duration-300">
            <span className="absolute top-0.5 left-0.5 bg-white rounded-full w-4 h-4 transition-transform duration-300 peer-checked:translate-x-4"></span>
          </div>
        </label>
        <span className="ml-2 text-sm">
          Enable to force all doctors to verify their profile to submit the required documents by admin
        </span>
      </div>

      <Button onClick={handleAddVerificationField} className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200">
        + Add New
      </Button>

      {verificationFields.map((field, index) => (
        <div key={index} className="flex items-center mt-2">
          <input
            type="text"
            value={field}
            onChange={(e) => handleVerificationFieldChange(index, e.target.value)}
            className="w-full border rounded-md p-2 mr-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" // Styled input
          />
          <Button variant="outline" onClick={() => handleRemoveVerificationField(index)} className="text-red-500 border-red-500 hover:bg-red-100">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <div className="flex items-start mt-4 bg-blue-50 rounded-md p-3">
        <Info className="w-4 h-4 mr-2 text-blue-500" />
        <p className="text-sm text-gray-600">
          In this section you can add required doctors certificate/document name and files upload option will be shown on doctors panel to verify their account via admin.
        </p>
      </div>

      <Button onClick={handleSaveSettings} className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
        ✓ Save Changes
      </Button>
    </div>
  );
};

export default DoctorVerificationForm;