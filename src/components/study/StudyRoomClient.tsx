'use client';
import React, { useState, useEffect, useRef } from 'react';
import { StudyRoom } from '@/lib/types';
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
  increment
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, ScreenShareOff, Send, MessageSquare, Users, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Whiteboard from './Whiteboard';


interface StudyRoomClientProps {
  studyRoom: StudyRoom;
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

const StudyRoomClient: React.FC<StudyRoomClientProps> = ({ studyRoom }) => {
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);

  // Participant cleanup on unmount
  useEffect(() => {
    return () => {
        if(firestore && user) {
            const roomRef = doc(firestore, 'studyRooms', studyRoom.id);
            updateDoc(roomRef, {
                participantCount: increment(-1)
            });
        }
    }
  },[firestore, user, studyRoom.id]);

  // Setup media and signaling
  useEffect(() => {
    if (!user || !firestore) return;

    const setupMediaAndSignaling = async () => {
      // 1. Get local media
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
      
      const roomRef = doc(firestore, 'studyRooms', studyRoom.id);
      await updateDoc(roomRef, { participantCount: increment(1) });

      const callDoc = doc(collection(firestore, 'studyRooms', studyRoom.id, 'calls'));
      const offerCandidates = collection(callDoc, 'offerCandidates');
      const answerCandidates = collection(callDoc, 'answerCandidates');

      pc.onicecandidate = event => {
        event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
      };

      // 2. Create offer
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callDoc, { offer });

      // 3. Listen for answer
      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });
      
      // 4. Listen for remote ICE candidates
      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
      
       // 5. Handle remote stream
        pc.ontrack = (event) => {
            setRemoteStreams(prev => {
                // Avoid adding duplicate streams
                if(prev.find(s => s.id === event.streams[0].id)) return prev;
                return [...prev, event.streams[0]]
            });
        };
    };

    setupMediaAndSignaling();

  }, [pc, user, firestore, studyRoom.id, toast]);

    useEffect(() => {
    if (!firestore || !studyRoom.id) return;

    const messagesQuery = query(collection(firestore, 'studyRooms', studyRoom.id, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const chatMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
        setMessages(chatMessages);
    });

    return () => unsubscribe();

  }, [firestore, studyRoom.id]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !newMessage.trim()) return;

    await addDoc(collection(firestore, 'studyRooms', studyRoom.id, 'messages'), {
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
        const roomRef = doc(firestore, 'studyRooms', studyRoom.id);
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

    router.push('/dashboard/study-rooms');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-black rounded-lg overflow-hidden relative">
       <div className="flex-1 flex flex-col relative">
          <Tabs defaultValue="video" className="w-full h-full flex flex-col">
              <div className="absolute top-4 left-4 z-10 bg-black/50 rounded-lg p-1">
                  <TabsList>
                      <TabsTrigger value="video"><Users className="h-4 w-4 mr-2" />Participants</TabsTrigger>
                      <TabsTrigger value="whiteboard"><Edit className="h-4 w-4 mr-2" />Whiteboard</TabsTrigger>
                  </TabsList>
              </div>

              <TabsContent value="video" className="flex-1 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 h-full">
                    <div className="relative bg-gray-900 rounded-md overflow-hidden">
                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">{user?.displayName} (You)</div>
                    </div>
                    {remoteStreams.map((stream, index) => (
                        <div key={index} className="relative bg-gray-900 rounded-md overflow-hidden">
                            <video ref={el => { if (el) el.srcObject = stream; }} autoPlay playsInline className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">Participant {index+1}</div>
                        </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="whiteboard" className="flex-1 bg-gray-800 h-full">
                {firestore && <Whiteboard roomId={studyRoom.id} firestore={firestore} />}
              </TabsContent>
          </Tabs>
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

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex justify-center items-center gap-4 z-10">
        <Button onClick={toggleMic} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", !isMicOn && "bg-destructive hover:bg-destructive/90")}>
          {isMicOn ? <Mic /> : <MicOff />}
        </Button>
        <Button onClick={toggleCamera} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", !isCameraOn && "bg-destructive hover:bg-destructive/90")}>
          {isCameraOn ? <Video /> : <VideoOff />}
        </Button>
        <Button onClick={handleScreenShare} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", isScreenSharing && "bg-blue-500 hover:bg-blue-600")}>
          {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
        </Button>
        <Button onClick={hangUp} variant="destructive" size="icon" className="rounded-full w-16 h-12">
          <PhoneOff />
        </Button>
         <Button onClick={() => setIsChatOpen(!isChatOpen)} variant="outline" size="icon" className={cn("rounded-full w-12 h-12 bg-gray-700/80 hover:bg-gray-600/80 border-none text-white", isChatOpen && 'bg-primary/80')}>
          <MessageSquare />
        </Button>
      </div>
    </div>
  );
};

export default StudyRoomClient;
