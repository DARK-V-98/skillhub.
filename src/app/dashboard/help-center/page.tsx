
'use client';
import React, { useState } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { HelpChat } from '@/lib/types';
import { Loader2, LifeBuoy, Inbox, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import AdminChatWindow from '@/components/help-chat/AdminChatWindow';
import { useUser } from '@/firebase/auth/use-user';

export default function HelpCenterPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [selectedChat, setSelectedChat] = useState<HelpChat | null>(null);

  const pendingChatsQuery = firestore
    ? query(collection(firestore, 'helpChats'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'))
    : null;
  const { data: pendingChats, loading: pendingLoading } = useCollection<HelpChat>(pendingChatsQuery);

  const activeChatsQuery = firestore && user
    ? query(collection(firestore, 'helpChats'), where('status', '==', 'active'), where('adminId', '==', user.uid), orderBy('updatedAt', 'desc'))
    : null;
  const { data: activeChats, loading: activeLoading } = useCollection<HelpChat>(activeChatsQuery);
  
  const loading = pendingLoading || activeLoading;

  const handleSelectChat = async (chat: HelpChat) => {
    setSelectedChat(chat);
    if (chat.status === 'pending' && firestore && user) {
        const chatRef = doc(firestore, 'helpChats', chat.id);
        await updateDoc(chatRef, {
            status: 'active',
            adminId: user.uid,
            adminName: user.displayName,
            updatedAt: serverTimestamp()
        });
    }
  }

  const ChatListItem = ({ chat }: { chat: HelpChat }) => (
    <button
      onClick={() => handleSelectChat(chat)}
      className={cn(
        "w-full text-left p-4 border-b border-border hover:bg-accent transition-colors",
        selectedChat?.id === chat.id && "bg-accent"
      )}
    >
      <div className="font-semibold">{chat.guestInfo?.name || chat.userId || 'Anonymous'}</div>
      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || "New chat request"}</p>
      <p className="text-xs text-muted-foreground mt-1">
        <Clock className="h-3 w-3 inline mr-1" />
        {formatDistanceToNow(new Date(chat.updatedAt?.seconds * 1000 || Date.now()), { addSuffix: true })}
      </p>
    </button>
  );

  return (
    <div className="h-[calc(100vh-8rem)] -my-8 -mx-8 flex flex-col">
      <div className="flex-shrink-0 border-b p-4">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-3">
          <LifeBuoy className="h-6 w-6 text-primary" />
          Help Center
        </h1>
      </div>
      <div className="flex-grow flex min-h-0">
        <div className="w-80 border-r flex flex-col">
          <div className="p-2 border-b">
            <div className="grid grid-cols-2 gap-1">
              <Button variant={activeTab === 'pending' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('pending')}>Pending</Button>
              <Button variant={activeTab === 'active' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('active')}>My Chats</Button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {loading ? <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div> : (
              <>
                {activeTab === 'pending' && (pendingChats?.length ? pendingChats.map(chat => <ChatListItem key={chat.id} chat={chat} />) : <div className="p-4 text-center text-sm text-muted-foreground">No pending chats.</div>)}
                {activeTab === 'active' && (activeChats?.length ? activeChats.map(chat => <ChatListItem key={chat.id} chat={chat} />) : <div className="p-4 text-center text-sm text-muted-foreground">No active chats.</div>)}
              </>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <AdminChatWindow chat={selectedChat} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <Inbox className="h-16 w-16 mb-4" />
              <h2 className="text-xl font-semibold">Select a conversation</h2>
              <p>Choose a pending or active chat from the sidebar to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
