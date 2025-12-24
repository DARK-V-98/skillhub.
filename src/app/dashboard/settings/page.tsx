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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { doc, setDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, User as UserIcon, MessageSquare } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  avatar: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: {
      name: userProfile?.name || '',
      avatar: userProfile?.avatar || '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user || !userProfileRef) return;

    try {
      // Update Firestore document
      await setDoc(userProfileRef, {
        name: values.name,
        avatar: values.avatar,
      }, { merge: true });

      // Update Firebase Auth profile
      if (user) {
        await updateProfile(user, {
            displayName: values.name,
            photoURL: values.avatar,
        });
      }


      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      });
    }
  }
  
  if (userLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
        <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive">User Profile Not Found</h2>
        <p className="text-muted-foreground mt-2">
            We couldn't find a profile for the current user.
        </p>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Profile & Settings</h1>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="text-3xl">{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <p className="text-sm capitalize mt-1 text-primary font-semibold">{userProfile.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                          <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                          <Input placeholder="https://example.com/your-avatar.png" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <div className="pt-2">
                      <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                  </div>
              </form>
              </Form>
          </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Community Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
            <MessageSquare className="h-8 w-8 text-primary"/>
            <div>
              <p className="text-2xl font-bold">{userProfile.postCount || 0}</p>
              <p className="text-sm text-muted-foreground">Posts Created</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
            <MessageSquare className="h-8 w-8 text-primary"/>
            <div>
              <p className="text-2xl font-bold">{userProfile.commentCount || 0}</p>
              <p className="text-sm text-muted-foreground">Comments Written</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
