'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { StudyRoom } from '@/lib/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import StudyRoomClient from '@/components/study/StudyRoomClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StudyRoomPage = () => {
  const params = useParams();
  const roomId = params.roomId as string;
  const firestore = useFirestore();

  const roomRef = firestore ? doc(firestore, 'studyRooms', roomId) : null;
  const { data: studyRoom, loading: roomLoading, error: roomError } = useDoc<StudyRoom>(roomRef);

  if (roomLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (roomError || !studyRoom) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive">Study Room Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The room you are looking for does not exist or has been closed.
        </p>
         <Button asChild variant="outline" className="mt-6">
            <Link href="/dashboard/study-rooms">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Study Rooms
            </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-0 -mt-8">
        <StudyRoomClient studyRoom={studyRoom} />
    </div>
  );
};

export default StudyRoomPage;
