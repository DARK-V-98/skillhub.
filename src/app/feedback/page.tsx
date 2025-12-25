
'use client';
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitFeedback } from '@/app/actions';

const feedbackFormSchema = z.object({
    title: z.string().min(5, 'Please provide a meaningful title.'),
    message: z.string().min(10, 'Your feedback message is too short.'),
});

export default function FeedbackPage() {
    const { user, loading } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof feedbackFormSchema>>({
        resolver: zodResolver(feedbackFormSchema),
        defaultValues: {
            title: '',
            message: '',
        },
    });

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/feedback');
        }
    }, [user, loading, router]);

    const onSubmit = async (values: z.infer<typeof feedbackFormSchema>) => {
        if (!user) return;
        
        const result = await submitFeedback({
            ...values,
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            userEmail: user.email || '',
        });

        if (result.success) {
            toast({
                title: 'Feedback Sent!',
                description: result.message,
            });
            form.reset();
        } else {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: result.message,
            });
        }
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-secondary/30">
                <div className="container mx-auto px-4 py-12">
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl flex items-center justify-center gap-3">
                                <MessageSquare className="h-8 w-8 text-primary" />
                                Share Your Feedback
                            </CardTitle>
                            <CardDescription>
                                We value your opinion. Let us know how we can improve SkillHub.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="A brief summary of your feedback" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Feedback</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell us more about your experience, ideas, or issues..."
                                                        className="min-h-[150px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                        Submit Feedback
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
