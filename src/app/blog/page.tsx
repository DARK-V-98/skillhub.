
'use client';
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import { collection, query, orderBy } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import { Loader2, Rss } from 'lucide-react';
import BlogPostCard from '@/components/blog/BlogPostCard';

export default function BlogListPage() {
  const firestore = useFirestore();
  const postsQuery = firestore ? query(collection(firestore, 'blogPosts'), orderBy('createdAt', 'desc')) : null;
  const { data: posts, loading } = useCollection<BlogPost>(postsQuery);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary/50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Rss className="h-10 w-10 text-primary" /> The SkillHub Blog
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and stories from the SkillHub community.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts && posts.length > 0 ? (
                posts.map(post => <BlogPostCard key={post.id} post={post} />)
              ) : (
                <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                  <h3 className="text-xl font-semibold">No posts yet.</h3>
                  <p className="text-muted-foreground mt-2">
                    Check back soon for articles from our team and community!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
