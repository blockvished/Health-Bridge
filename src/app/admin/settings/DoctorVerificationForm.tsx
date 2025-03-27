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
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <span className="ml-2">Enable to force all doctors to verify their profile to submit the required documents by admin</span>
      </div>

      <Button onClick={handleAddVerificationField} className="mt-4">
        Add New
      </Button>

      {verificationFields.map((field, index) => (
        <div key={index} className="flex items-center mt-2">
          <input
            type="text"
            value={field}
            onChange={(e) => handleVerificationFieldChange(index, e.target.value)}
            className="w-full border rounded-lg p-2 mr-2"
          />
          <Button variant="outline" onClick={() => handleRemoveVerificationField(index)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <div className="flex items-start mt-4">
        <Info className="w-4 h-4 mr-2 text-blue-500" />
        <p className="text-sm">
          In this section you can add required doctors certificate/document name and files upload option will be shown on doctors panel to verify their account via admin.
        </p>
      </div>

      <Button onClick={handleSaveSettings} className="mt-4">
        Save Changes
      </Button>
    </div>
  );
};

export default DoctorVerificationForm;