'use client';
import React from 'react';
import { LiveClass } from '@/lib/types';
import VideoConference from './VideoConference';

interface LiveClassroomProps {
  liveClass: LiveClass;
}

const LiveClassroom: React.FC<LiveClassroomProps> = ({ liveClass }) => {
    return <VideoConference room={liveClass} collectionName="liveClasses" />;
}

export default LiveClassroom;
