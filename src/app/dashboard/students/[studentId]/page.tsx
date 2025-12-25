
'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { collection, doc, query, where } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { UserProfile, Course } from '@/lib/types';
import { Loader2, ArrowLeft, Mail, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.studentId as string;
  const { user: teacher } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const studentProfileRef = firestore && studentId ? doc(firestore, 'users', studentId) : null;
  const { data: student, loading: studentLoading } = useDoc<UserProfile>(studentProfileRef);

  const studentCoursesQuery = firestore && studentId && teacher
    ? query(
        collection(firestore, 'courses'),
        where('instructorId', '==', teacher.uid),
        where('students', 'array-contains', studentId)
      )
    : null;
  const { data: courses, loading: coursesLoading } = useCollection<Course>(studentCoursesQuery);

  const loading = studentLoading || coursesLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive">Student Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The student profile you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/dashboard/students">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Students
          </Link>
        </Button>
        <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback className="text-3xl">{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold">{student.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {student.email}</span>
                    <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Enrolled in {courses?.length || 0} of your courses</span>
                </div>
            </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Enrollment & Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courses && courses.length > 0 ? (
            courses.map(course => {
              const studentProgress = course.progress?.[studentId];
              return (
                <div key={course.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{course.title}</h3>
                  {studentProgress ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-primary">{studentProgress.progress}%</span>
                      </div>
                      <Progress value={studentProgress.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2">
                          <span>Score: {studentProgress.score || 'N/A'}</span>
                          <span>Lessons: {studentProgress.completedLessons} / {course.lessonsCount}</span>
                          <span>Time: {studentProgress.timeSpent ? `${(studentProgress.timeSpent / 60).toFixed(1)}h` : 'N/A'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">No progress data available for this course.</p>
                  )}
                </div>
              )
            })
          ) : (
            <p className="text-center text-muted-foreground py-8">This student is not enrolled in any of your courses.</p>
          )}
        </CardContent>
      </Card>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
                <CardHeader>
                    <CardTitle>Engagement Analytics</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Engagement chart coming soon.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Communication</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 items-center justify-center h-48">
                    <p className="text-muted-foreground">Direct messaging coming soon.</p>
                    <Button>Send Message</Button>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
