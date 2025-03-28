"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, PlusCircle } from 'lucide-react';
import { cn } from "@/lib/utils"
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
  } from "@/components/ui/alert-dialog"

interface FAQ {
  id: number;
  title: string;
  details: string;
}

const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      title: 'Is there any Mobile App of Live Doctors ?',
      details: 'Yes , Live Doctors has it\'s own mobile app where patients can download it and book their appointment online or offline . Mobile app is free , and doctors can generate their own discount coupons and cashback for their patients too .',
    },
    {
      id: 2,
      title: 'What are The Advantages of Booking an Online Appointment ?',
      details: 'The advantage of booking an online appointment is that you get a confirmed appointment instantly , you can pay online so that you don\'t have to stand in long time queues at the clinic . You will save time and money by booking a doctor\'s appointment online .',
    },
        {
      id: 3,
      title: 'How do I Book Appointment ?',
      details: 'You can book an appointment by selecting your city and searching for a specific specialist doctor from the search bar . You will see city , department , experience and search by name options , from which you can pick one and request for an appointment online or offline .',
    },
        {
      id: 4,
      title: 'What is Landing Page ?',
      details: 'Landing page is specially designed SEO friendly webpage for doctor\'s brand & logo . Doctor\'s information , core expertise , scope of work , images , videos will be shown to potential patients .',
    },
        {
      id: 5,
      title: 'What is Live Doctor\'s Practice Management CRM ?',
      details: 'Live Doctor\'s practice management CRM is a type of software that helps healthcare and medical practices streamline their complete business operations . It can manage a variety of tasks , including : Scheduling Appointments Tracking Patient Records Communicating ...',
    },
        {
      id: 6,
      title: 'What is Live Doctor Platform ?',
      details: 'We are one stop solutions for medical practitioner\'s growth journey to increase their patient foot fall by 2 to 5 times . Our practice management solutions are specially designed for all type of doctors and medical practitioners .',
    },
  ]);

  const [showAddFAQForm, setShowAddFAQForm] = useState(false);
  const [newFAQTitle, setNewFAQTitle] = useState('');
  const [newFAQDetails, setNewFAQDetails] = useState('');
    const [editingFAQ, setEditingFAQ] = useState<number | null>(null);
      const [editedFAQTitle, setEditedFAQTitle] = useState('');
    const [editedFAQDetails, setEditedFAQDetails] = useState('');


  const handleAddFAQ = () => {
    if (newFAQTitle.trim() && newFAQDetails.trim()) {
      const newFAQ: FAQ = {
        id: faqs.length + 1,
        title: newFAQTitle,
        details: newFAQDetails,
      };
      setFaqs([...faqs, newFAQ]);
      setNewFAQTitle('');
      setNewFAQDetails('');
      setShowAddFAQForm(false);
    }
  };

    const handleEditFAQ = (faq: FAQ) => {
        setEditingFAQ(faq.id);
        setEditedFAQTitle(faq.title);
        setEditedFAQDetails(faq.details);
    };

      const handleSaveEdit = (id: number) => {
        if (editedFAQTitle.trim() && editedFAQDetails.trim()) {
            setFaqs(faqs.map(p =>
                p.id === id ? { ...p, title: editedFAQTitle, details: editedFAQDetails} : p
            ));
            setEditingFAQ(null);
            setEditedFAQTitle('');
            setEditedFAQDetails('');
        }
    };

  const handleDeleteFAQ = (id: number) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All FAQs</h2>
        <Button
          onClick={() => setShowAddFAQForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New FAQ
        </Button>
      </div>

      {showAddFAQForm && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Add New FAQ</h3>
          <div className="mb-4">
            <label htmlFor="faq-title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="faq-title"
              type="text"
              value={newFAQTitle}
              onChange={(e) => setNewFAQTitle(e.target.value)}
              className="mt-1 border-gray-300 placeholder:text-gray-400"
              placeholder="Enter FAQ title"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="faq-details" className="block text-sm font-medium text-gray-700 mb-1.5">
              Details <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="faq-details"
              value={newFAQDetails}
              onChange={(e) => setNewFAQDetails(e.target.value)}
              className="mt-1 border-gray-300 placeholder:text-gray-400"
              placeholder="Enter FAQ details"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddFAQ}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[80px] text-gray-700">#</TableHead>
              <TableHead className="text-gray-700">Title</TableHead>
              <TableHead className="text-gray-700">Details</TableHead>
              <TableHead className="text-right text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id} className="hover:bg-gray-100/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{faq.id}</TableCell>
                <TableCell className="text-gray-900">
                 {editingFAQ === faq.id ? (
                    <Input
                        type="text"
                        value={editedFAQTitle}
                        onChange={(e) => setEditedFAQTitle(e.target.value)}
                        className="w-full border-gray-300 placeholder:text-gray-400"
                    />
                    ) : (
                        faq.title
                    )}
                </TableCell>
                <TableCell className="text-gray-900">
                 {editingFAQ === faq.id ? (
                    <Textarea
                        value={editedFAQDetails}
                        onChange={(e) => setEditedFAQDetails(e.target.value)}
                        className="border-gray-300 placeholder:text-gray-400"
                    />
                    ) : (
                     faq.details
                    )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditFAQ(faq)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        {/* */}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white text-gray-900 border-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-700">
                          This action cannot be undone. This will permanently delete {faq.title} and all its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md transition-colors duration-200">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FAQPage;
