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
import { collection, addDoc } from 'firebase/firestore';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  category: z.string().min(3, 'Category is required.'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  duration: z.string().min(3, 'Duration is required (e.g., "8 hours").'),
  thumbnail: z.string().url('Please enter a valid image URL.'),
});

export default function CreateCoursePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      level: 'Beginner',
      price: 0,
      duration: '',
      thumbnail: 'https://picsum.photos/seed/course-placeholder/600/400',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof courseSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create a course.',
      });
      return;
    }

    try {
      await addDoc(collection(firestore, 'courses'), {
        ...values,
        instructor: user.displayName || 'Unnamed Instructor',
        instructorId: user.uid,
        instructorAvatar: user.photoURL || '',
        rating: 0,
        students: [], // Initialize students as an empty array
        progress: {}, // Initialize progress as an empty object
        lessonsCount: 0,
      });

      toast({
        title: 'Success!',
        description: 'Your course has been created.',
      });
      router.push('/dashboard/my-courses');
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an issue creating your course. Please try again.',
      });
    }
  }

  return (
    <>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <PlusCircle className="h-8 w-8 text-primary" />
                Create New Course
            </h1>
            <p className="text-muted-foreground mt-1">
                Fill out the details below to add a new course to the platform.
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
                {isSubmitting ? 'Creating Course...' : 'Create Course'}
            </Button>
            </form>
        </Form>
    </>
  );
}
