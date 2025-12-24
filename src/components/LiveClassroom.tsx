'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, ScreenShareOff, Send, MessageSquare, Users, MoreVertical, XCircle, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { format, formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface LiveClassroomProps {
  liveClass: LiveClass;
}

interface ChatMessage {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    createdAt: any;
}

interface StreamWithId {
  id: string;
  stream: MediaStream;
  user: {
    id: string;
    name: string;
  };
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
  const [remoteStreams, setRemoteStreams] = useState<StreamWithId[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const isTeacher = user?.uid === liveClass.instructorId;
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{[key: string]: HTMLVideoElement}>({});

  const allStreams = localStream ? [{ id: user!.uid, stream: localStream, user: { id: user!.uid, name: `${user!.displayName} (You)`} }, ...remoteStreams] : remoteStreams;

  
  useEffect(() => {
    if (!firestore || !user) return;

    const roomRef = doc(firestore, 'liveClasses', liveClass.id);
    const participantRef = doc(roomRef, 'participants', user.uid);

    // Subscribe to moderation commands
    const unsubscribeModeration = onSnapshot(participantRef, (docSnap) => {
        const data = docSnap.data();
        if (data?.mute) {
            toggleMic(true);
            updateDoc(participantRef, { mute: false }); // Reset command
        }
        if (data?.stopVideo) {
            toggleCamera(true);
            updateDoc(participantRef, { stopVideo: false }); // Reset command
        }
    });

    const joinRoom = async () => {
      await setDoc(participantRef, {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
        joinedAt: serverTimestamp(),
      }, { merge: true });
    };
  
    const leaveRoom = async () => {
        try {
            await deleteDoc(participantRef);
        } catch(error) {
            // Ignore errors, e.g. if doc is already deleted
        }
    };
  
    joinRoom();
  
    const unsubscribeParticipants = onSnapshot(query(collection(roomRef, 'participants'), orderBy('name')), (snapshot) => {
        const newParticipantsList: UserProfile[] = [];
        let participantCount = 0;
        snapshot.forEach(doc => {
            participantCount++;
            newParticipantsList.push(doc.data() as UserProfile);
        });

        // Update main class document with participant count
        updateDoc(roomRef, { attendees: participantCount });
        
        const oldParticipants = participants;
        setParticipants(newParticipantsList);

        // Defer notification logic to avoid happening during render
        setTimeout(() => {
            const { joined, left } = handleJoinLeaveNotifications(newParticipantsList, oldParticipants);
            joined.forEach(p => toast({ title: `${p.name || 'A user'} has joined.` }));
            left.forEach(p => toast({ title: `${p.name || 'A user'} has left.`, variant: "destructive" }));
        }, 0);
    });
  
    // Listen for own document deletion (kick)
    const unsubscribeSelf = onSnapshot(participantRef, (docSnap) => {
        if (!docSnap.exists()) {
            toast({ title: "You have been removed from the class.", variant: "destructive"});
            hangUp();
        }
    });

    return () => {
      leaveRoom();
      unsubscribeParticipants();
      unsubscribeModeration();
      unsubscribeSelf();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, user, liveClass.id]);
  
  const handleJoinLeaveNotifications = useCallback((newParticipants: UserProfile[], oldParticipants: UserProfile[]) => {
      if (!user || oldParticipants.length === 0) return { joined: [], left: [] };
  
      const oldIds = new Set(oldParticipants.map(p => p.id));
      const newIds = new Set(newParticipants.map(p => p.id));
  
      const joined = newParticipants.filter(p => !oldIds.has(p.id) && p.id !== user.uid);
      const left = oldParticipants.filter(p => !newIds.has(p.id) && p.id !== user.uid);
  
      return { joined, left };
  }, [user]);

  useEffect(() => {
    if (!user || !firestore) return;

    const setupMediaAndSignaling = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
        setLocalStream(stream);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      } catch (error) {
        toast({ variant: 'destructive', title: 'Media Error', description: 'Could not access camera/mic.' });
        return;
      }
      
      const callDoc = doc(collection(firestore, 'liveClasses', liveClass.id, 'calls'));
      const offerCandidates = collection(callDoc, 'offerCandidates');
      const answerCandidates = collection(callDoc, 'answerCandidates');

      pc.onicecandidate = event => event.candidate && addDoc(offerCandidates, event.candidate.toJSON());

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      await setDoc(callDoc, { offer: { sdp: offerDescription.sdp, type: offerDescription.type } });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      });
      
      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        });
      });
      
      pc.ontrack = (event) => {
        const stream = event.streams[0];
        const streamId = stream.id; // Or a unique ID from signaling
        
        // Find user info for this stream
        // This is a simplified approach; a more robust solution would map track IDs to user IDs
        const participantUser = participants.find(p => p.id !== user.uid) || { id: streamId, name: 'Participant' };


        setRemoteStreams(prev => {
            if(prev.find(s => s.id === streamId)) return prev;
            return [...prev, { id: streamId, stream, user: participantUser }];
        });
      };
    };

    setupMediaAndSignaling();

  }, [pc, user, firestore, liveClass.id, toast, participants]);

    useEffect(() => {
    if (!firestore || !liveClass.id) return;

    const messagesQuery = query(collection(firestore, 'liveClasses', liveClass.id, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage)));
    });

    return () => unsubscribe();

  }, [firestore, liveClass.id]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !newMessage.trim()) return;

    await addDoc(collection(firestore, 'liveClasses', liveClass.id, 'messages'), {
        text: newMessage,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorAvatar: user.photoURL || '',
        createdAt: serverTimestamp(),
    });
    setNewMessage('');
  };


  const toggleMic = (forceOff = false) => {
    if (localStream) {
      const currentlyOn = localStream.getAudioTracks().some(track => track.enabled);
      const turnOff = forceOff || currentlyOn;
      localStream.getAudioTracks().forEach(track => track.enabled = !turnOff);
      setIsMicOn(!turnOff);
    }
  };

  const toggleCamera = (forceOff = false) => {
    if (localStream) {
      const currentlyOn = localStream.getVideoTracks().some(track => track.enabled);
      const turnOff = forceOff || currentlyOn;
      localStream.getVideoTracks().forEach(track => track.enabled = !turnOff);
      setIsCameraOn(!turnOff);
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
            screenTrackRef.current = videoSender.track; // Save original camera track
            videoSender.replaceTrack(screenTrack);
            
            const newLocalStream = new MediaStream([screenTrack, ...localStream.getAudioTracks()]);
            if (localVideoRef.current) localVideoRef.current.srcObject = newLocalStream;

            setIsScreenSharing(true);

            screenTrack.onended = () => {
                if (screenTrackRef.current) {
                    videoSender.replaceTrack(screenTrackRef.current);
                    const originalStream = new MediaStream([screenTrackRef.current!, ...localStream.getAudioTracks()]);
                    if (localVideoRef.current) localVideoRef.current.srcObject = originalStream;
                    screenTrackRef.current = null;
                }
                setIsScreenSharing(false);
            };
        } catch (err) {
            console.error("Screen share failed: ", err);
        }
    } else {
        if (screenTrackRef.current) {
            videoSender.replaceTrack(screenTrackRef.current);
            const originalStream = new MediaStream([screenTrackRef.current!, ...localStream.getAudioTracks()]);
            if (localVideoRef.current) localVideoRef.current.srcObject = originalStream;
            screenTrackRef.current = null;
        }
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

  const moderateParticipant = async (participantId: string, action: 'kick' | 'mute' | 'stopVideo') => {
    if (!firestore || !isTeacher) return;
    const participantRef = doc(firestore, 'liveClasses', liveClass.id, 'participants', participantId);
    if (action === 'kick') {
        await deleteDoc(participantRef);
        toast({ title: 'Participant removed' });
    } else {
        await updateDoc(participantRef, { [action]: true });
        toast({ title: `Participant ${action === 'mute' ? 'muted' : 'video stopped'}` });
    }
};

  const numStreams = 1 + remoteStreams.length;
  const gridLayout = 
      numStreams === 1 ? "grid-cols-1 grid-rows-1" :
      numStreams === 2 ? "grid-cols-2 grid-rows-1" :
      numStreams <= 4 ? "grid-cols-2 grid-rows-2" :
      numStreams <= 6 ? "grid-cols-3 grid-rows-2" :
      numStreams <= 9 ? "grid-cols-3 grid-rows-3" :
      "grid-cols-4 grid-rows-3";

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-black rounded-lg overflow-hidden text-white">
        <div className="flex-1 flex flex-col relative">
            <div className={cn("grid gap-2 h-full w-full p-2 overflow-auto", gridLayout)}>
                {localStream && (
                    <div className="relative bg-gray-900 rounded-md overflow-hidden">
                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">{user?.displayName} (You)</div>
                    </div>
                )}
                {remoteStreams.map(({ id, stream, user: streamUser }) => (
                    <div key={id} className="relative bg-gray-900 rounded-md overflow-hidden">
                        <video ref={el => { if(el) el.srcObject = stream }} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">{streamUser.name}</div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex justify-center items-center gap-2 sm:gap-4 z-10">
                <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild>
                        <Button onClick={() => toggleMic()} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", !isMicOn && "bg-destructive hover:bg-destructive/90")}>
                            {isMicOn ? <Mic /> : <MicOff />}
                        </Button>
                    </TooltipTrigger><TooltipContent>{isMicOn ? 'Mute' : 'Unmute'}</TooltipContent></Tooltip>

                    <Tooltip><TooltipTrigger asChild>
                        <Button onClick={() => toggleCamera()} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", !isCameraOn && "bg-destructive hover:bg-destructive/90")}>
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

      {(isChatOpen || isParticipantsOpen) && (
          <div className="w-80 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm flex flex-col">
            {isChatOpen && (
                <TooltipProvider>
                    <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold">Live Chat</h3>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {messages.map(msg => {
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
                                <div className={cn("flex flex-col gap-1 w-full max-w-[280px]", isYou && 'items-end')}>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-semibold text-white">{isYou ? 'You' : msg.authorName}</span>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <span className="text-xs font-normal text-gray-400 hover:text-gray-200">
                                                    {formatDistanceToNow(messageDate, { addSuffix: true })}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                {format(messageDate, "PPP, p")}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <div className={cn(
                                        "leading-tight p-3 rounded-2xl text-white text-sm",
                                        isYou ? "bg-primary text-primary-foreground rounded-br-none" : "bg-gray-700 rounded-bl-none"
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
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex items-center gap-2">
                        <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="bg-gray-800 border-gray-700 text-white"/>
                        <Button type="submit" size="icon" disabled={!newMessage.trim()}><Send className="h-4 w-4"/></Button>
                    </form>
                </TooltipProvider>
            )}
            {isParticipantsOpen && (
                <>
                    <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold">Participants ({participants.length})</h3>
                    </div>
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                        {participants.map(p => (
                            <div key={p.id} className="flex items-center justify-between gap-3 group">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={p.avatar} />
                                        <AvatarFallback>{p.name ? p.name.charAt(0) : 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{p.name || 'Anonymous User'} {p.id === user?.uid ? '(You)' : ''}</span>
                                </div>
                                {isTeacher && user && p.id !== user.uid && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => moderateParticipant(p.id, 'mute')}>
                                                <VolumeX className="mr-2 h-4 w-4" /> Mute Mic
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => moderateParticipant(p.id, 'stopVideo')}>
                                                <VideoOff className="mr-2 h-4 w-4" /> Stop Video
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => moderateParticipant(p.id, 'kick')}>
                                                <XCircle className="mr-2 h-4 w-4" /> Kick User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
          </div>
        )}
    </div>
  );
};

export default LiveClassroom;

    