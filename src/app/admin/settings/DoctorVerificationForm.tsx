// DoctorVerificationForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Info } from "lucide-react"; // Import Trash2 and Info icons

const DoctorVerificationForm: React.FC = () => {
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
      verificationFields,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Enable Verification</h2>

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