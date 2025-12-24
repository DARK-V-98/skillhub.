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
} from 'firebase/firestore';
import { Button } from './ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, ScreenShareOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface LiveClassroomProps {
  liveClass: LiveClass;
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

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupStream = async () => {
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

    setupStream();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!localStream || !firestore || !user) return;

    const peerConnection = new RTCPeerConnection(servers);
    setPc(peerConnection);

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    const remote = new MediaStream();
    setRemoteStream(remote);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remote;
    }

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remote.addTrack(track);
      });
    };

    const callId = liveClass.id;
    const callDoc = doc(firestore, 'calls', callId);
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    // Create offer
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    const createOffer = async () => {
      const offerDescription = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offerDescription);
      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };
      await addDoc(collection(firestore, 'calls'), { offer, id: callId });
    };

    // For simplicity, let's assume the teacher creates the offer.
    // In a real app, you'd need more sophisticated role detection.
    if (user.uid === 'TzBQYx3f1fVbF3aX2x4E9oY3gJh1') { // A mock teacher UID
        createOffer();
    }
    
    // Listen for remote answer
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        peerConnection.setRemoteDescription(answerDescription);
      }
    });

    // Listen for ICE candidates
    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.addIceCandidate(candidate);
        }
      });
    });

    return () => {
        peerConnection.close();
    }
  }, [localStream, firestore, user, liveClass.id]);


  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };
  
  const hangUp = () => {
    pc?.close();
    localStream?.getTracks().forEach((track) => track.stop());
    router.push('/dashboard/live-classes');
  }

  // Simplified for this example
  const handleScreenShare = () => {
      toast({ title: "Coming Soon!", description: "Screen sharing will be implemented in a future update."})
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-black rounded-lg overflow-hidden">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
        <div className="relative bg-gray-900 rounded-md overflow-hidden">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
           <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
            Remote User
          </div>
        </div>
        <div className="relative bg-gray-900 rounded-md overflow-hidden">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
            {user?.displayName || 'You'}
          </div>
        </div>
      </div>
      <div className="bg-gray-800/50 p-4 flex justify-center items-center gap-4">
        <Button onClick={toggleMic} variant="outline" size="icon" className={cn("rounded-full bg-gray-700 hover:bg-gray-600 border-none", !isMicOn && "bg-destructive hover:bg-destructive/90")}>
          {isMicOn ? <Mic className="text-white" /> : <MicOff className="text-white"/>}
        </Button>
        <Button onClick={toggleCamera} variant="outline" size="icon" className={cn("rounded-full bg-gray-700 hover:bg-gray-600 border-none", !isCameraOn && "bg-destructive hover:bg-destructive/90")}>
          {isCameraOn ? <Video className="text-white"/> : <VideoOff className="text-white"/>}
        </Button>
        <Button onClick={handleScreenShare} variant="outline" size="icon" className={cn("rounded-full bg-gray-700 hover:bg-gray-600 border-none", isScreenSharing && "bg-blue-500 hover:bg-blue-600")}>
          {isScreenSharing ? <ScreenShareOff className="text-white"/> : <ScreenShare className="text-white"/>}
        </Button>
        <Button onClick={hangUp} variant="destructive" size="icon" className="rounded-full">
          <PhoneOff className="text-white"/>
        </Button>
      </div>
    </div>
  );
};

export default LiveClassroom;
