
'use client';
import { z } from 'zod';

export type UserRole = 'user' | 'student' | 'teacher' | 'sponsor' | 'admin' | 'developer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  postCount?: number;
  commentCount?: number;
  mute?: boolean;
  stopVideo?: boolean;
}

export interface StudentProgress {
  progress: number;
  score?: number;
  timeSpent?: number; // in minutes
  completedLessons: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  content: string; // video URL, markdown text, or quiz ID
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorId: string;
  instructorAvatar: string;
  thumbnail: string;
  rating: number;
  students: string[];
  progress?: { [studentId: string]: StudentProgress };
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  description: string;
  lessonsCount: number;
  modules?: Module[];
}

export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  instructorId: string;
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
    createdAt: any; // Can be a server timestamp
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

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    coverImage?: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    createdAt: any;
    updatedAt: any;
    likes: string[];
    commentCount: number;
}

export interface BlogComment {
    id: string;
    postId: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    createdAt: any;
}

export const teacherRegistrationSchema = z.object({
  // Step 1
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().refine((val) => new Date(val) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18)), {
    message: "You must be at least 18 years old",
  }),
  profilePhoto: z.any().refine((file) => file instanceof File, 'Profile photo is required'),
  country: z.string().min(2, 'Please select a country'),
  timezone: z.string().min(2, 'Please select a timezone'),
  preferredLanguage: z.array(z.string()).min(1, 'Please select at least one language'),
  
  // Step 2
  bio: z.string().min(100, 'Your bio must be at least 100 characters long.'),
  headline: z.string().min(10, 'Headline must be at least 10 characters long.').max(70, 'Headline must be 70 characters or less.'),
  areasOfExpertise: z.array(z.string()).min(1, 'Please select at least one area of expertise.'),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL.').optional().or(z.literal('')),
  websiteUrl: z.string().url('Please enter a valid website or portfolio URL.').optional().or(z.literal('')),
});


export type StudentData = UserProfile & {
  studentId: string;
  courseTitle: string;
};
