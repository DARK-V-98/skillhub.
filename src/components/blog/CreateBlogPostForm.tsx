
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { BlogPost } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(100, 'Content must be at least 100 characters long.'),
  coverImage: z.string().url('Please provide a valid image URL.').optional().or(z.literal('')),
});

interface CreateBlogPostFormProps {
  onSuccess?: () => void;
  postToEdit?: BlogPost | null;
}

export default function CreateBlogPostForm({ onSuccess, postToEdit }: CreateBlogPostFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      coverImage: '',
    },
  });

  useEffect(() => {
    if (postToEdit) {
      form.reset({
        title: postToEdit.title,
        content: postToEdit.content,
        coverImage: postToEdit.coverImage,
      });
    } else {
        form.reset({
            title: '',
            content: '',
            coverImage: '',
        })
    }
  }, [postToEdit, form]);

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to manage posts.',
      });
      return;
    }

    try {
      if (postToEdit) {
        // Update existing post
        const postRef = doc(firestore, 'blogPosts', postToEdit.id);
        await updateDoc(postRef, {
            ...values,
            updatedAt: serverTimestamp(),
        });
        toast({ title: 'Success!', description: 'Your post has been updated.' });
      } else {
        // Create new post
        await addDoc(collection(firestore, 'blogPosts'), {
          ...values,
          authorId: user.uid,
          authorName: user.displayName || 'Admin',
          authorAvatar: user.photoURL || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          likes: [],
          commentCount: 0,
        });
        toast({ title: 'Success!', description: 'Your post has been published.' });
      }
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `There was an issue ${postToEdit ? 'updating' : 'publishing'} your post.`,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input placeholder="Your Awesome Blog Post Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Content (Markdown supported)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Start writing your amazing content here..."
                  className="min-h-[250px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Saving...' : (postToEdit ? 'Save Changes' : 'Publish Post')}
        </Button>
      </form>
    </Form>
  );
}
