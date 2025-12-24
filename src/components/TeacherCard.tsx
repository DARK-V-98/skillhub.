
'use client';
import React from 'react';
import { UserProfile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Course } from '@/lib/types';

interface TeacherCardProps {
    teacher: UserProfile;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
    const firestore = useFirestore();
    const coursesQuery = firestore ? query(collection(firestore, 'courses'), where('instructorId', '==', teacher.id)) : null;
    const { data: courses } = useCollection<Course>(coursesQuery);

    return (
        <Card className="text-center p-6 card-hover">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback className="text-3xl">{teacher.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-bold">{teacher.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{teacher.email}</p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{courses?.length || 0} Courses</span>
            </div>

            <Button asChild variant="outline" className="w-full">
                <Link href={`/teachers/${teacher.id}`}>
                    View Profile <ArrowRight className="h-4 w-4 ml-2"/>
                </Link>
            </Button>
        </Card>
    );
};

export default TeacherCard;
