
'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Loader2, BookOpen, ArrowLeft, PlusCircle, GripVertical, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Course, Module, Lesson } from '@/lib/types';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  category: z.string().min(3, 'Category is required.'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  duration: z.string().min(3, 'Duration is required (e.g., "8 hours").'),
  thumbnail: z.string().url('Please enter a valid image URL.'),
});

function CourseDetailsForm({ courseId }: { courseId: string }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const courseRef = firestore && courseId ? doc(firestore, 'courses', courseId) : null;
    const { data: course, loading: courseLoading } = useDoc<Course>(courseRef);
  
    const form = useForm<z.infer<typeof courseSchema>>({
      resolver: zodResolver(courseSchema),
    });
  
    React.useEffect(() => {
      if (course) {
        form.reset(course);
      }
    }, [course, form]);
  
    const { isSubmitting } = form.formState;
  
    async function onSubmit(values: z.infer<typeof courseSchema>) {
      if (!user || !firestore || !course) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Authentication error or course not found.',
        });
        return;
      }
  
      if (course.instructorId !== user.uid) {
          toast({
            variant: 'destructive',
            title: 'Permission Denied',
            description: "You don't have permission to edit this course.",
          });
          return;
      }
  
      try {
        await setDoc(doc(firestore, 'courses', courseId), values, { merge: true });
        toast({
          title: 'Success!',
          description: 'Your course has been updated.',
        });
      } catch (error) {
        console.error('Error updating course:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an issue updating your course. Please try again.',
        });
      }
    }

    if (courseLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Introduction to React" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Course Description</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Describe what students will learn in your course."
                        className="min-h-[150px]"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Web Development" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a level" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                        <Input type="number" min="0" step="0.01" placeholder="e.g., 99.99" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Course Duration</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 24 hours" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Thumbnail Image URL</FormLabel>
                    <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormDescription>
                    Use a service like Unsplash or Pexels for placeholder images.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
            </form>
        </Form>
    )
}

function CurriculumBuilder({ courseId, course }: { courseId: string; course: Course }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newLessonTitles, setNewLessonTitles] = useState<{ [key: string]: string }>({});

    const handleAddModule = async () => {
        if (!firestore || !newModuleTitle.trim()) return;
        const courseRef = doc(firestore, 'courses', courseId);
        const newModule: Module = {
            id: new Date().getTime().toString(),
            title: newModuleTitle,
            lessons: [],
        };
        await updateDoc(courseRef, { modules: arrayUnion(newModule) });
        setNewModuleTitle('');
        toast({ title: 'Module added successfully' });
    };

    const handleAddLesson = async (moduleId: string) => {
        if (!firestore || !newLessonTitles[moduleId]?.trim() || !course.modules) return;

        const courseRef = doc(firestore, 'courses', courseId);
        const newLesson: Lesson = {
            id: new Date().getTime().toString(),
            title: newLessonTitles[moduleId],
            type: 'text',
            content: ''
        };

        const updatedModules = course.modules.map(module => {
            if (module.id === moduleId) {
                return { ...module, lessons: [...(module.lessons || []), newLesson] };
            }
            return module;
        });

        await setDoc(courseRef, { modules: updatedModules }, { merge: true });

        setNewLessonTitles(prev => ({ ...prev, [moduleId]: '' }));
        toast({ title: 'Lesson added successfully' });
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!firestore || !course.modules) return;
        const courseRef = doc(firestore, 'courses', courseId);
        const updatedModules = course.modules.filter(m => m.id !== moduleId);
        await updateDoc(courseRef, { modules: updatedModules });
        toast({ title: 'Module deleted successfully' });
    };

    const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
        if (!firestore || !course.modules) return;
        const courseRef = doc(firestore, 'courses', courseId);
        const updatedModules = course.modules.map(module => {
            if (module.id === moduleId) {
                return { ...module, lessons: module.lessons.filter(l => l.id !== lessonId) };
            }
            return module;
        });
        await updateDoc(courseRef, { modules: updatedModules });
        toast({ title: 'Lesson deleted successfully' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Curriculum Builder</CardTitle>
                <CardDescription>
                    Organize your course content into modules and lessons. Drag and drop to reorder.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Accordion type="multiple" className="w-full" defaultValue={course.modules?.map(m => m.id)}>
                    {course.modules?.map(module => (
                        <AccordionItem value={module.id} key={module.id} className="bg-secondary/50 rounded-md border px-4 mb-4">
                            <div className="flex items-center group">
                                <AccordionTrigger className="flex-1 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                        <span className="font-semibold text-lg">{module.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteModule(module.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                            <AccordionContent className="pl-8 pb-4">
                                <div className="space-y-3">
                                    {module.lessons?.map(lesson => (
                                        <div key={lesson.id} className="flex items-center justify-between p-3 bg-background rounded-md border group">
                                            <div className="flex items-center gap-3">
                                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                                <span>{lesson.title}</span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteLesson(module.id, lesson.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2 pt-2">
                                        <Input
                                            placeholder="New Lesson Title"
                                            value={newLessonTitles[module.id] || ''}
                                            onChange={(e) => setNewLessonTitles(prev => ({ ...prev, [module.id]: e.target.value }))}
                                        />
                                        <Button onClick={() => handleAddLesson(module.id)}><PlusCircle className="mr-2 h-4 w-4" /> Add Lesson</Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="mt-6 pt-6 border-t">
                    <div className="flex gap-2">
                        <Input
                            placeholder="New Module Title"
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                        />
                        <Button onClick={handleAddModule} variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Module</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


function CourseSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>Manage publishing status, collaborators, and other advanced options.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-medium">Advanced settings are coming soon.</h3>
                    <p className="text-muted-foreground mt-1 text-sm">Manage course publication, collaborators, and more.</p>
                </div>
            </CardContent>
        </Card>
    );
}


export default function ManageCoursePage() {
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
                Manage: {course.title}
            </h1>
            <p className="text-muted-foreground mt-1">
                Edit details, build your curriculum, and manage settings.
            </p>
        </div>

        <Tabs defaultValue="curriculum" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
                <CourseDetailsForm courseId={courseId} />
            </TabsContent>
            <TabsContent value="curriculum" className="mt-6">
                <CurriculumBuilder courseId={courseId} course={course} />
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
                <CourseSettings />
            </TabsContent>
        </Tabs>
    </div>
  );
}
