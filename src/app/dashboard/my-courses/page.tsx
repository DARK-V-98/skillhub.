'use client';
import React from 'react';
import CourseCard from '@/components/CourseCard';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';
import { Course } from '@/lib/types';
import { Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function MyCoursesPage() {
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();

  const coursesQuery = user
    ? query(collection(firestore, 'courses'), where('students', 'array-contains', user.uid))
    : null;

  const { data: enrolledCourses, loading: coursesLoading } = useCollection<Course>(coursesQuery);

  const isLoading = userLoading || coursesLoading;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            My Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            All of your enrolled courses in one place.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {enrolledCourses && enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showProgress
                  onContinue={() => console.log('Continue course:', course.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">You haven't enrolled in any courses yet.</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore our course catalog to start learning.
              </p>
              <div className="mt-6">
                  <Link href="/dashboard" className="text-primary font-semibold hover:underline">
                      Explore Courses
                  </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
