
'use client';
import React from 'react';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Play,
  Star,
  Calendar,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import CourseCard from '@/components/CourseCard';
import LiveClassCard from '@/components/LiveClassCard';
import AchievementCard from '@/components/AchievementCard';
import { courses, liveClasses, achievements } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';

const StudentDashboard: React.FC = () => {
  const { user } = useUser();
  const enrolledCourses = courses.filter(c => c.progress !== undefined);
  const upcomingClasses = liveClasses.filter(c => !c.isLive).slice(0, 2);
  const liveNow = liveClasses.filter(c => c.isLive);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋</h1>
          <p className="text-muted-foreground mt-1">Continue your learning journey today.</p>
        </div>
        <Button className="btn-touch-target" size="lg">
          <Play className="h-5 w-5 mr-2" />
          Resume Learning
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Courses"
          value={enrolledCourses.length}
          icon={BookOpen}
        />
        <StatCard
          title="Achievements"
          value={achievements.length}
          icon={Trophy}
        />
        <StatCard
          title="Learning Hours"
          value="47.5h"
          icon={Clock}
        />
        <StatCard
          title="Avg. Progress"
          value="68%"
          icon={TrendingUp}
        />
      </div>

      {/* Live Classes Section */}
      {liveNow.length > 0 && (
        <section aria-labelledby="live-classes-heading">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-3 w-3 rounded-full bg-destructive animate-pulse-soft" />
            <h2 id="live-classes-heading" className="text-xl font-semibold text-foreground">
              Live Now
            </h2>
          </div>
          <div className="grid gap-4">
            {liveNow.map((liveClass) => (
              <LiveClassCard key={liveClass.id} liveClass={liveClass} />
            ))}
          </div>
        </section>
      )}

      {/* My Courses Section */}
      <section aria_labelledby="my-courses-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="my-courses-heading" className="text-xl font-semibold text-foreground">
            My Courses
          </h2>
          <Button variant="ghost" className="text-primary">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.slice(0, 3).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              showProgress
              onContinue={() => console.log('Continue course:', course.id)}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Classes Section */}
      <section aria-labelledby="upcoming-classes-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="upcoming-classes-heading" className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Classes
          </h2>
          <Button variant="ghost" className="text-primary">
            View Calendar
          </Button>
        </div>
        <div className="grid gap-4">
          {upcomingClasses.map((liveClass) => (
            <LiveClassCard key={liveClass.id} liveClass={liveClass} />
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section aria-labelledby="achievements-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="achievements-heading" className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Recent Achievements
          </h2>
          <Button variant="ghost" className="text-primary">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.slice(0, 2).map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onDownload={() => console.log('Download certificate:', achievement.id)}
            />
          ))}
        </div>
      </section>

      {/* Course Recommendations */}
      <section aria-labelledby="recommendations-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recommendations-heading" className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Recommended for You
          </h2>
          <Button variant="ghost" className="text-primary">
            Browse All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.filter(c => c.progress === undefined).slice(0, 4).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={() => console.log('Enroll in course:', course.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
