"use client";

import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Drug {
  id: number;
  name: string;
  genericName?: string;
  brandName?: string;
  details?: string;
}

// Drug Form Component
const DrugForm: React.FC<{
  onClose: () => void;
  drug?: Drug;
  onSubmit: (drug: Drug) => void;
}> = ({ onClose, drug, onSubmit }) => {
  const [formData, setFormData] = useState<Drug>({
    id: drug?.id || Date.now(),
    name: drug?.name || "",
    genericName: drug?.genericName || "",
    brandName: drug?.brandName || "",
    details: drug?.details || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="p-3">
      <div className="bg-white shadow-md rounded-xl max-w-4xl mx-auto w-full p-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {drug ? "Edit Drug" : "Create New"}
          </h2>
          <Button onClick={onClose} variant="outline" size="sm">
            ≡ Drugs
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Generic Name
            </label>
            <Input
              type="text"
              name="genericName"
              value={formData.genericName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">
              Brand Name
            </label>
            <Input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Details</label>
            <Textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="h-24"
            />
          </div>

          <Button type="submit">
            ✓ Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

// Main Drugs Component
const Drugs: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [drugs, setDrugs] = useState<Drug[]>([
    { id: 1, name: "Avil", details: "Used for allergies and cold symptoms." },
    {
      id: 2,
      name: "Crocin",
      genericName: "Paracetamol",
      brandName: "Cipla",
      details: "Paracetamol 350 mg",
    },
  ]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | undefined>(undefined);

  const handleDelete = (id: number) => {
    setDrugs(drugs.filter((drug) => drug.id !== id));
  };

  const handleEdit = (drug: Drug) => {
    setSelectedDrug(drug);
    setShowForm(true);
  };

  const handleFormSubmit = (drug: Drug) => {
    if (selectedDrug) {
      setDrugs(drugs.map((d) => (d.id === drug.id ? drug : d)));
    } else {
      setDrugs([...drugs, drug]);
    }
    setSelectedDrug(undefined);
  };

  if (showForm)
    return (
      <DrugForm
        onClose={() => setShowForm(false)}
        drug={selectedDrug}
        onSubmit={handleFormSubmit}
      />
    );

  return (
    <div className="p-3">
      {/* Main Container */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden max-w-4xl mx-auto w-full p-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Drugs</h1>
          <Button onClick={() => setShowForm(true)}>+ Add new drug</Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-0">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left p-3 font-medium">#</th>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Details</th>
                <th className="text-left p-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {drugs.map((drug, index) => (
                <tr
                  key={drug.id}
                  className="hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="p-3 text-gray-700">{index + 1}</td>
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">{drug.name}</div>
                  </td>
                  <td className="p-3 text-gray-700 whitespace-pre-line">
                    {drug.details}
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(drug)}
                    >
                      <FaEdit className="text-gray-600" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <FaTrashAlt className="text-white" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete {drug.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(drug.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Drugs;