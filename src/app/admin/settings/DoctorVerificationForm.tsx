// DoctorVerificationForm.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Info, Loader2, AlertCircle, Plus, X } from "lucide-react";

interface VerificationDocument {
  id?: number; // Make id optional for new items
  name: string;
  isNew?: boolean; // Flag to identify new items
}

interface ApiResponse {
  success: boolean;
  data?: VerificationDocument | VerificationDocument[];
  message?: string;
  error?: string;
}

interface DeleteConfirmationProps {
  isOpen: boolean;
  documentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  documentName,
  onConfirm,
  onCancel,
  isDeleting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={isDeleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
            <span className="text-gray-700">Are you sure you want to delete this document?</span>
          </div>
          
          <div className="bg-gray-50 rounded-md p-3 border">
            <p className="font-medium text-gray-900">{documentName}</p>
          </div>
          
          <p className="text-sm text-red-600 mt-3">
            This action cannot be undone. Doctors will no longer be required to upload this document.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              'Delete Document'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const DoctorVerificationForm: React.FC = () => {
  const [verificationFields, setVerificationFields] = useState<VerificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    index: number;
    documentName: string;
  }>({
    isOpen: false,
    index: -1,
    documentName: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch existing verification documents on component mount
  useEffect(() => {
    fetchVerificationDocuments();
  }, []);

  const fetchVerificationDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching documents from /api/admin/settings/doctor_verification');
      
      const response = await fetch('/api/admin/settings/doctor_verification');
      
      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', response.headers);
      
      if (!response.ok) {
        // Handle 404 or other errors gracefully
        if (response.status === 404) {
          console.log('API route not found, showing empty state');
          setVerificationFields([]);
          setLoading(false);
          return;
        }
        
        const errorText = await response.text();
        console.error('Fetch response error:', errorText);
        
        // Check if it's HTML (404 page)
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html>')) {
          setError('API route not found. Please ensure /api/admin/settings/doctor_verification route exists.');
        } else {
          setError(`Failed to fetch documents: ${response.status} ${response.statusText}`);
        }
        
        setVerificationFields([]);
        setLoading(false);
        return;
      }

      const result: ApiResponse = await response.json();
      console.log('Fetch result:', result);

      if (result.success && Array.isArray(result.data)) {
        setVerificationFields(result.data);
      } else if (result.success && !result.data) {
        // Handle case where API returns success but no data
        setVerificationFields([]);
      } else {
        setError('Failed to fetch verification documents');
        setVerificationFields([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      
      // Better error handling for different types of errors
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Network error: Could not connect to the server. Please check if the server is running.');
      } else if (err instanceof SyntaxError && err.message.includes('Unexpected token')) {
        setError('Server returned invalid response. The API route may not exist or is returning HTML instead of JSON.');
      } else {
        setError('Error fetching verification documents. Please check the console for details.');
      }
      
      setVerificationFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVerificationField = () => {
    const newField: VerificationDocument = {
      name: '',
      isNew: true
    };
    
    setVerificationFields([...verificationFields, newField]);
    setHasChanges(true);
  };

  const handleDeleteClick = (index: number) => {
    const field = verificationFields[index];
    const documentName = field.name || 'Untitled Document';
    
    setDeleteConfirmation({
      isOpen: true,
      index,
      documentName
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      index: -1,
      documentName: ''
    });
  };

  const handleDeleteConfirm = async () => {
    const index = deleteConfirmation.index;
    const field = verificationFields[index];
    
    // If it's a new field (not saved yet), just remove from local state
    if (field.isNew || !field.id) {
      const newFields = verificationFields.filter((_, i) => i !== index);
      setVerificationFields(newFields);
      setHasChanges(newFields.some(f => f.isNew) || newFields.length === 0);
      setDeleteConfirmation({ isOpen: false, index: -1, documentName: '' });
      return;
    }

    // If it's an existing field, call the API to delete it
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/admin/settings/doctor_verification/${field.id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setVerificationFields(verificationFields.filter((_, i) => i !== index));
        setSuccess('Document removed successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Failed to remove document');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Error removing document');
      setTimeout(() => setError(null), 3000);
      console.error('Remove error:', err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation({ isOpen: false, index: -1, documentName: '' });
    }
  };

  const handleVerificationFieldChange = (index: number, value: string) => {
    const newFields = [...verificationFields];
    newFields[index] = { ...newFields[index], name: value };
    setVerificationFields(newFields);
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Filter out empty fields
      const validFields = verificationFields.filter(field => field.name.trim() !== '');
      
      if (validFields.length === 0) {
        setError('Please add at least one document name before saving.');
        setSaving(false);
        return;
      }

      console.log('Saving documents:', validFields);

      // Use bulk update approach - send all documents at once
      const response = await fetch('/api/admin/settings/doctor_verification', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          documents: validFields.map(field => ({
            id: field.id,
            name: field.name.trim()
          }))
        }),
      });

      console.log('Save response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save response error:', errorText);
        
        // Check if it's HTML (404 page)
        if (errorText.includes('<!DOCTYPE') || errorText.includes('<html>')) {
          setError('API route not found. Please check your API setup.');
        } else {
          setError(`Failed to save: ${response.status} ${response.statusText}`);
        }
        setSaving(false);
        return;
      }

      const result: ApiResponse = await response.json();
      console.log('Save result:', result);

      if (result.success) {
        setSuccess('All changes saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
        setHasChanges(false);
        // Refresh data to ensure consistency
        await fetchVerificationDocuments();
      } else {
        setError(result.error || 'Failed to save documents');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error('Save error:', err);
      
      // Better error handling for different types of errors
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Network error: Could not connect to the server. Please check if the server is running.');
      } else if (err instanceof SyntaxError && err.message.includes('Unexpected token')) {
        setError('Server returned invalid response. The API route may not exist or is returning HTML instead of JSON.');
      } else {
        setError('Error saving changes. Please check the console for details.');
      }
      
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    fetchVerificationDocuments();
    setHasChanges(false);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading verification documents...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Doctor Verification Documents</h2>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
          <Info className="w-4 h-4 mr-2 text-green-500" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Empty State */}
      {verificationFields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center">
            <Info className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No verification documents</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              Add required doctor certificate/document names. Upload options will be shown on doctors panel to verify their accounts.
            </p>
            <Button 
              onClick={handleAddVerificationField} 
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={saving}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Document
            </Button>
          </div>
        </div>
      )}

      {/* Document Fields */}
      {verificationFields.length > 0 && (
        <div className="space-y-3">
          {verificationFields.map((field, index) => (
            <div key={`${field.id || 'new'}-${index}`} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => handleVerificationFieldChange(index, e.target.value)}
                  className="w-full border rounded-md p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter verification document name (e.g., Medical License, Board Certification)"
                  disabled={saving}
                />
                {field.isNew && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleDeleteClick(index)} 
                className="text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400 p-3"
                disabled={saving}
                title="Remove this document"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* Add More Button */}
          <Button 
            onClick={handleAddVerificationField} 
            variant="outline"
            className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 py-3"
            disabled={saving}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Document
          </Button>
        </div>
      )}

      {/* Info Section */}
      <div className="flex items-start mt-6 bg-blue-50 rounded-md p-4">
        <Info className="w-5 h-5 mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">How this works:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-600">
            <li>Add the names of documents doctors need to upload for verification</li>
            <li>Doctors will see these as required upload fields in their panel</li>
            <li>Admins can review and approve the uploaded documents</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      {verificationFields.length > 0 && (
        <div className="flex gap-3 mt-6">
          <Button 
            onClick={handleSaveSettings} 
            className="bg-blue-500 text-white hover:bg-blue-600 flex-1"
            disabled={saving || !hasChanges}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving Changes...
              </>
            ) : (
              <>
                ✓ Save All Changes
                {hasChanges && <span className="ml-1">({verificationFields.filter(f => f.isNew).length} new)</span>}
              </>
            )}
          </Button>
          
          {hasChanges && (
            <Button 
              onClick={handleDiscardChanges}
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
              disabled={saving}
            >
              Discard Changes
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        documentName={deleteConfirmation.documentName}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DoctorVerificationForm;