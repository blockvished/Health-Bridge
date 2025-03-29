"use client";

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
import { Edit, PlusCircle, Trash2, ArrowLeft } from 'lucide-react';
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

interface Page {
  id: number;
  title: string;
  details: string;
  effectiveDate: string;
}

const PagesPage: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([
    {
      id: 1,
      title: 'Privacy Policy',
      details: 'Live Doctors ( "we," "us," "our" ) respects your privacy and is committed...',
      effectiveDate: '01/01/2024',
    },
    {
      id: 2,
      title: 'Terms of Use',
      details: 'Welcome to Live Doctors, a comprehensive healthcare practice management...',
      effectiveDate: '01/01/2024',
    },
  ]);

  const [showAddPageForm, setShowAddPageForm] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageDetails, setNewPageDetails] = useState('');
  const [newPageEffectiveDate, setNewPageEffectiveDate] = useState('');
  const [editingPage, setEditingPage] = useState<number | null>(null);
  const [editedPageTitle, setEditedPageTitle] = useState('');
  const [editedPageDetails, setEditedPageDetails] = useState('');
  const [editedPageEffectiveDate, setEditedPageEffectiveDate] = useState('');

  const handleAddPage = () => {
    if (newPageTitle.trim() && newPageDetails.trim() && newPageEffectiveDate.trim()) {
      const newPage: Page = {
        id: pages.length + 1,
        title: newPageTitle,
        details: newPageDetails,
        effectiveDate: newPageEffectiveDate,
      };
      setPages([...pages, newPage]);
      setNewPageTitle('');
      setNewPageDetails('');
      setNewPageEffectiveDate('');
      setShowAddPageForm(false);
    }
  };

  const handleEditPage = (page: Page) => {
    setEditingPage(page.id);
    setEditedPageTitle(page.title);
    setEditedPageDetails(page.details);
    setEditedPageEffectiveDate(page.effectiveDate);
  };

  const handleSaveEdit = (id: number) => {
    if (editedPageTitle.trim() && editedPageDetails.trim() && editedPageEffectiveDate.trim()) {
      setPages(pages.map(p =>
        p.id === id ? { ...p, title: editedPageTitle, details: editedPageDetails, effectiveDate: editedPageEffectiveDate } : p
      ));
      setEditingPage(null);
      setEditedPageTitle('');
      setEditedPageDetails('');
      setEditedPageEffectiveDate('');
    }
  };

  const handleDeletePage = (id: number) => {
    setPages(pages.filter((page) => page.id !== id));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      {showAddPageForm ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Page</h3>
            <Button
              onClick={() => setShowAddPageForm(false)}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <div className="mb-4">
            <label htmlFor="page-title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="page-title"
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="mt-1 border-gray-300 placeholder:text-gray-400"
              placeholder="Enter page title"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="page-details" className="block text-sm font-medium text-gray-700 mb-1.5">
              Details <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="page-details"
              value={newPageDetails}
              onChange={(e) => setNewPageDetails(e.target.value)}
              className="mt-1 border-gray-300 placeholder:text-gray-400"
              placeholder="Enter page details"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="page-effective-date" className="block text-sm font-medium text-gray-700 mb-1.5">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <Input
              id="page-effective-date"
              type="text"
              value={newPageEffectiveDate}
              onChange={(e) => setNewPageEffectiveDate(e.target.value)}
              className="mt-1 border-gray-300 placeholder:text-gray-400"
              placeholder="Enter effective date"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddPage}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pages</h2>
            <Button
              onClick={() => setShowAddPageForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add new page
            </Button>
          </div>

          <div className="rounded-md overflow-hidden border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[80px] text-gray-700">#</TableHead>
                  <TableHead className="text-gray-700">Title</TableHead>
                  <TableHead className="text-gray-700">Details</TableHead>
                  <TableHead className="text-gray-700">Effective Date</TableHead>
                  <TableHead className="text-right text-gray-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id} className="hover:bg-gray-100/50 transition-colors">
                    <TableCell className="font-medium text-gray-900">{page.id}</TableCell>
                    <TableCell className="text-gray-900">
                      {editingPage === page.id ? (
                        <Input
                          type="text"
                          value={editedPageTitle}
                          onChange={(e) => setEditedPageTitle(e.target.value)}
                          className="w-full border-gray-300 placeholder:text-gray-400"
                        />
                      ) : (
                        page.title
                      )}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {editingPage === page.id ? (
                        <Textarea
                          value={editedPageDetails}
                          onChange={(e) => setEditedPageDetails(e.target.value)}
                          className="border-gray-300 placeholder:text-gray-400"
                        />
                      ) : (
                        page.details
                      )}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {editingPage === page.id ? (
                        <Input
                          type="text"
                          value={editedPageEffectiveDate}
                          onChange={(e) => setEditedPageEffectiveDate(e.target.value)}
                          className="w-full border-gray-300 placeholder:text-gray-400"
                        />
                      ) : (
                        page.effectiveDate
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {editingPage === page.id ? (
                        <Button
                          onClick={() => handleSaveEdit(page.id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                        >
                          Save
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPage(page)}
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
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white text-gray-900 border-gray-200">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900">Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-700">
                                  This action cannot be undone. This will permanently delete {page.title} and all its data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md transition-colors duration-200">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePage(page.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default PagesPage;