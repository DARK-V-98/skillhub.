'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { CommunityPost } from '@/lib/types';
import PostCard from '@/components/community/PostCard';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreatePostForm from '@/components/community/CreatePostForm';
import DashboardLayout from '../layout';

export default function CommunityPage() {
  const firestore = useFirestore();
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);

  const postsQuery = firestore
    ? query(collection(firestore, 'communityPosts'), orderBy('createdAt', 'desc'))
    : null;

  const { data: posts, loading } = useCollection<CommunityPost>(postsQuery);

  return (
    <DashboardLayout>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                Community Forum
            </h1>
            <p className="text-muted-foreground mt-1">
                Ask questions, share knowledge, and connect with peers.
            </p>
            </div>
            <Dialog open={isCreatePostOpen} onOpenChange={setCreatePostOpen}>
            <DialogTrigger asChild>
                <Button className="btn-touch-target">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Post
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
                </DialogHeader>
                <CreatePostForm onSuccess={() => setCreatePostOpen(false)} />
            </DialogContent>
            </Dialog>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        ) : (
            <div className="space-y-6">
            {posts && posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No posts yet.</h3>
                <p className="text-muted-foreground mt-2">
                    Be the first to start a conversation!
                </p>
                </div>
            )}
            </div>
        )}
        </div>
    </DashboardLayout>
  );
}
