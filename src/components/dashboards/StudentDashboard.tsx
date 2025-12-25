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
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Course, LiveClass, Achievement, StudentProgress } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const StudentDashboard: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const enrolledCoursesQuery = firestore && user?.uid ? query(collection(firestore, 'courses'), where('students', 'array-contains', user.uid), limit(3)) : null;
  const { data: enrolledCourses, loading: enrolledCoursesLoading } = useCollection<Course>(enrolledCoursesQuery);

  const recommendedCoursesQuery = firestore ? query(collection(firestore, 'courses'), where('students', 'not-in', [user?.uid || '']), limit(4)) : null;
  const { data: recommendedCourses, loading: recommendedCoursesLoading } = useCollection<Course>(recommendedCoursesQuery);
  
  const liveClassesQuery = firestore ? query(collection(firestore, 'liveClasses'), orderBy('startTime', 'asc')) : null;
  const { data: liveClasses, loading: liveClassesLoading } = useCollection<LiveClass>(liveClassesQuery);
  
  const achievementsQuery = user && firestore ? query(collection(firestore, 'users', user.uid, 'achievements'), orderBy('earnedAt', 'desc'), limit(2)) : null;
  const { data: achievements, loading: achievementsLoading } = useCollection<Achievement>(achievementsQuery);


  const upcomingClasses = liveClasses?.filter(c => new Date(c.startTime) > new Date()).slice(0, 2) || [];
  const liveNow = liveClasses?.filter(c => new Date(c.startTime) <= new Date() && new Date(c.startTime).getTime() + c.duration * 60000 > Date.now()) || [];

  const isLoading = userLoading || enrolledCoursesLoading || recommendedCoursesLoading || liveClassesLoading || achievementsLoading;

  const { totalTime, averageProgress } = React.useMemo(() => {
    if (!enrolledCourses || !user) return { totalTime: 0, averageProgress: 0 };
    let totalTime = 0;
    let totalProgress = 0;
    enrolledCourses.forEach(course => {
      const studentProgress = course.progress?.[user.uid];
      if(studentProgress) {
        totalTime += studentProgress.timeSpent || 0;
        totalProgress += studentProgress.progress || 0;
      }
    });
    const avgProgress = enrolledCourses.length > 0 ? totalProgress / enrolledCourses.length : 0;
    return { totalTime, averageProgress: avgProgress };
  }, [enrolledCourses, user]);

  const totalEnrolled = enrolledCourses?.length || 0;
  const totalAchievements = achievements?.length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋</h1>
          <p className="text-muted-foreground mt-1">Continue your learning journey today.</p>
        </div>
        <Button className="btn-touch-target" size="lg" asChild>
          <Link href="/dashboard/my-courses">
            <Play className="h-5 w-5 mr-2" />
            My Courses
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Courses"
          value={totalEnrolled}
          icon={BookOpen}
        />
        <StatCard
          title="Achievements"
          value={totalAchievements}
          icon={Trophy}
        />
        <StatCard
          title="Learning Hours"
          value={`${(totalTime / 60).toFixed(1)}h`}
          icon={Clock}
        />
        <StatCard
          title="Avg. Progress"
          value={`${Math.round(averageProgress)}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Live Classes Section */}
      {liveNow.length > 0 && (
        <section aria-labelledby="live-classes-heading">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            <h2 id="live-classes-heading" className="text-xl font-semibold text-foreground">
              Live Now
            </h2>
          </div>
          <div className="grid gap-4">
            {liveNow.map((liveClass) => (
              <Link key={liveClass.id} href={`/dashboard/live/${liveClass.id}`}>
                <LiveClassCard liveClass={liveClass} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* My Courses Section */}
      <section aria-labelledby="my-courses-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="my-courses-heading" className="text-xl font-semibold text-foreground">
            My Courses
          </h2>
          <Button variant="ghost" className="text-primary" asChild>
            <Link href="/dashboard/my-courses">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(enrolledCourses || []).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              showProgress
            />
          ))}
        </div>
        {!enrolledCoursesLoading && enrolledCourses?.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">You are not enrolled in any courses yet.</h3>
          </div>
        )}
      </section>

      {/* Upcoming Classes Section */}
      <section aria-labelledby="upcoming-classes-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="upcoming-classes-heading" className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Classes
          </h2>
          <Button variant="ghost" className="text-primary" asChild>
            <Link href="/dashboard/live-classes">View Calendar</Link>
          </Button>
        </div>
        <div className="grid gap-4">
          {upcomingClasses.map((liveClass) => (
            <Link key={liveClass.id} href={`/dashboard/live/${liveClass.id}`}>
                <LiveClassCard liveClass={liveClass} />
            </Link>
          ))}
           {!liveClassesLoading && upcomingClasses?.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">No upcoming classes.</h3>
          </div>
        )}
        </div>
      </section>

      {/* Achievements Section */}
      <section aria-labelledby="achievements-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="achievements-heading" className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Recent Achievements
          </h2>
          <Button variant="ghost" className="text-primary" asChild>
            <Link href="/dashboard/achievements">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(achievements || []).map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onDownload={() => console.log('Download certificate:', achievement.id)}
            />
          ))}
           {!achievementsLoading && achievements?.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg md:col-span-2">
            <h3 className="text-lg font-medium">No achievements yet. Keep learning!</h3>
          </div>
        )}
        </div>
      </section>

      {/* Course Recommendations */}
      <section aria-labelledby="recommendations-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recommendations-heading" className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Recommended for You
          </h2>
          <Button variant="ghost" className="text-primary" asChild>
            <Link href="/">Browse All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(recommendedCourses || []).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
           {!recommendedCoursesLoading && recommendedCourses?.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg col-span-full">
              <h3 className="text-lg font-medium">No courses to recommend right now.</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
