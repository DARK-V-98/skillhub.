'use client';
import React from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Course, UserProfile } from '@/lib/types';
import { Loader2, Users } from 'lucide-react';
import { DataTable } from '@/components/students/data-table';
import { columns } from '@/components/students/columns';

export default function StudentsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  // 1. Get all courses taught by the current teacher
  const teacherCoursesQuery = user
    ? query(collection(firestore, 'courses'), where('instructorId', '==', user.uid))
    : null;
  const { data: teacherCourses, loading: coursesLoading } = useCollection<Course>(teacherCoursesQuery);

  // 2. Get all student IDs from those courses
  const studentIds = React.useMemo(() => {
    if (!teacherCourses) return [];
    const ids = new Set<string>();
    teacherCourses.forEach(course => {
      if (Array.isArray(course.students)) {
        course.students.forEach(studentId => ids.add(studentId));
      }
    });
    return Array.from(ids);
  }, [teacherCourses]);

  // 3. Fetch all student profiles based on the IDs
  // Note: 'in' queries are limited to 30 items. For more, you'd need multiple queries.
  const studentsQuery = firestore && studentIds.length > 0
    ? query(collection(firestore, 'users'), where('__name__', 'in', studentIds.slice(0, 30)))
    : null;
  const { data: students, loading: studentsLoading } = useCollection<UserProfile>(studentsQuery);
  
  const loading = userLoading || coursesLoading || studentsLoading;

  const tableData = React.useMemo(() => {
    if (!students || !teacherCourses) return [];
    return students.map(student => {
        const enrolledCourse = teacherCourses.find(c => Array.isArray(c.students) && c.students.includes(student.id));
        return {
            ...student,
            courseTitle: enrolledCourse?.title || 'Unknown Course'
        }
    });
  }, [students, teacherCourses]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            My Students
          </h1>
          <p className="text-muted-foreground mt-1">
            View all students enrolled in your courses.
          </p>
        </div>
      </div>
      
      {loading ? (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      ) : (
        <DataTable columns={columns} data={tableData} />
      )}
    </>
  );
}
