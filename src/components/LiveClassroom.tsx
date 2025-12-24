'use client';
import React, { useState, useEffect, useRef } from 'react';
import { LiveClass, UserProfile } from '@/lib/types';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  getDocs,
  setDoc,
  increment,
} from 'firebase/firestore';
import { Button } from './ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, ScreenShareOff, Send, MessageSquare, Users, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';

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

  const [pc] = useState(new RTCPeerConnection(servers));
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<UserProfile[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    if (!firestore || !user) return;
  
    const roomRef = doc(firestore, 'liveClasses', liveClass.id);
    const participantRef = doc(roomRef, 'participants', user.uid);
  
    const joinRoom = async () => {
      await setDoc(participantRef, {
        uid: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
        joinedAt: serverTimestamp(),
      });
      await updateDoc(roomRef, { participantCount: increment(1) });
      toast({ title: "You have joined the class", variant: "default" });
    };
  
    const leaveRoom = async () => {
      await deleteDoc(participantRef);
      await updateDoc(roomRef, { participantCount: increment(-1) });
    };
  
    joinRoom();
  
    const unsubscribeParticipants = onSnapshot(collection(roomRef, 'participants'), (snapshot) => {
      const newParticipants: UserProfile[] = [];
      snapshot.forEach(doc => {
          newParticipants.push(doc.data() as UserProfile);
      });
      
      setParticipants(currentParticipants => {
          const currentIds = new Set(currentParticipants.map(p => p.id));
          const newIds = new Set(newParticipants.map(p => p.id));
          
          newParticipants.forEach(p => {
              if(!currentIds.has(p.id) && p.id !== user.uid){
                  toast({ title: `${p.name} has joined.`});
              }
          });

          currentParticipants.forEach(p => {
              if(!newIds.has(p.id) && p.id !== user.uid){
                  toast({ title: `${p.name} has left.`, variant: "destructive" });
              }
          })

          return newParticipants;
      });
    });
  
    // Cleanup function
    return () => {
      leaveRoom();
      unsubscribeParticipants();
    };
  }, [firestore, user, liveClass.id, toast]);

  // Setup media and signaling
  useEffect(() => {
    if (!user || !firestore) return;

    const setupMediaAndSignaling = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Media Error', description: 'Could not access camera/mic.' });
        return;
      }
      
      const callDoc = doc(collection(firestore, 'liveClasses', liveClass.id, 'calls'));
      const offerCandidates = collection(callDoc, 'offerCandidates');
      const answerCandidates = collection(callDoc, 'answerCandidates');

      pc.onicecandidate = event => {
        event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callDoc, { offer });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });
      
      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
      
      pc.ontrack = (event) => {
        setRemoteStreams(prev => {
            if(prev.find(s => s.id === event.streams[0].id)) return prev;
            return [...prev, event.streams[0]]
        });
      };
    };

    setupMediaAndSignaling();

  }, [pc, user, firestore, liveClass.id, toast]);

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
    const videoSender = pc.getSenders().find(s => s.track?.kind === 'video');
    if (!videoSender) return;

    if (!isScreenSharing) {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];
            screenTrackRef.current = screenTrack;
            
            videoSender.replaceTrack(screenTrack);
            setIsScreenSharing(true);

            screenTrack.onended = () => {
                const cameraTrack = localStream.getVideoTracks()[0];
                if (cameraTrack) {
                    videoSender.replaceTrack(cameraTrack);
                }
                setIsScreenSharing(false);
            };
        } catch (err) {
            console.error("Screen share failed: ", err);
        }
    } else {
        const cameraTrack = localStream.getVideoTracks()[0];
        if (cameraTrack) {
            videoSender.replaceTrack(cameraTrack);
        }
        screenTrackRef.current?.stop();
        setIsScreenSharing(false);
    }
};

  const hangUp = async () => {
    pc?.close();
    localStream?.getTracks().forEach(track => track.stop());
    
    if (firestore) {
        const roomRef = doc(firestore, 'liveClasses', liveClass.id);
        const callsCollection = collection(roomRef, 'calls');
        const callsSnapshot = await getDocs(callsCollection);
        callsSnapshot.forEach(async (callDoc) => {
            const offerCandidatesCollection = collection(callDoc.ref, 'offerCandidates');
            const answerCandidatesCollection = collection(callDoc.ref, 'answerCandidates');
            const offerSnapshot = await getDocs(offerCandidatesCollection);
            offerSnapshot.forEach(d => deleteDoc(d.ref));
            const answerSnapshot = await getDocs(answerCandidatesCollection);
            answerSnapshot.forEach(d => deleteDoc(d.ref));
            deleteDoc(callDoc.ref);
        });
    }

    router.push('/dashboard/live-classes');
  };

  const allStreamsCount = remoteStreams.length + 1;
  const gridCols = allStreamsCount <= 4 ? 'grid-cols-2' : 'grid-cols-3';
  const gridRows = allStreamsCount <= 2 ? 'grid-rows-1' : 'grid-rows-2';


  return (
    <div className="flex h-[calc(100vh-8rem)] bg-black rounded-lg overflow-hidden relative text-white">
      <div className="flex-1 flex flex-col relative transition-all duration-300" style={{ marginRight: (isChatOpen || isParticipantsOpen) ? '320px' : '0' }}>
        <div className="flex-1 overflow-auto p-2">
            <div className={cn('grid gap-2 h-full w-full', gridCols, gridRows)}>
                <div className="relative bg-gray-900 rounded-md overflow-hidden aspect-video">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">{user?.displayName} (You)</div>
                </div>
                {remoteStreams.map((stream, index) => (
                    <div key={index} className="relative bg-gray-900 rounded-md overflow-hidden aspect-video">
                        <video ref={el => { if (el) el.srcObject = stream; }} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">Participant {index+1}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className={cn("absolute top-0 right-0 h-full bg-gray-900/80 backdrop-blur-sm transition-transform duration-300 overflow-hidden flex flex-col w-80", isChatOpen || isParticipantsOpen ? 'translate-x-0' : 'translate-x-full')}>
        {isChatOpen && (
            <>
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
            </>
        )}
        {isParticipantsOpen && (
            <>
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white font-semibold">Participants ({participants.length})</h3>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {participants.map(p => (
                        <div key={p.id} className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={p.avatar} />
                                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{p.name} {p.id === user?.uid ? '(You)' : ''}</span>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex justify-center items-center gap-2 sm:gap-4 z-10">
        <TooltipProvider>
            <Tooltip><TooltipTrigger asChild>
                <Button onClick={toggleMic} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", !isMicOn && "bg-destructive hover:bg-destructive/90")}>
                    {isMicOn ? <Mic /> : <MicOff />}
                </Button>
            </TooltipTrigger><TooltipContent>{isMicOn ? 'Mute' : 'Unmute'}</TooltipContent></Tooltip>

            <Tooltip><TooltipTrigger asChild>
                <Button onClick={toggleCamera} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", !isCameraOn && "bg-destructive hover:bg-destructive/90")}>
                    {isCameraOn ? <Video /> : <VideoOff />}
                </Button>
            </TooltipTrigger><TooltipContent>{isCameraOn ? 'Stop Camera' : 'Start Camera'}</TooltipContent></Tooltip>

            <Tooltip><TooltipTrigger asChild>
                <Button onClick={handleScreenShare} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", isScreenSharing && "bg-primary hover:bg-primary/90")}>
                    {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
                </Button>
            </TooltipTrigger><TooltipContent>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</TooltipContent></Tooltip>

            <Tooltip><TooltipTrigger asChild>
                 <Button onClick={() => { setIsParticipantsOpen(false); setIsChatOpen(p => !p); }} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", isChatOpen && 'bg-primary/80')}>
                    <MessageSquare />
                </Button>
            </TooltipTrigger><TooltipContent>Chat</TooltipContent></Tooltip>

            <Tooltip><TooltipTrigger asChild>
                <Button onClick={() => { setIsChatOpen(false); setIsParticipantsOpen(p => !p); }} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white relative", isParticipantsOpen && 'bg-primary/80')}>
                    <Users />
                    <Badge className="absolute -top-1 -right-1 px-1.5 h-5">{participants.length}</Badge>
                </Button>
            </TooltipTrigger><TooltipContent>Participants</TooltipContent></Tooltip>
        </TooltipProvider>

        <Button onClick={hangUp} variant="destructive" size="icon" className="rounded-full w-16 h-12 ml-4">
          <PhoneOff />
        </Button>
      </div>
    </div>
  );
};

export default LiveClassroom;
