
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { MessageSquare, X, Send, Loader2, LifeBuoy } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp, doc, onSnapshot, query, orderBy, updateDoc, getDocs, where } from 'firebase/firestore';
import { HelpChat, HelpChatMessage, UserProfile } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function HelpChatWidget() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<HelpChat | null>(null);
  const [messages, setMessages] = useState<HelpChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Guest info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user && !chatId) {
      // Check for existing chat session for logged-in user
      const savedChatId = localStorage.getItem(`helpChatId_${user.uid}`);
      if (savedChatId) {
        setChatId(savedChatId);
        setHasStarted(true);
      }
    } else if (!user) {
        const guestChatId = sessionStorage.getItem('guestHelpChatId');
        if(guestChatId) {
          setChatId(guestChatId);
          setHasStarted(true);
        }
    }
  }, [user, chatId]);

  useEffect(() => {
    if (!chatId || !firestore) return;

    const chatRef = doc(firestore, 'helpChats', chatId);
    const unsubscribeChat = onSnapshot(chatRef, (doc) => {
      setChatSession(doc.data() as HelpChat);
    });

    const messagesQuery = query(collection(firestore, 'helpChats', chatId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HelpChatMessage)));
    });

    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [chatId, firestore]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setIsLoading(true);

    let newChatId = '';
    
    try {
      const chatData: Omit<HelpChat, 'id'> = {
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (user) {
        chatData.userId = user.uid;
      } else {
        chatData.guestInfo = { name, email };
      }
      
      const docRef = await addDoc(collection(firestore, 'helpChats'), chatData);
      newChatId = docRef.id;
      setChatId(newChatId);

      if (user) {
        localStorage.setItem(`helpChatId_${user.uid}`, newChatId);
      } else {
        sessionStorage.setItem('guestHelpChatId', newChatId);
      }
      setHasStarted(true);

      // Check for online admins and send automated message
      const usersRef = collection(firestore, 'users');
      const adminQuery = query(usersRef, where('role', 'in', ['admin', 'developer']));
      const adminSnapshot = await getDocs(adminQuery);
      
      const onlineAdmins = adminSnapshot.docs.filter(doc => (doc.data() as UserProfile).status === 'online');

      if (onlineAdmins.length === 0) {
        const messagesCol = collection(doc(firestore, 'helpChats', newChatId), 'messages');
        await addDoc(messagesCol, {
            chatId: newChatId,
            senderId: 'system',
            senderName: 'SkillHub Support',
            text: "Thanks for reaching out! Our team is currently unavailable. Please leave your contact number (or WhatsApp number), and we'll get back to you as soon as possible.",
            createdAt: serverTimestamp(),
        });
      }


    } catch (error) {
      console.error("Error starting chat:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not start chat session.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !chatId || !newMessage.trim()) return;
    
    const senderId = user ? user.uid : chatId;
    const senderName = user ? user.displayName : name;

    const chatRef = doc(firestore, 'helpChats', chatId);
    const messagesCol = collection(chatRef, 'messages');

    await addDoc(messagesCol, {
        chatId: chatId,
        senderId: senderId,
        senderName: senderName,
        text: newMessage,
        createdAt: serverTimestamp(),
    });
    
    await updateDoc(chatRef, {
        lastMessage: newMessage,
        updatedAt: serverTimestamp(),
    });

    setNewMessage('');
  };

  const renderChatContent = () => {
    if (!chatId && !user) {
      return (
        <div className="p-4">
          <form onSubmit={startChat} className="space-y-4">
            <p className="text-sm text-muted-foreground">Please enter your details to start the chat. This chat session is temporary and will not be saved.</p>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <Button className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                Start Chat
            </Button>
          </form>
        </div>
      );
    }

     if (user && !chatId) {
        return (
             <div className="p-4 flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm text-muted-foreground mb-4">Click below to start a new conversation with our support team. Your chat history will be saved.</p>
                <Button onClick={startChat} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Start New Chat
                </Button>
             </div>
        );
     }
    
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map(msg => {
                const isYou = msg.senderId === (user?.uid || chatId);
                const isSystem = msg.senderId === 'system';
                return (
                    <div key={msg.id} className={cn("flex items-end gap-2", isYou && 'justify-end', isSystem && 'justify-center')}>
                       {isSystem ? (
                         <div className="text-xs text-center text-muted-foreground bg-secondary p-2 rounded-md my-2 max-w-xs mx-auto">
                            {msg.text}
                         </div>
                       ) : (
                        <div className={cn("flex flex-col gap-1 w-full max-w-xs", isYou && 'items-end')}>
                            <div className={cn("flex items-center space-x-2", isYou && 'self-end')}>
                                <span className="text-xs font-semibold">{isYou ? 'You' : msg.senderName}</span>
                                <span className="text-xs text-muted-foreground">
                                    {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt.seconds * 1000), { addSuffix: true }) : 'sending...'}
                                </span>
                            </div>
                            <div className={cn("p-3 rounded-lg text-sm", isYou ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                                {msg.text}
                            </div>
                        </div>
                       )}
                    </div>
                )
            })}
            <div ref={messagesEndRef}/>
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-secondary/50 flex items-center gap-2">
          <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}><Send className="h-4 w-4"/></Button>
        </form>
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-24 right-6 z-50 rounded-full h-14 w-14 shadow-lg"
          aria-label="Open Help Chat"
        >
          {isOpen ? <X className="h-6 w-6" /> : <LifeBuoy className="h-6 w-6" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-80 h-96 p-0 rounded-lg overflow-hidden flex flex-col mr-2">
        <div className="p-4 border-b bg-primary text-primary-foreground">
          <h3 className="font-semibold">Support Chat</h3>
          {chatSession?.adminName && <p className="text-xs opacity-80">Speaking with {chatSession.adminName}</p>}
        </div>
        {renderChatContent()}
      </PopoverContent>
    </Popover>
  );
}
