
'use client';
import React from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { Course, StudentProgress } from '@/lib/types';
import { Loader2, TrendingUp, CheckCircle, Clock, BarChart } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const MyProgressPage: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const enrolledCoursesQuery = firestore && user?.uid 
    ? query(collection(firestore, 'courses'), where('students', 'array-contains', user.uid)) 
    : null;
  const { data: enrolledCourses, loading: coursesLoading } = useCollection<Course>(enrolledCoursesQuery);

  const isLoading = userLoading || coursesLoading;

  const overallStats = React.useMemo(() => {
    if (!enrolledCourses || !user) return {
      coursesCompleted: 0,
      lessonsCompleted: 0,
      totalTime: 0,
    };

    let coursesCompleted = 0;
    let lessonsCompleted = 0;
    let totalTime = 0;

    enrolledCourses.forEach(course => {
      const studentProgress = course.progress?.[user.uid];
      if (studentProgress) {
        if (studentProgress.progress === 100) {
          coursesCompleted++;
        }
        lessonsCompleted += studentProgress.completedLessons || 0;
        totalTime += studentProgress.timeSpent || 0;
      }
    });

    return { coursesCompleted, lessonsCompleted, totalTime };
  }, [enrolledCourses, user]);

  const today = new Date();
  const activityData = Array.from({ length: 180 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 5), // Demo data
    };
  }).reverse();


  if (isLoading) {
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
            <TrendingUp className="h-8 w-8 text-primary" />
            My Progress
          </h1>
          <p className="text-muted-foreground mt-1">Track your learning journey and skill mastery.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Courses Completed"
          value={overallStats.coursesCompleted}
          icon={CheckCircle}
        />
        <StatCard
          title="Lessons Watched"
          value={overallStats.lessonsCompleted}
          icon={BarChart}
        />
        <StatCard
          title="Total Learning Time"
          value={`${(overallStats.totalTime / 60).toFixed(1)}h`}
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Progress Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Time Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrolledCourses?.map(course => {
                const studentProgress: StudentProgress | undefined = course.progress?.[user!.uid];
                return (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={studentProgress?.progress || 0} className="w-[150px] h-3"/>
                        <span className="text-sm text-muted-foreground">{studentProgress?.progress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{studentProgress?.score || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      {studentProgress?.timeSpent ? `${(studentProgress.timeSpent / 60).toFixed(1)}h` : 'N/A'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
           {!coursesLoading && enrolledCourses?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
            <CardTitle>Learning Activity (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
                {activityData.map((d, i) => (
                    <Tooltip key={i}>
                        <TooltipTrigger asChild>
                            <div 
                                className="h-4 w-4 rounded-sm"
                                style={{ backgroundColor: `hsl(var(--primary) / ${d.count === 0 ? 0.1 : d.count * 0.2})`}}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{d.count} activities on {format(new Date(d.date), 'MMM d, yyyy')}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">This is a demo heatmap showing your learning activity over the past 6 months.</p>
          </CardContent>
      </Card>
    </div>
  );
};

export default MyProgressPage;
