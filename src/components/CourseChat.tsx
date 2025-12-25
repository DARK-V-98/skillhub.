
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Course, UserProfile } from '@/lib/types';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import { Button } from './ui/button';
import { Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { format, formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useCollection } from '@/firebase/firestore/use-collection';

interface CourseChatProps {
  course: Course;
}

interface ChatMessage {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    createdAt: any;
}

const CourseChat: React.FC<CourseChatProps> = ({ course }) => {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState('');
  
  const messagesQuery = firestore ? query(collection(firestore, 'courses', course.id, 'messages'), orderBy('createdAt', 'asc')) : null;
  const { data: messages } = useCollection<ChatMessage>(messagesQuery);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !newMessage.trim()) return;

    await addDoc(collection(firestore, 'courses', course.id, 'messages'), {
        text: newMessage,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorAvatar: user.photoURL || '',
        createdAt: serverTimestamp(),
    });
    setNewMessage('');
  };

  return (
    <TooltipProvider>
        <div className="h-full flex flex-col bg-card">
            <div className="p-4 border-b">
                <h3 className="text-foreground font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {course.title} - Group Chat
                </h3>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages?.map(msg => {
                    const isYou = msg.authorId === user?.uid;
                    const messageDate = msg.createdAt ? new Date(msg.createdAt.seconds * 1000) : new Date();

                    return (
                    <div key={msg.id} className={cn('flex items-end gap-2', isYou && 'justify-end')}>
                        {!isYou && (
                            <Avatar className="w-8 h-8 shrink-0">
                                <AvatarImage src={msg.authorAvatar}/>
                                <AvatarFallback>{msg.authorName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("flex flex-col gap-1 w-full max-w-xs sm:max-w-md", isYou && 'items-end')}>
                             <div className={cn("flex items-center space-x-2", isYou && 'self-end')}>
                                {!isYou && <span className="text-xs font-semibold text-foreground">{msg.authorName}</span>}
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="text-xs font-normal text-muted-foreground hover:text-foreground">
                                            {formatDistanceToNow(messageDate, { addSuffix: true })}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        {format(messageDate, "PPP, p")}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className={cn(
                                "leading-tight p-3 rounded-2xl text-card-foreground text-sm",
                                isYou ? "bg-primary text-primary-foreground rounded-br-none" : "bg-secondary rounded-bl-none"
                            )}>
                            <p className="font-normal">{msg.text}</p>
                            </div>
                        </div>
                         {isYou && (
                            <Avatar className="w-8 h-8 shrink-0">
                                <AvatarImage src={msg.authorAvatar}/>
                                <AvatarFallback>{user?.displayName?.charAt(0) || 'Y'}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                )})}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-background/50 flex items-center gap-2">
                <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="bg-background"/>
                <Button type="submit" size="icon" disabled={!newMessage.trim()}><Send className="h-4 w-4"/></Button>
            </form>
        </div>
    </TooltipProvider>
  );
};

export default CourseChat;
