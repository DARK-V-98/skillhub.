
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { HelpChat, HelpChatMessage } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AdminChatWindowProps {
  chat: HelpChat;
}

export default function AdminChatWindow({ chat }: AdminChatWindowProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesQuery = firestore
    ? query(collection(firestore, 'helpChats', chat.id, 'messages'), orderBy('createdAt', 'asc'))
    : null;
  const { data: messages, loading } = useCollection<HelpChatMessage>(messagesQuery);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !newMessage.trim()) return;

    const chatRef = doc(firestore, 'helpChats', chat.id);
    const messagesCol = collection(chatRef, 'messages');

    await addDoc(messagesCol, {
        chatId: chat.id,
        senderId: user.uid,
        senderName: user.displayName || 'Admin',
        text: newMessage,
        createdAt: serverTimestamp(),
    });
    
    await updateDoc(chatRef, {
        lastMessage: newMessage,
        updatedAt: serverTimestamp(),
    });
    
    setNewMessage('');
  };
  
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{chat.guestInfo?.name || 'User ' + chat.userId?.substring(0, 6)}</h3>
        <p className="text-sm text-muted-foreground">{chat.guestInfo?.email}</p>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {loading && <div className="flex justify-center"><Loader2 className="animate-spin"/></div>}
        {messages?.map(msg => {
          const isYou = msg.senderId === user?.uid;
          return (
            <div key={msg.id} className={cn("flex items-end gap-2", isYou && 'justify-end')}>
              <div className={cn("flex flex-col gap-1 w-full max-w-xs sm:max-w-md", isYou && 'items-end')}>
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
            </div>
          );
        })}
         <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-secondary/50 flex items-center gap-2">
        <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}
