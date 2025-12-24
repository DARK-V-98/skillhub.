
'use client';
import React, { useState, useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { UserProfile } from '@/lib/types';
import { Loader2, Search, UserSearch } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TeacherCard from '@/components/TeacherCard';
import { useDebounce } from 'use-debounce';
import Header from '@/components/header';
import Footer from '@/components/footer';

const TeachersPage = () => {
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    const teachersQuery = firestore ? query(collection(firestore, 'users'), where('role', '==', 'teacher')) : null;
    const { data: teachers, loading } = useCollection<UserProfile>(teachersQuery);

    const filteredTeachers = useMemo(() => {
        if (!teachers) return [];
        if (!debouncedSearchTerm) return teachers;
        return teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [teachers, debouncedSearchTerm]);


    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <div className="bg-secondary/50 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                           <UserSearch className="h-10 w-10 text-primary" /> Find an Instructor
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                            Search our directory of expert instructors to find the perfect match for your learning goals.
                        </p>
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by instructor name..."
                                className="pl-10 h-12 text-base"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {loading ? (
                        <div className="flex justify-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredTeachers.map(teacher => (
                                <TeacherCard key={teacher.id} teacher={teacher} />
                            ))}
                        </div>
                    )}
                    {!loading && filteredTeachers.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h3 className="text-xl font-semibold">No instructors found.</h3>
                            <p className="text-muted-foreground mt-2">
                                Try adjusting your search term.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TeachersPage;
