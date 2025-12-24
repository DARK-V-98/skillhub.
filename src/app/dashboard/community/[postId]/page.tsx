'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { doc, collection, query, orderBy, addDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { CommunityPost, CommunityComment } from '@/lib/types';
import { Loader2, MessageSquare, ThumbsDown, ThumbsUp, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';

const PostPage = () => {
    const params = useParams();
    const postId = params.postId as string;
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();

    const postRef = firestore ? doc(firestore, 'communityPosts', postId) : null;
    const { data: post, loading: postLoading, error: postError } = useDoc<CommunityPost>(postRef);

    const commentsQuery = firestore ? query(collection(firestore, 'communityPosts', postId, 'comments'), orderBy('createdAt', 'asc')) : null;
    const { data: comments, loading: commentsLoading } = useCollection<CommunityComment>(commentsQuery);

    const [newComment, setNewComment] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !firestore || !newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'communityPosts', postId, 'comments'), {
                postId: postId,
                content: newComment,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                authorAvatar: user.photoURL || '',
                createdAt: serverTimestamp(),
                upvotes: 0,
                downvotes: 0,
            });

            if (postRef) {
                await updateDoc(postRef, {
                    commentCount: increment(1)
                });
            }

            setNewComment('');
            toast({ title: 'Success', description: 'Your comment has been posted.' });
        } catch (error) {
            console.error("Error posting comment:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to post comment.' });
        } finally {
            setIsSubmitting(false);
        }
    };


  if (postLoading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (postError || !post) {
    return <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive">Post not found</h2>
        <p className="text-muted-foreground mt-2">The post you are looking for does not exist or has been removed.</p>
        <Button asChild variant="outline" className="mt-6">
            <Link href="/dashboard/community">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Community
            </Link>
        </Button>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Button asChild variant="ghost" className="pl-0">
                <Link href="/dashboard/community">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Community
                </Link>
            </Button>
        </div>

        <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                    <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>Posted by {post.authorName}</span>
                <span>&middot;</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{post.title}</h1>
            <p className="text-foreground/90 whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center gap-4 mt-6 pt-4 border-t">
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Button variant="ghost" size="sm"><ThumbsUp className="h-4 w-4" /></Button>
                    <span className="text-sm font-bold">{post.upvotes - post.downvotes}</span>
                    <Button variant="ghost" size="sm"><ThumbsDown className="h-4 w-4" /></Button>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">{comments?.length ?? 0} Comments</span>
                </div>
            </div>
        </div>

        <div id="comments" className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {user && (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                    <div className="grid w-full gap-2">
                    <Textarea 
                        placeholder="Add your comment..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <Button className="justify-self-end" disabled={isSubmitting || !newComment.trim()}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Post Comment
                    </Button>
                    </div>
                </form>
            )}
            
            <div className="space-y-6">
                {commentsLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                {comments && comments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                            <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-card border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-foreground">{comment.authorName}</span>
                                    <span className="text-muted-foreground">&middot; {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>
                            <p className="text-foreground/90">{comment.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground h-7 px-1.5">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span className="text-xs">{comment.upvotes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground h-7 px-1.5">
                                    <ThumbsDown className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {!commentsLoading && comments?.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to reply!</p>
                )}
            </div>
        </div>
    </div>
  );
};
