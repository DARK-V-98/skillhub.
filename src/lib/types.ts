'use client';
export type UserRole = 'user' | 'student' | 'teacher' | 'sponsor' | 'admin' | 'developer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  postCount?: number;
  commentCount?: number;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorId: string;
  instructorAvatar: string;
  thumbnail: string;
  rating: number;
  students: number;
  progress?: number;
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  description: string;
  lessonsCount: number;
}

export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  course: string;
  startTime: string; // ISO 8601 date string
  duration: number;
  attendees: number;
  isLive: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string; // ISO 8601 date string
  type: 'badge' | 'certificate';
}

export interface Scholarship {
  id: string;
  title: string;
  sponsor: string;
  amount: number;
  beneficiaries: number;
  status: 'active' | 'completed' | 'pending';
  description: string;
}

export interface Notification {
  id:string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'class';
  timestamp: string; // ISO 8601 date string
  read: boolean;
}

export interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNav: boolean;
  textToSpeech: boolean;
  colorBlindFilter: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface CommunityPost {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    createdAt: string; // ISO 8601 date string
    upvotes: number;
    downvotes: number;
    commentCount: number;
    userVote?: 'up' | 'down';
  }
  
  export interface CommunityComment {
    id: string;
    postId: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    createdAt: any; // Can be a server timestamp
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down';
  }
  
  export interface CommunityVote {
    id: string;
    userId: string;
    refId: string; // postId or commentId
    refType: 'post' | 'comment';
    direction: 'up' | 'down';
  }

export interface StudyRoom {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    creatorName: string;
    createdAt: any; // ServerTimestamp
    participantCount: number;
}
