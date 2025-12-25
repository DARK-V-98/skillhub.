
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, BookText, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreateBlogPostForm from '@/components/blog/CreateBlogPostForm';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function AdminBlogPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const postsQuery = firestore ? query(collection(firestore, 'blogPosts'), orderBy('createdAt', 'desc')) : null;
  const { data: posts, loading } = useCollection<BlogPost>(postsQuery);

  const handleDelete = async (postId: string) => {
    if (!firestore || !window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteDoc(doc(firestore, 'blogPosts', postId));
      toast({ title: 'Success', description: 'Blog post deleted.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete post.' });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreateOpen(true);
  };
  
  const handleCloseDialog = () => {
    setEditingPost(null);
    setIsCreateOpen(false);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookText className="h-8 w-8 text-primary" />
            Manage Blog
          </h1>
          <p className="text-muted-foreground mt-1">Create, edit, and delete blog posts.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Post' : 'Create a New Blog Post'}</DialogTitle>
            </DialogHeader>
            <CreateBlogPostForm onSuccess={handleCloseDialog} postToEdit={editingPost} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card border rounded-lg">
          <div className="divide-y">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="p-4 flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={post.coverImage || 'https://picsum.photos/seed/blog/200/100'}
                      alt={post.title}
                      width={120}
                      height={68}
                      className="rounded-md object-cover aspect-video"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {post.authorName} on {format(new Date(post.createdAt.seconds * 1000), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(post)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="text-center p-12">
                <p className="text-muted-foreground">No blog posts found. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
