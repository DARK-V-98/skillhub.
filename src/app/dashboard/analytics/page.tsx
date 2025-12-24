
'use client';
import React from 'react';
import { 
  Users, 
  DollarSign, 
  Star, 
  BarChart3,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Course } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsPage: React.FC = () => {
    const firestore = useFirestore();
    const { user } = useUser();

    const coursesQuery = user ? query(collection(firestore, 'courses'), where('instructorId', '==', user.uid)) : null;
    const { data: myCourses, loading: coursesLoading } = useCollection<Course>(coursesQuery);

    const totalStudents = React.useMemo(() => myCourses?.reduce((acc, course) => acc + course.students.length, 0) || 0, [myCourses]);
    const courseRevenue = React.useMemo(() => myCourses?.reduce((acc, course) => acc + (course.price * course.students.length), 0) || 0, [myCourses]);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Track your performance and earnings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Total Revenue"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Earnings (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Detailed earnings chart coming soon.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Student Engagement (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Engagement metrics coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
