'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { StudyRoom } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreateStudyRoomForm from '@/components/study/CreateStudyRoomForm';
import StudyRoomCard from '@/components/study/StudyRoomCard';

export default function StudyRoomsPage() {
  const firestore = useFirestore();
  const [isCreateRoomOpen, setCreateRoomOpen] = useState(false);

  const roomsQuery = firestore
    ? query(collection(firestore, 'studyRooms'), orderBy('createdAt', 'desc'))
    : null;

  const { data: rooms, loading } = useCollection<StudyRoom>(roomsQuery);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Virtual Study Rooms
          </h1>
          <p className="text-muted-foreground mt-1">
            Join a group or create your own to study with peers.
          </p>
        </div>
        <Dialog open={isCreateRoomOpen} onOpenChange={setCreateRoomOpen}>
          <DialogTrigger asChild>
            <Button className="btn-touch-target">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Study Room</DialogTitle>
            </DialogHeader>
            <CreateStudyRoomForm onSuccess={() => setCreateRoomOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => <StudyRoomCard key={room.id} room={room} />)
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg col-span-full">
              <h3 className="text-xl font-semibold">No study rooms available.</h3>
              <p className="text-muted-foreground mt-2">
                Be the first one to create a room!
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
