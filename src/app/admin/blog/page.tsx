"use client"

import React, { useState, useCallback } from 'react';
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
import { Edit, Trash2, PlusCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

interface BlogPost {
  id: number;
  title: string;
  details: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  thumbnail?: string; // Optional thumbnail URL
}

const BlogPostsPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    { id: 1, title: 'First Blog Post', details: 'This is the first blog post.', status: 'Published', thumbnail: 'https://placehold.co/150x100/EEE/31343C' },
    { id: 2, title: 'Second Post', details: 'A second entry for the blog.', status: 'Draft', thumbnail: 'https://placehold.co/150x100/EEE/31343C' },
  ]);
  const [showAddPostForm, setShowAddPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState<number | null>(null);
    const [editedPostTitle, setEditedPostTitle] = useState('');
    const [editedPostDetails, setEditedPostDetails] = useState('');
    const [editedPostThumbnail, setEditedPostThumbnail] = useState('');
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostDetails, setNewPostDetails] = useState('');
    const [newPostThumbnail, setNewPostThumbnail] = useState('');


    // Function to handle form submission (add or update post)
    const handleSavePost = useCallback(() => {
        if (editingPost) {
            // Update existing post
            setBlogPosts(
                blogPosts.map((post) =>
                    post.id === editingPost
                        ? { ...post, title: editedPostTitle, details: editedPostDetails, thumbnail: editedPostThumbnail }
                        : post
                )
            );
            setEditingPost(null);
        } else {
            // Add new post
            const newPost: BlogPost = {
                id: blogPosts.length + 1,
                title: newPostTitle,
                details: newPostDetails,
                status: 'Draft', // Default status
                thumbnail: newPostThumbnail,
            };
            setBlogPosts([...blogPosts, newPost]);
        }
        // Reset form and hide add/edit form
        setNewPostTitle('');
        setNewPostDetails('');
        setNewPostThumbnail('');
        setEditingPost(null);
        setShowAddPostForm(false);
    }, [blogPosts, editingPost, newPostDetails, newPostTitle, newPostThumbnail]);

    const handleEditPost = (post: BlogPost) => {
        setEditingPost(post.id);
        setEditedPostTitle(post.title);
        setEditedPostDetails(post.details);
        setEditedPostThumbnail(post.thumbnail || '');
        setShowAddPostForm(true); // Show the form for editing
    };

  const handleDeletePost = (id: number) => {
    setBlogPosts(blogPosts.filter((post) => post.id !== id));
  };

    const renderAddEditPostForm = () => (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{editingPost ? 'Edit Post' : 'Add New Post'}</CardTitle>
                <CardDescription>
                    {editingPost ? 'Modify the post details below.' : 'Enter the post details to create a new blog post.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Title Input */}
                    <div>
                        <Label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={editingPost ? editedPostTitle : newPostTitle}
                            onChange={(e) => editingPost ? setEditedPostTitle(e.target.value) : setNewPostTitle(e.target.value)}
                            className="mt-1"
                            placeholder="Enter post title"
                        />
                    </div>

                    {/* Details Input */}
                    <div>
                        <Label htmlFor="details" className="block text-sm font-medium text-gray-700">
                            Details <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="details"
                            value={editingPost ? editedPostDetails : newPostDetails}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => editingPost ? setEditedPostDetails(e.target.value) : setNewPostDetails(e.target.value)}
                            className="mt-1"
                            placeholder="Enter post details"
                        />
                    </div>

                    {/* Thumbnail Input */}
                    <div>
                        <Label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                            Thumbnail
                        </Label>
                        <Input
                            id="thumbnail"
                            type="url"
                            value={editingPost ? editedPostThumbnail : newPostThumbnail}
                            onChange={(e) => editingPost ? setEditedPostThumbnail(e.target.value) : setNewPostThumbnail(e.target.value)}
                            className="mt-1"
                            placeholder="Enter thumbnail URL"
                        />
                    </div>

                    {/* Submit/Cancel Buttons */}
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAddPostForm(false);
                                setEditingPost(null);
                                setNewPostTitle('');
                                setNewPostDetails('');
                                setNewPostThumbnail('');
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-900"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSavePost}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {editingPost ? 'Update Post' : 'Save Post'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const renderBlogPostsTable = () => (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">All Blog Posts</h2>
                <Button
                    onClick={() => {
                        setShowAddPostForm(true);
                        setEditingPost(null); // Ensure we are in add mode
                        setNewPostTitle('');
                        setNewPostDetails('');
                        setNewPostThumbnail('');
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    Add New Post
                </Button>
            </div>
            <div className="rounded-md overflow-hidden border border-gray-200">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[80px] text-gray-700">#</TableHead>
                            <TableHead className="w-[120px] text-gray-700">Thumbnail</TableHead>
                            <TableHead className="text-gray-700">Title</TableHead>
                            <TableHead className="text-gray-700">Details</TableHead>
                            <TableHead className="text-gray-700">Status</TableHead>
                            <TableHead className="text-right text-gray-700">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogPosts.map((post) => (
                            <TableRow key={post.id} className="hover:bg-gray-100/50 transition-colors">
                                <TableCell className="font-medium text-gray-900">{post.id}</TableCell>
                                <TableCell>
                                    {post.thumbnail ? (
                                        <img src={post.thumbnail} alt={post.title} className="w-full h-auto rounded-md" />
                                    ) : (
                                        <div className="w-full h-20 flex items-center justify-center rounded-md bg-gray-200">
                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-gray-900">{post.title}</TableCell>
                                <TableCell className="text-gray-900">{post.details}</TableCell>
                                <TableCell>
                                    <span
                                        className={cn(
                                            "px-2 py-1 rounded-full text-sm font-semibold",
                                            post.status === 'Published'
                                                ? 'bg-green-100 text-green-800'
                                                : post.status === 'Draft'
                                                    ? 'bg-gray-100 text-gray-800'
                                                    : 'bg-yellow-100 text-yellow-800' // Scheduled
                                        )}
                                    >
                                        {post.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditPost(post)}
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
                                                    This action cannot be undone. This will permanently delete {post.title} and all its data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md transition-colors duration-200">
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeletePost(post.id)}
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
        </>
    )

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      {showAddPostForm ? renderAddEditPostForm() : renderBlogPostsTable()}
    </div>
  );
};

export default BlogPostsPage;

