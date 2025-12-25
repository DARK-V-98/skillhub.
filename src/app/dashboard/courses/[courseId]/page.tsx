
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Course } from '@/lib/types';
import { Loader2, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlayCircle } from 'lucide-react';
import CourseChat from '@/components/CourseChat';

export default function StudentCoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const firestore = useFirestore();
  
  const courseRef = firestore && courseId ? doc(firestore, 'courses', courseId) : null;
  const { data: course, loading: courseLoading } = useDoc<Course>(courseRef);

  if (courseLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive">Course Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The course you are looking for does not exist.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
        <div>
            <Button variant="ghost" className="mb-4" asChild>
                <Link href="/dashboard/my-courses"><ArrowLeft className="h-4 w-4 mr-2" /> Back to My Courses</Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                {course.title}
            </h1>
            <p className="text-muted-foreground mt-1 max-w-3xl">
                {course.description}
            </p>
        </div>

        <Tabs defaultValue="curriculum" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="chat">Group Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="curriculum" className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                    {course.modules?.map((module, index) => (
                        <AccordionItem value={`item-${index}`} key={module.id}>
                            <AccordionTrigger className="font-semibold text-lg">{module.title}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-3 pl-4">
                                {module.lessons?.map(lesson => (
                                    <li key={lesson.id} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                                        <PlayCircle className="h-5 w-5 text-primary" />
                                        <span>{lesson.title}</span>
                                    </li>
                                ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                {!course.modules && (
                    <p className="text-center text-muted-foreground py-8">No curriculum has been added for this course yet.</p>
                )}
            </TabsContent>
            <TabsContent value="chat" className="mt-6">
                <div className="h-[70vh] rounded-lg border overflow-hidden">
                    <CourseChat course={course} />
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
