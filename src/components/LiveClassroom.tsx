'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LiveClass } from '@/lib/types';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  getDocs,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { Button } from './ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, ScreenShareOff, Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { formatDistanceToNow } from 'date-fns';

interface LiveClassroomProps {
  liveClass: LiveClass;
}

interface ChatMessage {
    id: string;
    text: string;
    authorName: string;
    authorAvatar: string;
    createdAt: any;
}

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

const LiveClassroom: React.FC<LiveClassroomProps> = ({ liveClass }) => {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
        toast({
          variant: 'destructive',
          title: 'Media Error',
          description: 'Could not access camera and microphone. Please check permissions.',
        });
      }
    };
    setupMedia();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      pc?.close();
    };
  }, []);

  useEffect(() => {
    if (!firestore || !liveClass.id) return;

    const messagesQuery = query(collection(firestore, 'liveClasses', liveClass.id, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const chatMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        setMessages(chatMessages);
    });

    return () => unsubscribe();

  }, [firestore, liveClass.id]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !newMessage.trim()) return;

    await addDoc(collection(firestore, 'liveClasses', liveClass.id, 'messages'), {
        text: newMessage,
        authorName: user.displayName || 'Anonymous',
        authorAvatar: user.photoURL || '',
        createdAt: serverTimestamp(),
    });
    setNewMessage('');
  };


  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMicOn(prev => !prev);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsCameraOn(prev => !prev);
    }
  };

  const handleScreenShare = async () => {
    if (!pc || !localStream) return;

    if (!isScreenSharing) {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];
            screenTrackRef.current = screenTrack;
            
            const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
            if (videoSender) {
                videoSender.replaceTrack(screenTrack);
            }
            setIsScreenSharing(true);

            screenTrack.onended = () => {
                const cameraTrack = localStream.getVideoTracks()[0];
                if (videoSender && cameraTrack) {
                    videoSender.replaceTrack(cameraTrack);
                }
                setIsScreenSharing(false);
            };
        } catch (err) {
            console.error("Screen share failed: ", err);
        }
    } else {
        const cameraTrack = localStream.getVideoTracks()[0];
        const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (videoSender && cameraTrack) {
            videoSender.replaceTrack(cameraTrack);
        }
        screenTrackRef.current?.stop();
        setIsScreenSharing(false);
    }
};

  const hangUp = () => {
    pc?.close();
    localStream?.getTracks().forEach(track => track.stop());
    router.push('/dashboard/live-classes');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-black rounded-lg overflow-hidden relative">
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 w-full h-full relative">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm">
                {liveClass.title}
            </div>
            {!remoteStream && <div className="absolute inset-0 flex items-center justify-center bg-gray-900"><p className="text-muted-foreground">Waiting for other participant to join...</p></div>}
        </div>
        <video ref={localVideoRef} autoPlay playsInline muted className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-primary z-20" />
      </div>

      <div className={cn("bg-gray-900/80 backdrop-blur-sm transition-all duration-300 overflow-hidden flex flex-col", isChatOpen ? "w-80" : "w-0")}>
        <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Live Chat</h3>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map(msg => (
                 <div key={msg.id} className="flex items-start gap-2.5">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={msg.authorAvatar}/>
                        <AvatarFallback>{msg.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 w-full max-w-[320px]">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-white">{msg.authorName}</span>
                            <span className="text-xs font-normal text-gray-400">{msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt.seconds * 1000), { addSuffix: true }) : ''}</span>
                        </div>
                        <div className="leading-tight p-3 rounded-xl bg-gray-800 text-white">
                           <p className="text-sm font-normal">{msg.text}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex items-center gap-2">
            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="bg-gray-800 border-gray-700 text-white"/>
            <Button type="submit" size="icon" disabled={!newMessage.trim()}><Send className="h-4 w-4"/></Button>
        </form>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-4 flex justify-center items-center gap-4 z-10">
        <Button onClick={toggleMic} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 border-none", !isMicOn && "bg-destructive hover:bg-destructive/90")}>
          {isMicOn ? <Mic className="text-white" /> : <MicOff className="text-white"/>}
        </Button>
        <Button onClick={toggleCamera} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 border-none", !isCameraOn && "bg-destructive hover:bg-destructive/90")}>
          {isCameraOn ? <Video className="text-white"/> : <VideoOff className="text-white"/>}
        </Button>
        <Button onClick={handleScreenShare} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 border-none", isScreenSharing && "bg-blue-500 hover:bg-blue-600")}>
          {isScreenSharing ? <ScreenShareOff className="text-white"/> : <ScreenShare className="text-white"/>}
        </Button>
        <Button onClick={hangUp} variant="destructive" size="icon" className="rounded-full w-16 h-12">
          <PhoneOff className="text-white"/>
        </Button>
         <Button onClick={() => setIsChatOpen(!isChatOpen)} variant="outline" size="icon" className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 border-none">
          <MessageSquare className="text-white" />
        </Button>
      </div>
    </div>
  );
};

export default LiveClassroom;
