
'use client';
import React, { useState } from 'react';
import { Star, Users, Clock, Play, User, Edit, Loader2 } from 'lucide-react';
import { Course } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';
import { enrollInCourse } from '@/app/actions';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  className,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const levelColors = {
    Beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };

  const isEnrolled = user && course.students?.includes(user.uid);
  const isOwner = user && course.instructorId === user.uid;

  const studentProgress = isEnrolled && course.progress?.[user.uid!]?.progress || 0;
  const studentCount = Array.isArray(course.students) ? course.students.length : 0;
  
  const courseLink = isEnrolled || isOwner 
    ? (isOwner ? `/dashboard/manage-course/${course.id}` : `/dashboard/my-courses/${course.id}`)
    : `/`; // Link to homepage or a public course page if not enrolled/owner

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsEnrolling(true);
    const result = await enrollInCourse(course.id, user.uid);
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      // Optionally re-fetch data or navigate
    } else {
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: result.message,
      });
    }
    setIsEnrolling(false);
  };


  return (
    <div
      className={cn(
        'group bg-card rounded-xl border border-border overflow-hidden card-hover h-full flex flex-col',
        className
      )}
    >
        <div className="relative aspect-video overflow-hidden">
          <Link href={courseLink}>
            <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <Badge className={cn('absolute top-3 left-3', levelColors[course.level])}>
            {course.level}
          </Badge>
          {isEnrolled && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${studentProgress}%` }}
              />
            </div>
          )}
        </div>

      <div className="p-4 space-y-3 flex flex-col flex-grow">
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

        <div className="flex items-center justify-between text-sm text-muted-foreground !mt-auto">
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
        
        <div className="pt-2">
            {isOwner && (
                <Button asChild variant="secondary" className="w-full">
                    <Link href={`/dashboard/manage-course/${course.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Manage Course
                    </Link>
                </Button>
            )}

            {isEnrolled && (
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
            
            {!isOwner && !isEnrolled && (
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">
                    ${course.price}
                    </span>
                    <Button onClick={handleEnroll} disabled={isEnrolling}>
                    {isEnrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
