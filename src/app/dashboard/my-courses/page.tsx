'use client';
import React from 'react';
import CourseCard from '@/components/CourseCard';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';
import { Course } from '@/lib/types';
import { Loader2, BookOpen, Edit } from 'lucide-react';
import Link from 'next/link';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';

export default function MyCoursesPage() {
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();
  const { currentRole } = useRole();

  const isTeacher = currentRole === 'teacher' || currentRole === 'admin' || currentRole === 'developer';

  const coursesQuery = user
    ? query(collection(firestore, 'courses'), where(isTeacher ? 'instructorId' : 'students', '==', user.uid))
    : null;

  const { data: userCourses, loading: coursesLoading } = useCollection<Course>(coursesQuery);

  const isLoading = userLoading || coursesLoading;

  const pageTitle = isTeacher ? 'My Created Courses' : 'My Enrolled Courses';
  const pageDescription = isTeacher 
    ? 'Manage all of the courses you have created.'
    : 'All of your enrolled courses in one place.';

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            {pageTitle}
          </h1>
          <p className="text-muted-foreground mt-1">
            {pageDescription}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {userCourses && userCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCourses.map((course) => (
                <div key={course.id} className="relative group">
                  <CourseCard
                    course={course}
                    showProgress={!isTeacher}
                    onContinue={() => console.log('Continue course:', course.id)}
                  />
                  {isTeacher && (
                     <Button asChild className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/manage-course/${course.id}`}>
                            <Edit className="h-4 w-4 mr-2" /> Manage
                        </Link>
                     </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">
                {isTeacher ? "You haven't created any courses yet." : "You haven't enrolled in any courses yet."}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isTeacher ? "Create a course to start teaching." : "Explore our course catalog to start learning."}
              </p>
              <div className="mt-6">
                  <Link href={isTeacher ? "/dashboard/create-course" : "/dashboard"} className="text-primary font-semibold hover:underline">
                      {isTeacher ? "Create a Course" : "Explore Courses"}
                  </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
