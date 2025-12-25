'use client';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitTeacherRegistration } from '@/app/actions';
import { teacherRegistrationSchema } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const expertiseOptions = [
    'Web Development', 'Data Science', 'UI/UX Design', 'Marketing', 'Business', 'Photography', 'Music'
];

export default function MultiStepForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [expertiseInput, setExpertiseInput] = React.useState('');

  const methods = useForm<z.infer<typeof teacherRegistrationSchema>>({
    resolver: zodResolver(teacherRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        country: '',
        timezone: '',
        preferredLanguage: [],
        bio: '',
        headline: '',
        areasOfExpertise: [],
        linkedinUrl: '',
        websiteUrl: '',
    }
  });

  const { formState, control } = methods;

  const onSubmit = async (data: z.infer<typeof teacherRegistrationSchema>) => {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to submit an application."});
        return;
    }

    const result = await submitTeacherRegistration(data, user.uid);

    if (result.success) {
      toast({
        title: 'Application Submitted!',
        description: result.message,
      });
      router.push('/register/teacher/status');
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.message,
      });
    }
  };

  const onError = (errors: any) => {
    console.error("Form validation failed:", errors);
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: "Please check all fields and try again.",
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="A. B. C. Perera" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input type="tel" placeholder="+94 77 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="YYYY-MM-DD" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select your country" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                                        <SelectItem value="India">India</SelectItem>
                                        <SelectItem value="Maldives">Maldives</SelectItem>
                                        <SelectItem value="Singapore">Singapore</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="timezone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Timezone</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select your timezone" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="GMT+5.5">Asia/Colombo (GMT+5:30)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <FormField
                    control={control}
                    name="preferredLanguage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred Teaching Language(s)</FormLabel>
                            <Select onValueChange={(value) => field.onChange([value])} defaultValue={field.value?.[0]}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select languages" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Sinhala">Sinhala</SelectItem>
                                    <SelectItem value="Tamil">Tamil</SelectItem>
                                    <SelectItem value="English">English</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>You can select multiple languages in later steps.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Professional Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                    control={control}
                    name="headline"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Professional Headline</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Senior Software Engineer at Google" {...field} />
                        </FormControl>
                        <FormDescription>A short, catchy headline that appears under your name.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="bio"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Biography</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Tell us about your professional journey, your passion for teaching, and what students can expect from your courses."
                            className="min-h-[150px]"
                            {...field}
                        />
                        </FormControl>
                        <FormDescription>A detailed bio helps students connect with you. Minimum 100 characters.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={control}
                    name="areasOfExpertise"
                    defaultValue={[]}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Areas of Expertise</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {field.value.map((expertise: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                                        {expertise}
                                        <button type="button" onClick={() => field.onChange(field.value.filter((e: string) => e !== expertise))} className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                            <X className="h-3 w-3"/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Add an expertise area"
                                    value={expertiseInput}
                                    onChange={(e) => setExpertiseInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && expertiseInput.trim()) {
                                            e.preventDefault();
                                            if (!field.value.includes(expertiseInput.trim())) {
                                                field.onChange([...field.value, expertiseInput.trim()]);
                                            }
                                            setExpertiseInput('');
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (expertiseInput.trim() && !field.value.includes(expertiseInput.trim())) {
                                            field.onChange([...field.value, expertiseInput.trim()]);
                                        }
                                        setExpertiseInput('');
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {expertiseOptions.filter(opt => !field.value.includes(opt)).map(opt => (
                                    <button 
                                        key={opt}
                                        type="button" 
                                        onClick={() => field.onChange([...field.value, opt])}
                                        className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full hover:bg-primary/20"
                                    >
                                        + {opt}
                                    </button>
                                ))}
                            </div>
                            <FormDescription>List your skills and subjects you can teach.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={control}
                    name="linkedinUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>LinkedIn Profile URL (Optional)</FormLabel>
                        <FormControl>
                            <Input type="url" placeholder="https://www.linkedin.com/in/..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={control}
                    name="websiteUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Website or Portfolio URL (Optional)</FormLabel>
                        <FormControl>
                            <Input type="url" placeholder="https://yourportfolio.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-end pt-8 mt-8 border-t">
          <Button type="submit" disabled={formState.isSubmitting} size="lg">
            {formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
