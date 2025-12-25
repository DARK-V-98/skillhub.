
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase/provider';
import { collection, doc, addDoc, serverTimestamp, query, orderBy, increment, updateDoc } from 'firebase/firestore';
import { BlogPost, BlogComment } from '@/lib/types';
import { Loader2, Heart, Send } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser } from '@/firebase/auth/use-user';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { toggleBlogPostLike } from '@/app/actions';
import { cn } from '@/lib/utils';

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.postId as string;
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const postRef = firestore ? doc(firestore, 'blogPosts', postId) : null;
  const { data: post, loading } = useDoc<BlogPost>(postRef);

  const commentsQuery = firestore ? query(collection(firestore, `blogPosts/${postId}/comments`), orderBy('createdAt', 'asc')) : null;
  const { data: comments, loading: commentsLoading } = useCollection<BlogComment>(commentsQuery);

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (post) {
      const initialLikes = post.likes?.length || 0;
      setOptimisticLikes(initialLikes);
      setIsLiked(user ? post.likes?.includes(user.uid) : false);
    }
  }, [post, user]);

  const handleLike = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in to like posts.' });
      return;
    }
    setIsLiking(true);

    // Optimistic update
    setOptimisticLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev => !prev);
    
    const result = await toggleBlogPostLike(postId, user.uid);
    if (!result.success) {
      // Revert on failure
      setOptimisticLikes(post?.likes?.length || 0);
      setIsLiked(user ? post?.likes?.includes(user.uid) : false);
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    
    setIsLiking(false);
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !firestore) return;
    setIsSubmittingComment(true);

    try {
        await addDoc(collection(firestore, `blogPosts/${postId}/comments`), {
            postId: postId,
            content: newComment,
            authorId: user.uid,
            authorName: user.displayName,
            authorAvatar: user.photoURL,
            createdAt: serverTimestamp(),
        });
        if(postRef) {
            await updateDoc(postRef, { commentCount: increment(1) });
        }
        setNewComment('');
        toast({ title: 'Comment posted!' });
    } catch(err) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not post comment.'});
    } finally {
        setIsSubmittingComment(false);
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center text-center">
            <div>
                <h1 className="text-3xl font-bold">Post not found</h1>
                <p className="text-muted-foreground mt-2">This blog post could not be found.</p>
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <article className="container max-w-4xl mx-auto px-4">
            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
                <div className="flex items-center justify-between gap-4 text-muted-foreground">
                    <div className="flex items-center gap-3">
                         <Avatar className="h-10 w-10">
                            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-foreground">{post.authorName}</p>
                            <p className="text-xs">
                                Published on {format(new Date(post.createdAt.seconds * 1000), 'MMMM d, yyyy')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLiking}>
                            <Heart className={cn("h-5 w-5", isLiked ? 'text-red-500 fill-current' : 'text-gray-500')} />
                        </Button>
                        <span className="font-medium text-foreground">{optimisticLikes}</span>
                    </div>
                </div>
            </header>
            
            {post.coverImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                </div>
            )}

            <div className="prose dark:prose-invert lg:prose-lg max-w-none mx-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                </ReactMarkdown>
            </div>
        </article>
        
        <section className="container max-w-4xl mx-auto px-4 mt-12">
            <h2 className="text-2xl font-bold mb-6">Comments ({comments?.length || 0})</h2>
            {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                    <div className="grid gap-2">
                        <Textarea 
                            placeholder="Add your thoughts..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            disabled={isSubmittingComment}
                        />
                        <Button className="justify-self-end" disabled={!newComment.trim() || isSubmittingComment}>
                            {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Send className="h-4 w-4 mr-2"/>}
                            Post Comment
                        </Button>
                    </div>
                </form>
            ) : <p className="text-muted-foreground">Please log in to leave a comment.</p>}

            <div className="space-y-6">
                {commentsLoading && <Loader2 className="h-6 w-6 animate-spin mx-auto" />}
                {comments && comments.map(comment => (
                     <div key={comment.id} className="flex gap-4">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                            <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm mb-1">
                                <span className="font-semibold text-foreground">{comment.authorName}</span>
                                <span className="text-muted-foreground">&middot; {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}</span>
                            </div>
                            <p className="text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
