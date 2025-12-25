
'use client';
import React from 'react';
import { 
  Users, 
  DollarSign, 
  Star, 
  BookOpen,
  TrendingUp,
  BarChart3,
  PlusCircle,
  Video,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Course } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import Link from 'next/link';
import CourseCard from '../CourseCard';

const TeacherDashboard: React.FC = () => {
    const firestore = useFirestore();
    const { user } = useUser();

    const coursesQuery = user ? query(collection(firestore, 'courses'), where('instructorId', '==', user.uid)) : null;
    const { data: myCourses, loading: coursesLoading } = useCollection<Course>(coursesQuery);

    const totalStudents = React.useMemo(() => myCourses?.reduce((acc, course) => acc + (Array.isArray(course.students) ? course.students.length : 0), 0) || 0, [myCourses]);
    const courseRevenue = React.useMemo(() => myCourses?.reduce((acc, course) => acc + (course.price * (Array.isArray(course.students) ? course.students.length : 0)), 0) || 0, [myCourses]);
    const averageRating = React.useMemo(() => {
        if (!myCourses || myCourses.length === 0) return 0;
        const ratedCourses = myCourses.filter(c => c.rating > 0);
        if (ratedCourses.length === 0) return 'N/A';
        const totalRating = ratedCourses.reduce((acc, course) => acc + course.rating, 0);
        return (totalRating / ratedCourses.length).toFixed(2);
    }, [myCourses]);

    if (coursesLoading) {
        return (
          <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
    }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your courses and track performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="btn-touch-target" asChild>
             <Link href="/dashboard/teacher/live-classes">
                <Video className="h-4 w-4 mr-2" />
                Manage Live Classes
             </Link>
          </Button>
          <Button className="btn-touch-target" asChild>
            <Link href="/dashboard/create-course">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Est. Revenue"
          value={`$${courseRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Average Rating"
          value={averageRating}
          icon={Star}
        />
        <StatCard
          title="Active Courses"
          value={myCourses?.length || 0}
          icon={BookOpen}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Earnings (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Earnings chart coming soon.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Performance Metrics (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Performance metrics coming soon.</p>
          </CardContent>
        </Card>
      </div>

      {/* My Courses Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">My Courses</h2>
          <Button variant="ghost" className="text-primary" asChild>
            <Link href="/dashboard/my-courses">
                Manage All
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {myCourses?.slice(0, 4).map((course) => (
             <CourseCard key={course.id} course={course} />
          ))}
          {!coursesLoading && myCourses?.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg md:col-span-2">
                <h3 className="text-lg font-medium">You haven't created any courses yet.</h3>
                 <Button asChild className="mt-4">
                    <Link href="/dashboard/create-course">Create Your First Course</Link>
                </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
