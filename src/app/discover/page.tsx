
'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Course, UserProfile } from '@/lib/types';
import CourseCard from '@/components/CourseCard';
import TeacherCard from '@/components/TeacherCard';
import { useDebounce } from 'use-debounce';

export default function DiscoverPage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const coursesQuery = firestore ? query(collection(firestore, 'courses')) : null;
  const { data: courses, loading: coursesLoading } = useCollection<Course>(coursesQuery);

  const teachersQuery = firestore ? query(collection(firestore, 'users'), where('role', '==', 'teacher')) : null;
  const { data: teachers, loading: teachersLoading } = useCollection<UserProfile>(teachersQuery);

  const filteredCourses = React.useMemo(() => {
    if (!courses) return [];
    return courses.filter(course => 
        course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [courses, debouncedSearchTerm]);

  const filteredTeachers = React.useMemo(() => {
    if (!teachers) return [];
    return teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [teachers, debouncedSearchTerm]);
  
  const loading = coursesLoading || teachersLoading;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary/50">
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Discover Your Next Opportunity</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Find the perfect course or instructor to help you achieve your goals.
                </p>
                <div className="max-w-2xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for courses, categories, or teachers..."
                        className="pl-12 h-12 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="courses">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                </TabsList>
                <TabsContent value="courses" className="mt-8">
                    {loading ? (
                         <div className="flex justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                     {!loading && filteredCourses.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h3 className="text-xl font-semibold">No courses found.</h3>
                            <p className="text-muted-foreground mt-2">
                                Try adjusting your search term.
                            </p>
                        </div>
                     )}
                </TabsContent>
                <TabsContent value="teachers" className="mt-8">
                     {loading ? (
                         <div className="flex justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredTeachers.map(teacher => (
                                <TeacherCard key={teacher.id} teacher={teacher} />
                            ))}
                        </div>
                    )}
                     {!loading && filteredTeachers.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h3 className="text-xl font-semibold">No teachers found.</h3>
                            <p className="text-muted-foreground mt-2">
                                Try adjusting your search term.
                            </p>
                        </div>
                     )}
                </TabsContent>
            </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
