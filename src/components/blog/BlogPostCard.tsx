
'use client';
import React from 'react';
import { BlogPost } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link href={`/blog/${post.id}`}>
        <Card className="h-full flex flex-col group card-hover">
            <CardHeader className="p-0">
                <div className="relative aspect-video">
                    <Image
                        src={post.coverImage || 'https://picsum.photos/seed/blogpost/600/400'}
                        alt={post.title}
                        fill
                        className="object-cover rounded-t-lg"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-6 space-y-3">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-muted-foreground line-clamp-3">
                    {post.content.substring(0, 150)}...
                </p>
            </CardContent>
            <CardFooter className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{post.authorName}</p>
                        <p className="text-xs text-muted-foreground">
                            {format(new Date(post.createdAt.seconds * 1000), 'MMM d, yyyy')}
                        </p>
                    </div>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5" />
                </div>
            </CardFooter>
        </Card>
    </Link>
  );
};

export default BlogPostCard;
