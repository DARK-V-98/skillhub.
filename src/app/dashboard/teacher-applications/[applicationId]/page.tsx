'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { teacherRegistrationSchema, UserProfile } from '@/lib/types';
import { Loader2, ArrowLeft, Check, X, Mail, Phone, Calendar as CalendarIcon, MapPin, Clock, Languages, User as UserIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { format } from 'date-fns';

type ApplicationData = z.infer<typeof teacherRegistrationSchema> & {
    id: string;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected';
    submittedAt: any;
    userId: string;
};

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500' },
    reviewing: { label: 'Under Review', color: 'bg-blue-500' },
    approved: { label: 'Approved', color: 'bg-green-500' },
    rejected: { label: 'Rejected', color: 'bg-destructive' },
};


export default function ApplicationDetailPage() {
  const params = useParams();
  const applicationId = params.applicationId as string;
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  const applicationRef = firestore ? doc(firestore, 'teacherApplications', applicationId) : null;
  const { data: application, loading } = useDoc<ApplicationData>(applicationRef);

  useEffect(() => {
    if (application && application.status === 'pending' && firestore) {
      const appRef = doc(firestore, 'teacherApplications', application.id);
      updateDoc(appRef, { status: 'reviewing' });
    }
  }, [application, firestore]);

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    if (!firestore || !application) return;

    setIsUpdating(true);
    const appRef = doc(firestore, 'teacherApplications', application.id);
    const userRef = doc(firestore, 'users', application.userId);
    try {
        await updateDoc(appRef, { status: newStatus });
        if (newStatus === 'approved') {
            await updateDoc(userRef, { role: 'teacher' });
        }
        toast({
            title: 'Status Updated',
            description: `Application has been ${newStatus}.`,
        });
    } catch (error) {
        console.error("Error updating status:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
    } finally {
        setIsUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive">Application Not Found</h2>
      </div>
    );
  }

  const currentStatus = statusConfig[application.status];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <Button variant="ghost" className="mb-4" asChild>
                <Link href="/dashboard/teacher-applications">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applications
                </Link>
            </Button>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{application.fullName}</h1>
                    <p className="text-muted-foreground">{application.email}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={`${currentStatus.color} text-white`}>{currentStatus.label}</Badge>
                </div>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Application Review</CardTitle>
                <CardDescription>Review the details below and take action.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-end gap-4">
                 <Button variant="outline" onClick={() => handleStatusUpdate('rejected')} disabled={isUpdating || application.status === 'rejected'}>
                     {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <X className="mr-2 h-4 w-4"/>}
                    Reject
                 </Button>
                 <Button onClick={() => handleStatusUpdate('approved')} disabled={isUpdating || application.status === 'approved'}>
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4"/>}
                    Approve
                 </Button>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Professional Background</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold">{application.headline}</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{application.bio}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Areas of Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                                {application.areasOfExpertise.map(area => (
                                    <Badge key={area} variant="secondary">{area}</Badge>
                                ))}
                            </div>
                        </div>
                        {(application.linkedinUrl || application.websiteUrl) && (
                            <div className="space-y-2 pt-2">
                                {application.linkedinUrl && (
                                    <a href={application.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-500 hover:underline">
                                        <LinkIcon className="h-4 w-4" /> LinkedIn Profile
                                    </a>
                                )}
                                {application.websiteUrl && (
                                    <a href={application.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-500 hover:underline">
                                        <LinkIcon className="h-4 w-4" /> Website/Portfolio
                                    </a>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-start gap-3"><UserIcon className="h-4 w-4 mt-0.5 text-muted-foreground"/> <div><span className="font-semibold">Name:</span> {application.fullName}</div></div>
                        <div className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5 text-muted-foreground"/> <div><span className="font-semibold">Email:</span> {application.email}</div></div>
                        <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 text-muted-foreground"/> <div><span className="font-semibold">Phone:</span> {application.phone}</div></div>
                        <div className="flex items-start gap-3"><CalendarIcon className="h-4 w-4 mt-0.5 text-muted-foreground"/> <div><span className="font-semibold">DOB:</span> {application.dateOfBirth}</div></div>
                        <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-muted-foreground"/> <div><span className="font-semibold">Country:</span> {application.country}</div></div>
                        <div className="flex items-start gap-3"><Clock className="h-4 w-4 mt-0.5 text-muted-foreground"/> <div><span className="font-semibold">Timezone:</span> {application.timezone}</div></div>
                        <div className="flex items-start gap-3"><Languages className="h-4 w-4 mt-0.5 text-muted-foreground"/> <div><span className="font-semibold">Languages:</span> {application.preferredLanguage.join(', ')}</div></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
