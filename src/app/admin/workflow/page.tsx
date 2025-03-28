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
import { Label } from "@/components/ui/label"
import { Edit } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

interface WorkflowStep {
  id: number;
  image?: string;
  title: string;
  details: string;
}

const WorkflowPage: React.FC = () => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 1,
      image: 'https://placehold.co/100x100/EEE/31343C', // Example URL, replace as needed
      title: 'Select Plan',
      details: 'Choose your comfortable plan as per your practice requirements.',
    },
    {
      id: 2,
      image: 'https://placehold.co/100x100/EEE/31343C', // Example URL
      title: 'Get Paid',
      details: 'Paid via online payment gateways',
    },
    {
      id: 3,
      image: 'https://placehold.co/100x100/EEE/31343C', // Example URL
      title: 'Start Working',
      details: 'Start using and explore the features',
    },
  ]);

  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [editedStepTitle, setEditedStepTitle] = useState('');
  const [editedStepDetails, setEditedStepDetails] = useState('');
  const [editedStepImage, setEditedStepImage] = useState('');

  const handleEditStep = (step: WorkflowStep) => {
    setEditingStep(step.id);
    setEditedStepTitle(step.title);
    setEditedStepDetails(step.details);
    setEditedStepImage(step.image || ''); // Ensure we handle null/undefined
  };

    const handleSaveEdit = (id: number) => {
        setWorkflowSteps(workflowSteps.map(step =>
            step.id === id ? { ...step, title: editedStepTitle, details: editedStepDetails, image: editedStepImage } : step
        ));
        setEditingStep(null);
        setEditedStepTitle('');
        setEditedStepDetails('');
        setEditedStepImage('');
    };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Workflow</h2>

      <div className="rounded-md overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[80px] text-gray-700">#</TableHead>
              <TableHead className="w-[120px] text-gray-700">Image</TableHead>
              <TableHead className="text-gray-700">Title</TableHead>
              <TableHead className="text-gray-700">Details</TableHead>
              <TableHead className="text-right text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflowSteps.map((step) => (
              <TableRow key={step.id} className="hover:bg-gray-100/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{step.id}</TableCell>
                <TableCell>
                  {step.image ? (
                    <img src={step.image} alt={step.title} className="w-full h-auto rounded-md" />
                  ) : (
                    <div className="w-full h-20 flex items-center justify-center rounded-md bg-gray-200">
                      {/* You can use a placeholder icon here if you have one */}
                      <span>No Image</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-gray-900">
                {editingStep === step.id ? (
                    <Input
                        type="text"
                        value={editedStepTitle}
                        onChange={(e) => setEditedStepTitle(e.target.value)}
                        className="w-full border-gray-300 placeholder:text-gray-400"
                    />
                    ) : (
                        step.title
                    )}
                </TableCell>
                <TableCell className="text-gray-900">
                {editingStep === step.id ? (
                    <Textarea
                        value={editedStepDetails}
                        onChange={(e) => setEditedStepDetails(e.target.value)}
                        className="border-gray-300 placeholder:text-gray-400"
                    />
                    ) : (
                        step.details
                    )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                {editingStep === step.id ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveEdit(step.id)}
                        className="text-green-500 hover:text-green-600"
                    >

                    </Button>
                    ) : (
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditStep(step)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WorkflowPage;
