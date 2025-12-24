'use client';
import React from 'react';
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
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, BookOpen, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Course } from '@/lib/types';
import Link from 'next/link';

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  category: z.string().min(3, 'Category is required.'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  duration: z.string().min(3, 'Duration is required (e.g., "8 hours").'),
  thumbnail: z.string().url('Please enter a valid image URL.'),
});

export default function ManageCoursePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

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
      router.push('/dashboard/my-courses');
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
    <>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
                <Button variant="ghost" className="mb-4" asChild>
                    <Link href="/dashboard/my-courses"><ArrowLeft className="h-4 w-4 mr-2" /> Back to My Courses</Link>
                </Button>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-primary" />
                    Manage Course
                </h1>
                <p className="text-muted-foreground mt-1">
                    Edit the details for your course: {course.title}.
                </p>
            </div>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
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
    </>
  );
}
