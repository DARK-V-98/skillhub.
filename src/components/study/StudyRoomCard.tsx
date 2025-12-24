'use client';
import React from 'react';
import { StudyRoom } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface StudyRoomCardProps {
  room: StudyRoom;
}

const StudyRoomCard: React.FC<StudyRoomCardProps> = ({ room }) => {
  return (
    <Card className="flex flex-col card-hover">
      <CardHeader>
        <CardTitle className="line-clamp-2">{room.name}</CardTitle>
        <CardDescription className="line-clamp-3 h-[60px]">{room.description || 'No description provided.'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1.5" />
          <span>{room.participantCount} active participant(s)</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
            <p>Created by {room.creatorName}</p>
            <p>{formatDistanceToNow(new Date(room.createdAt?.seconds * 1000 || Date.now()), { addSuffix: true })}</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/study-rooms/${room.id}`}>
            Join Room <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyRoomCard;
