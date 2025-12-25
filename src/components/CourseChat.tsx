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
  doc,
  setDoc,
  deleteDoc,
  where,
  getDocs,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from './ui/button';
import { Send, MessageSquare, Paperclip, Smile, Users, Image as ImageIcon, FileText, Music, Video, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { format, formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

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
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
}

const emojis = ['😀', '😂', '😍', '👍', '🙏', '🎉', '🔥', '🤔', '😊', '😢'];

const FileIcon = ({ fileType }: { fileType: string | undefined }) => {
    if (!fileType) return <FileText className="h-6 w-6" />;
    if (fileType.startsWith('image/')) return <ImageIcon className="h-6 w-6" />;
    if (fileType.startsWith('video/')) return <Video className="h-6 w-6" />;
    if (fileType.startsWith('audio/')) return <Music className="h-6 w-6" />;
    if (fileType === 'application/pdf') return <FileText className="h-6 w-6 text-red-500" />;
    return <FileText className="h-6 w-6" />;
};


const CourseChat: React.FC<CourseChatProps> = ({ course }) => {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesQuery = firestore ? query(collection(firestore, 'courses', course.id, 'messages'), orderBy('createdAt', 'asc')) : null;
  const { data: messages } = useCollection<ChatMessage>(messagesQuery);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const participantsQuery = firestore ? query(collection(firestore, 'courses', course.id, 'participants'), where('status', '==', 'online')) : null;
  const { data: onlineParticipants } = useCollection(participantsQuery);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!firestore || !user) return;
    
    const participantRef = doc(firestore, 'courses', course.id, 'participants', user.uid);
    setDoc(participantRef, { id: user.uid, name: user.displayName, status: 'online' }, { merge: true });

    const handleBeforeUnload = () => {
       setDoc(participantRef, { status: 'offline', lastSeen: serverTimestamp() }, { merge: true });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        setDoc(participantRef, { status: 'offline', lastSeen: serverTimestamp() }, { merge: true });
    }
  }, [firestore, user, course.id]);

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
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !firestore) return;
    
    setIsUploading(true);
    try {
        const storage = getStorage();
        const storageRef = ref(storage, `course_chats/${course.id}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await addDoc(collection(firestore, 'courses', course.id, 'messages'), {
            text: '',
            authorId: user.uid,
            authorName: user.displayName || 'Anonymous',
            authorAvatar: user.photoURL || '',
            createdAt: serverTimestamp(),
            fileUrl: downloadURL,
            fileName: file.name,
            fileType: file.type,
        });

    } catch (error) {
        console.error("File upload error:", error);
    } finally {
        setIsUploading(false);
    }
  }

  return (
    <TooltipProvider>
        <div className="h-full flex flex-col bg-card">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-foreground font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {course.title} - Group Chat
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4"/>
                    <span>{onlineParticipants?.length || 0} Online</span>
                </div>
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
                            {msg.fileUrl ? (
                                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                                    <FileIcon fileType={msg.fileType} />
                                    <span>{msg.fileName}</span>
                                </a>
                            ) : (
                                <p className="font-normal">{msg.text}</p>
                            )}
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
                <Input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Paperclip className="h-4 w-4"/>}
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                         <Button type="button" variant="ghost" size="icon"><Smile className="h-4 w-4"/></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <div className="grid grid-cols-5 gap-1">
                            {emojis.map(emoji => (
                                <button key={emoji} type="button" onClick={() => setNewMessage(prev => prev + emoji)} className="text-xl p-1 rounded-md hover:bg-accent">
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="bg-background"/>
                <Button type="submit" size="icon" disabled={!newMessage.trim() || isUploading}><Send className="h-4 w-4"/></Button>
            </form>
        </div>
    </TooltipProvider>
  );
};

export default CourseChat;
