'use client';
import React from 'react';
import { StudyRoom } from '@/lib/types';
import VideoConference from '../VideoConference';

interface StudyRoomClientProps {
  studyRoom: StudyRoom;
}

const StudyRoomClient: React.FC<StudyRoomClientProps> = ({ studyRoom }) => {
    return <VideoConference room={studyRoom} collectionName="studyRooms" />;
};

export default StudyRoomClient;
