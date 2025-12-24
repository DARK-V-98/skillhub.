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
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(3, 'Room name must be at least 3 characters long.'),
  description: z.string().optional(),
});

interface CreateStudyRoomFormProps {
  onSuccess?: () => void;
}

export default function CreateStudyRoomForm({ onSuccess }: CreateStudyRoomFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create a room.',
      });
      return;
    }

    try {
      const docRef = await addDoc(collection(firestore, 'studyRooms'), {
        ...values,
        createdBy: user.uid,
        creatorName: user.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
        participantCount: 0,
      });

      toast({
        title: 'Success!',
        description: 'Your study room has been created.',
      });
      form.reset();
      onSuccess?.();
      router.push(`/dashboard/study-rooms/${docRef.id}`);

    } catch (error) {
      console.error('Error creating study room:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an issue creating your room. Please try again.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., React Advanced Study Group" {...field} />
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What will you be studying in this room?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Creating Room...' : 'Create and Join Room'}
        </Button>
      </form>
    </Form>
  );
}
