import React from 'react';
import { Star, Users, Clock, Play } from 'lucide-react';
import { Course } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  onEnroll?: () => void;
  onContinue?: () => void;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  showProgress = false,
  onEnroll,
  onContinue,
  className,
}) => {
  const levelColors = {
    Beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };

  return (
    <div
      className={cn(
        'group bg-card rounded-xl border border-border overflow-hidden card-hover animate-fade-in',
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className={cn('absolute top-3 left-3', levelColors[course.level])}>
          {course.level}
        </Badge>
        {showProgress && course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-sm text-muted-foreground">{course.instructor}</span>
        </div>

        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[48px]">
          {course.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        {showProgress && course.progress !== undefined ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{course.progress}%</span>
            </div>
            <Button
              onClick={onContinue}
              className="w-full btn-touch-target"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              {course.progress === 100 ? 'Review' : 'Continue'}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-foreground">
              ${course.price}
            </span>
            <Button
              onClick={onEnroll}
              variant="default"
              className="btn-touch-target"
            >
              Enroll Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
