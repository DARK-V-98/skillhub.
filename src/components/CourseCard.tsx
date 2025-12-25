'use client';
import React from 'react';
import { Star, Users, Clock, Play, User, Edit } from 'lucide-react';
import { Course } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  isTeacherOrAdmin?: boolean;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  showProgress = false,
  isTeacherOrAdmin = false,
  className,
}) => {
  const levelColors = {
    Beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };

  const studentProgress = showProgress && course.progress && course.progress[Object.keys(course.progress)[0]] || 0;
  const studentCount = Array.isArray(course.students) ? course.students.length : 0;
  const courseLink = isTeacherOrAdmin ? `/dashboard/manage-course/${course.id}` : `/dashboard/courses/${course.id}`;

  return (
    <div
      className={cn(
        'group bg-card rounded-xl border border-border overflow-hidden card-hover',
        className
      )}
    >
      <Link href={courseLink} className="block">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className={cn('absolute top-3 left-3', levelColors[course.level])}>
            {course.level}
          </Badge>
          {showProgress && studentProgress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${studentProgress}%` }}
              />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{course.instructor}</span>
        </div>

        <Link href={courseLink}>
            <h3 className="font-semibold text-foreground line-clamp-2 min-h-[48px] hover:text-primary transition-colors">
            {course.title}
            </h3>
        </Link>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{studentCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        {isTeacherOrAdmin && (
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/dashboard/manage-course/${course.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Manage Course
            </Link>
          </Button>
        )}

        {showProgress && studentProgress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{studentProgress}%</span>
            </div>
            <Button asChild size="lg" className="w-full">
              <Link href={courseLink}>
                <Play className="h-4 w-4 mr-2" />
                {studentProgress === 100 ? 'Review' : 'Continue'}
              </Link>
            </Button>
          </div>
        )}
        
        {!showProgress && !isTeacherOrAdmin && (
            <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-foreground">
                ${course.price}
                </span>
                <Button variant="default">
                Enroll Now
                </Button>
            </div>
        )}

      </div>
    </div>
  );
};

export default CourseCard;
