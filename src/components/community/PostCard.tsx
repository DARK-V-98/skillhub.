'use client';
import React, { useState } from 'react';
import { CommunityPost } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';
import { handleVote } from '@/app/actions';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: CommunityPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [vote, setVote] = useState(post.userVote);
  const [score, setScore] = useState(post.upvotes - post.downvotes);
  const [isVoting, setIsVoting] = useState(false);

  const onVote = async (direction: 'up' | 'down') => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to vote.',
      });
      return;
    }
    if (isVoting) return;

    setIsVoting(true);

    const previousVote = vote;
    const previousScore = score;
    
    // Optimistic update
    if (vote === direction) { // Retracting vote
      setVote(undefined);
      setScore(prev => prev + (direction === 'up' ? -1 : 1));
    } else { // New vote or changing vote
      setVote(direction);
      if(previousVote) { // Changing vote
        setScore(prev => prev + (direction === 'up' ? 2 : -2));
      } else { // New vote
        setScore(prev => prev + (direction === 'up' ? 1 : -1));
      }
    }

    const result = await handleVote(post.id, 'post', user.uid, direction);

    if (!result.success) {
      // Revert optimistic update on failure
      setVote(previousVote);
      setScore(previousScore);
      toast({
        variant: 'destructive',
        title: 'Vote Failed',
        description: result.message,
      });
    }

    setIsVoting(false);
  };

  return (
    <div className="bg-card rounded-xl border p-4 sm:p-6 card-hover transition-all">
      <div className="flex gap-4">
        <div className="flex flex-col items-center space-y-1 text-muted-foreground">
            <Button variant="ghost" size="sm" className={cn('rounded-full h-8 w-8 p-0', vote === 'up' && 'bg-primary/10 text-primary')} onClick={() => onVote('up')} disabled={isVoting}>
                {isVoting && vote !== 'down' ? <Loader2 className="h-4 w-4 animate-spin"/> : <ThumbsUp className="h-4 w-4" />}
            </Button>
          <span className="font-bold text-sm text-foreground">{score}</span>
            <Button variant="ghost" size="sm" className={cn('rounded-full h-8 w-8 p-0', vote === 'down' && 'bg-destructive/10 text-destructive')} onClick={() => onVote('down')} disabled={isVoting}>
                {isVoting && vote !== 'up' ? <Loader2 className="h-4 w-4 animate-spin"/> : <ThumbsDown className="h-4 w-4" />}
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
              &middot; {post.createdAt ? formatDistanceToNow(new Date(post.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
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
