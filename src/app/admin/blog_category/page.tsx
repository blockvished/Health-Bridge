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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from "@/lib/utils"

interface Category {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
}

const BlogCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'hi', status: 'Active' },
    // Add more categories as needed
  ]);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [editedCategoryName, setEditedCategoryName] = useState('');


  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: categories.length + 1, // Simple ID generation
        name: newCategoryName,
        status: 'Active', // Default status
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName(''); // Reset the input field
      setShowAddCategoryForm(false); // Hide the form
    }
  };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category.id);
        setEditedCategoryName(category.name);
    };

    const handleSaveEdit = (id: number) => {
        if (editedCategoryName.trim()) {
            setCategories(categories.map(cat =>
                cat.id === id ? { ...cat, name: editedCategoryName } : cat
            ));
            setEditingCategory(null);
            setEditedCategoryName('');
        }
    };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button
          onClick={() => setShowAddCategoryForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {showAddCategoryForm && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Add New Category</h3>
          <div className="mb-4">
            <Label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category-name"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-1 border-gray-300 placeholder:text-gray-400"
              placeholder="Enter category name"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddCategory}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
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
              <TableHead className="text-gray-700">Name</TableHead>
              <TableHead className="text-gray-700">Status</TableHead>
              <TableHead className="text-right text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-gray-100/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{category.id}</TableCell>
                <TableCell className="text-gray-900">
                  {editingCategory === category.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        className="w-full border-gray-300 placeholder:text-gray-400"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveEdit(category.id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingCategory(null)}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-sm font-semibold",
                      category.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    )}
                  >
                    {category.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCategory(category)}
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
                          This action cannot be undone. This will permanently delete {category.name} and all its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md transition-colors duration-200">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.id)}
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

export default BlogCategoryPage;
