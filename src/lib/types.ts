export type UserRole = 'student' | 'teacher' | 'sponsor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
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
  id: string;
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
