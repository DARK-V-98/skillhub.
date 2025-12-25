
'use client';
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Loader2, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TeacherApplication {
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  submittedAt: any;
  // ... other application fields
}

const statusConfig = {
  pending: {
    icon: Clock,
    title: 'Application Submitted',
    description: "We've received your application. It will be reviewed by our team shortly.",
    color: 'text-blue-500',
    step: 1,
  },
  reviewing: {
    icon: FileText,
    title: 'Under Review',
    description: "Our team is currently reviewing your qualifications and application details. This usually takes 3-5 business days.",
    color: 'text-amber-500',
    step: 2,
  },
  approved: {
    icon: CheckCircle,
    title: 'Congratulations! You\'re Approved!',
    description: "Welcome to the team! You can now access your teacher dashboard and start creating courses.",
    color: 'text-green-500',
    step: 3,
  },
  rejected: {
    icon: XCircle,
    title: 'Application Update',
    description: "After careful consideration, we are unable to proceed with your application at this time. We encourage you to gain more experience and reapply in the future.",
    color: 'text-destructive',
    step: 3,
  },
};

const TimelineStep = ({ title, status, isActive, isCompleted }: { title: string, status: string, isActive: boolean, isCompleted: boolean }) => (
    <div className="flex items-center">
        <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full border-2",
            isActive || isCompleted ? 'bg-primary border-primary' : 'bg-muted border-border',
            isCompleted && 'bg-green-500 border-green-500'
        )}>
            {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : <span className={cn(isActive ? 'text-white' : 'text-muted-foreground')}>{status}</span>}
        </div>
        <div className={cn("ml-4 text-sm font-medium", isActive || isCompleted ? "text-foreground" : "text-muted-foreground")}>{title}</div>
    </div>
);


export default function TeacherStatusPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const applicationRef = user ? doc(firestore, 'teacherApplications', user.uid) : null;
  const { data: application, loading: appLoading } = useDoc<TeacherApplication>(applicationRef);

  const loading = userLoading || appLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!application) {
    return (
        <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center text-center">
          <div>
            <h1 className="text-3xl font-bold">No Application Found</h1>
            <p className="text-muted-foreground mt-2">You haven't submitted a teacher application yet.</p>
            <Button asChild className="mt-6">
                <Link href="/register/teacher">Start Your Application</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStatus = statusConfig[application.status] || statusConfig.pending;
  const applicationSteps = [
    { id: 1, title: 'Submitted', status: '1' },
    { id: 2, title: 'In Review', status: '2' },
    { id: 3, title: 'Decision', status: '3' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
                <currentStatus.icon className={cn("w-16 h-16", currentStatus.color)} />
            </div>
            <CardTitle className="text-3xl">{currentStatus.title}</CardTitle>
            <CardDescription className="max-w-md mx-auto pt-2">{currentStatus.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative my-8">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border" />
                <div className="relative flex justify-between">
                    {applicationSteps.map(step => (
                        <div key={step.id} className="flex flex-col items-center bg-secondary/30 px-2">
                             <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold",
                                currentStatus.step > step.id ? 'bg-green-500 border-green-500 text-white' : '',
                                currentStatus.step === step.id ? 'bg-primary border-primary text-white scale-110' : '',
                                currentStatus.step < step.id ? 'bg-muted border-border text-muted-foreground' : ''
                            )}>
                                {currentStatus.step > step.id ? <CheckCircle className="w-5 h-5"/> : step.id}
                            </div>
                            <p className={cn("mt-2 text-xs md:text-sm", currentStatus.step >= step.id ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{step.title}</p>
                        </div>
                    ))}
                </div>
            </div>

             {application.status === 'approved' && (
                <Button asChild size="lg" className="mt-8">
                    <Link href="/dashboard">Go to Your Dashboard</Link>
                </Button>
             )}
              {application.status === 'rejected' && (
                <Button asChild variant="secondary" className="mt-8">
                    <Link href="/contact">Contact Support</Link>
                </Button>
             )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
