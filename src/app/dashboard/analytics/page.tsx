
'use client';
import React from 'react';
import { 
  Users, 
  DollarSign, 
  Star, 
  BarChart3,
  TrendingUp,
  BookOpen,
  Eye,
  MessageSquare
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Course } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';

const teacherStats = { // Sample data for charts
    completionRate: 76,
    totalViews: 89234,
    monthlyEarnings: [
      { month: 'Jan', earnings: 8500 },
      { month: 'Feb', earnings: 9200 },
      { month: 'Mar', earnings: 11000 },
      { month: 'Apr', earnings: 10500 },
      { month: 'May', earnings: 12300 },
      { month: 'Jun', earnings: 14200 },
    ],
  };

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
              Monthly Earnings (Sample)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={teacherStats.monthlyEarnings}>
                    <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorEarnings)"
                    />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Performance Metrics (Sample)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{teacherStats.completionRate}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${teacherStats.completionRate}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student Engagement</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Content Quality Score</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-accent rounded-lg text-center">
                <Eye className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{teacherStats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
              <div className="p-4 bg-accent rounded-lg text-center">
                <MessageSquare className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">234</p>
                <p className="text-sm text-muted-foreground">Q&A Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
