
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { doc, collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { UserProfile, Course } from '@/lib/types';
import { Loader2, Mail, BookOpen, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CourseCard from '@/components/CourseCard';
import Header from '@/components/header';
import Footer from '@/components/footer';

const TeacherProfilePage = () => {
    const params = useParams();
    const teacherId = params.teacherId as string;
    const firestore = useFirestore();

    const teacherRef = firestore ? doc(firestore, 'users', teacherId) : null;
    const { data: teacher, loading: teacherLoading } = useDoc<UserProfile>(teacherRef);
    
    const coursesQuery = firestore ? query(collection(firestore, 'courses'), where('instructorId', '==', teacherId)) : null;
    const { data: courses, loading: coursesLoading } = useCollection<Course>(coursesQuery);

    const totalStudents = React.useMemo(() => {
        return courses?.reduce((acc, course) => acc + (Array.isArray(course.students) ? course.students.length : 0), 0) || 0;
    }, [courses]);

    if (teacherLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-destructive">Teacher not found</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="bg-card rounded-2xl shadow-lg border p-8 flex flex-col md:flex-row items-center gap-8 mb-12">
                    <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback className="text-4xl">{teacher.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold">{teacher.name}</h1>
                        <p className="text-muted-foreground text-lg mt-1">{teacher.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-6 mt-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary"/>
                                <span>{courses?.length || 0} Courses</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary"/>
                                <span>{totalStudents} Students</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-6">Courses by {teacher.name}</h2>
                {coursesLoading ? (
                     <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses && courses.length > 0 ? (
                            courses.map(course => <CourseCard key={course.id} course={course} />)
                        ) : (
                            <p className="md:col-span-3 text-center text-muted-foreground">This teacher has not published any courses yet.</p>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default TeacherProfilePage;
