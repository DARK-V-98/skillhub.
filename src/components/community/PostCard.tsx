'use client';
import React from 'react';
import { CommunityPost } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface PostCardProps {
  post: CommunityPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-card rounded-xl border p-4 sm:p-6 card-hover transition-all">
      <div className="flex gap-4">
        <div className="flex flex-col items-center space-y-1 text-muted-foreground">
            <Button variant="ghost" size="sm" className='rounded-full h-8 w-8 p-0'>
                <ThumbsUp className="h-4 w-4" />
            </Button>
          <span className="font-bold text-sm text-foreground">{post.upvotes - post.downvotes}</span>
            <Button variant="ghost" size="sm" className='rounded-full h-8 w-8 p-0'>
                <ThumbsDown className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
              <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-muted-foreground">
              Posted by {post.authorName}
            </span>
            <span className="text-sm text-muted-foreground">
              &middot; {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          <Link href={`/dashboard/community/${post.id}`} className="block">
            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="mt-1 text-muted-foreground line-clamp-2">{post.content}</p>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <Link href={`/dashboard/community/${post.id}#comments`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentCount} Comments</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
