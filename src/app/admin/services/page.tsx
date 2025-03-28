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
import { Edit, Trash2, PlusCircle, Image as ImageIcon } from 'lucide-react';
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

interface Service {
  id: number;
  thumbnail?: string;
  name: string;
  details: string;
}

const AllServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      thumbnail: 'https://placehold.co/100x100/EEE/31343C',
      name: '24/7 Access to Expert Support',
      details: 'Live Doctors understands the critical nature of continuous, uninterrupted service...',
    },
    {
      id: 2,
      thumbnail: 'https://placehold.co/100x100/EEE/31343C',
      name: 'Enhanced Marketing & Promotion',
      details: 'Live Doctors provides advanced marketing and promotion tools to boost the visibility...',
    },
    {
      id: 3,
      thumbnail: 'https://placehold.co/100x100/EEE/31343C',
      name: 'Efficient Practice Management',
      details: 'We offer a comprehensive practice management system that enhances the efficiency...',
    },
  ]);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDetails, setNewServiceDetails] = useState('');
  const [newServiceThumbnail, setNewServiceThumbnail] = useState('');
    const [editingService, setEditingService] = useState<number | null>(null);
    const [editedServiceName, setEditedServiceName] = useState('');
    const [editedServiceDetails, setEditedServiceDetails] = useState('');
    const [editedServiceThumbnail, setEditedServiceThumbnail] = useState('');


  const handleAddService = () => {
    if (newServiceName.trim() && newServiceDetails.trim()) {
      const newService: Service = {
        id: services.length + 1,
        name: newServiceName,
        details: newServiceDetails,
        thumbnail: newServiceThumbnail,
      };
      setServices([...services, newService]);
      setNewServiceName('');
      setNewServiceDetails('');
      setNewServiceThumbnail('');
      setShowAddServiceForm(false);
    }
  };

    const handleEditService = (service: Service) => {
        setEditingService(service.id);
        setEditedServiceName(service.name);
        setEditedServiceDetails(service.details);
        setEditedServiceThumbnail(service.thumbnail || '');
    };

    const handleSaveEdit = (id: number) => {
        if (editedServiceName.trim() && editedServiceDetails.trim()) {
            setServices(services.map(s =>
                s.id === id ? { ...s, name: editedServiceName, details: editedServiceDetails, thumbnail: editedServiceThumbnail } : s
            ));
            setEditingService(null);
            setEditedServiceName('');
            setEditedServiceDetails('');
            setEditedServiceThumbnail('');
        }
    };

  const handleDeleteService = (id: number) => {
    setServices(services.filter((service) => service.id !== id));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Services</h2>
        <Button
          onClick={() => setShowAddServiceForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New service
        </Button>
      </div>

      {showAddServiceForm && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Add New Service</h3>
          <div className="mb-4">
            <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="service-name"
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="mt-1 border-gray-300 placeholder:text-gray-400"
              placeholder="Enter service name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="service-details" className="block text-sm font-medium text-gray-700 mb-1.5">
              Details <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="service-details"
              value={newServiceDetails}
              onChange={(e) => setNewServiceDetails(e.target.value)}
              className="mt-1 border-gray-300 placeholder:text-gray-400"
              placeholder="Enter service details"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="service-thumbnail" className="block text-sm font-medium text-gray-700 mb-1.5">
              Thumbnail
            </label>
            <Input
              id="service-thumbnail"
              type="text"
              value={newServiceThumbnail}
              onChange={(e) => setNewServiceThumbnail(e.target.value)}
              className="mt-1 border-gray-300 placeholder:text-gray-400"
              placeholder="Enter thumbnail URL"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddService}
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
              <TableHead className="w-[120px] text-gray-700">Thumbnail</TableHead>
              <TableHead className="text-gray-700">Name</TableHead>
              <TableHead className="text-gray-700">Details</TableHead>
              <TableHead className="text-right text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="hover:bg-gray-100/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{service.id}</TableCell>
                <TableCell>
                  {service.thumbnail ? (
                    <img src={service.thumbnail} alt={service.name} className="w-full h-auto rounded-md" />
                  ) : (
                    <div className="w-full h-20 flex items-center justify-center rounded-md bg-gray-200">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-gray-900">
                {editingService === service.id ? (
                    <Input
                        type="text"
                        value={editedServiceName}
                        onChange={(e) => setEditedServiceName(e.target.value)}
                        className="w-full border-gray-300 placeholder:text-gray-400"
                    />
                    ) : (
                        service.name
                    )}
                </TableCell>
                <TableCell className="text-gray-900">
                {editingService === service.id ? (
                    <Textarea
                        value={editedServiceDetails}
                        onChange={(e) => setEditedServiceDetails(e.target.value)}
                        className="border-gray-300 placeholder:text-gray-400"
                    />
                    ) : (
                        service.details
                    )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditService(service)}
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
                          This action cannot be undone. This will permanently delete {service.name} and all its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md transition-colors duration-200">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteService(service.id)}
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

export default AllServicesPage;
