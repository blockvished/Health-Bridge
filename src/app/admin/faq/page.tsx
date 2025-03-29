"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, PlusCircle, ArrowLeft } from "lucide-react";

interface FAQ {
  id: number;
  title: string;
  details: string;
}

// AddFAQ Component
const AddFAQComponent: React.FC<{
  onSave: (title: string, details: string) => void;
  onBack: () => void;
}> = ({ onSave, onBack }) => {
  const [newFAQTitle, setNewFAQTitle] = useState("");
  const [newFAQDetails, setNewFAQDetails] = useState("");

  const handleSave = () => {
    if (newFAQTitle.trim() && newFAQDetails.trim()) {
      onSave(newFAQTitle, newFAQDetails);
      setNewFAQTitle("");
      setNewFAQDetails("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-800">Add New FAQ</h2>
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded h-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back
        </Button>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <label
            htmlFor="faq-title"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="faq-title"
            type="text"
            value={newFAQTitle}
            onChange={(e) => setNewFAQTitle(e.target.value)}
            className="h-9 text-sm"
            placeholder="Enter FAQ title"
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="faq-details"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Details <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="faq-details"
            value={newFAQDetails}
            onChange={(e) => setNewFAQDetails(e.target.value)}
            className="text-sm"
            placeholder="Enter FAQ details"
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-8"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main FAQPage Component
const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      title: "Is there any Mobile App of Live Doctors?",
      details:
        "Yes, Live Doctors has it's own mobile app where patients can download it and book their appointment online or offline. Mobile app is free, and doctors can generate their own discount coupons and cashback for their patients too.",
    },
    {
      id: 2,
      title: "What are The Advantages of Booking an Online Appointment?",
      details:
        "The advantage of booking an online appointment is that you get a confirmed appointment instantly, you can pay online so that you don't have to stand in long time queues at the clinic. You will save time and money by booking a doctor's appointment online.",
    },
    {
      id: 3,
      title: "How do I Book Appointment?",
      details:
        "You can book an appointment by selecting your city and searching for a specific specialist doctor from the search bar. You will see city, department, experience and search by name options, from which you can pick one and request for an appointment - online or offline.",
    },
    {
      id: 4,
      title: "What is Landing Page?",
      details:
        "Landing page is specially designed SEO friendly webpage for doctor's brand & logo. Doctor's information, core expertise, scope of work, images, videos will be shown to potential patients.",
    },
    {
      id: 5,
      title: "What is Live Doctor's Practice Management CRM?",
      details:
        "Live Doctor's practice management CRM is a type of software that helps healthcare and medical practices streamline their complete business operations. It can manage a variety of tasks, including: Scheduling Appointments Tracking Patient Records Communicating...",
    },
    {
      id: 6,
      title: "What is Live Doctor Platform?",
      details:
        "We are one stop solutions for medical practitioner's growth journey to increase their patient foot fall by 2 to 5 times. Our practice management solutions are specially designed for all type of doctors and medical practitioners.",
    },
  ]);

  const [showAddFAQForm, setShowAddFAQForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<number | null>(null);
  const [editedFAQTitle, setEditedFAQTitle] = useState("");
  const [editedFAQDetails, setEditedFAQDetails] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    id: number | null;
  }>({ show: false, id: null });

  const handleAddFAQ = (title: string, details: string) => {
    const newFAQ: FAQ = {
      id: faqs.length + 1,
      title: title,
      details: details,
    };
    setFaqs([...faqs, newFAQ]);
    setShowAddFAQForm(false);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq.id);
    setEditedFAQTitle(faq.title);
    setEditedFAQDetails(faq.details);
  };

  const handleSaveEdit = (id: number) => {
    if (editedFAQTitle.trim() && editedFAQDetails.trim()) {
      setFaqs(
        faqs.map((p) =>
          p.id === id
            ? { ...p, title: editedFAQTitle, details: editedFAQDetails }
            : p
        )
      );
      setEditingFAQ(null);
      setEditedFAQTitle("");
      setEditedFAQDetails("");
    }
  };

  const handleDeleteFAQ = (id: number) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
    setDeleteConfirmation({ show: false, id: null });
  };

  const confirmDelete = (id: number) => {
    setDeleteConfirmation({ show: true, id });
  };

  // If Add FAQ is shown, render the AddFAQComponent
  if (showAddFAQForm) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <AddFAQComponent
          onSave={handleAddFAQ}
          onBack={() => setShowAddFAQForm(false)}
        />
      </div>
    );
  }

  // Otherwise render the main FAQ list
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-800">All Faqs</h2>
          <Button
            onClick={() => setShowAddFAQForm(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded h-8"
          >
            <PlusCircle className="w-3 h-3" />
            Add New FAQ
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 w-12 font-medium text-gray-700">#</th>
                <th className="px-4 py-3 w-64 font-medium text-gray-700">Title</th>
                <th className="px-4 py-3 font-medium text-gray-700">Details</th>
                <th className="px-4 py-3 w-24 text-right font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-700">{faq.id}</td>
                  <td className="px-4 py-3 text-gray-800 align-top">
                    {editingFAQ === faq.id ? (
                      <Input
                        type="text"
                        value={editedFAQTitle}
                        onChange={(e) => setEditedFAQTitle(e.target.value)}
                        className="w-full h-9 text-sm"
                      />
                    ) : (
                      faq.title
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-800 align-top">
                    {editingFAQ === faq.id ? (
                      <Textarea
                        value={editedFAQDetails}
                        onChange={(e) => setEditedFAQDetails(e.target.value)}
                        className="text-sm"
                      />
                    ) : (
                      faq.details
                    )}
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    {editingFAQ === faq.id ? (
                      <Button
                        onClick={() => handleSaveEdit(faq.id)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white h-7 w-7 p-0 rounded-md"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <Button
                          onClick={() => handleEditFAQ(faq)}
                          size="sm"
                          variant="outline"
                          className="bg-gray-100 hover:bg-gray-200 border-gray-200 h-7 w-7 p-0 rounded-md"
                        >
                          <Edit className="h-3 w-3 text-gray-600" />
                        </Button>
                        <Button
                          onClick={() => confirmDelete(faq.id)}
                          size="sm"
                          variant="outline"
                          className="bg-pink-50 hover:bg-pink-100 border-pink-200 h-7 w-7 p-0 rounded-md"
                        >
                          <Trash2 className="h-3 w-3 text-pink-500" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
            <p className="text-lg font-medium mb-3">Confirm Deletion</p>
            <p className="mb-4 text-sm text-gray-600">Are you sure you want to delete this FAQ?</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmation({ show: false, id: null })}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteFAQ(deleteConfirmation.id!)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs h-8"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage;