
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.postId as string;
  const firestore = useFirestore();

  const postRef = firestore ? doc(firestore, 'blogPosts', postId) : null;
  const { data: post, loading } = useDoc<BlogPost>(postRef);

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
                <div className="flex items-center gap-4 text-muted-foreground">
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
      </main>
      <Footer />
    </div>
  );
}
