'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Video, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/firebase/firestore/use-collection';
import { query, where, orderBy } from 'firebase/firestore';
import { LiveClass } from '@/lib/types';
import LiveClassCard from '@/components/LiveClassCard';
import Link from 'next/link';

export default function TeacherLiveClassesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isCreatingClass, setIsCreatingClass] = React.useState(false);

  const handleStartLiveClass = async () => {
    if (!user || !firestore) return;
    setIsCreatingClass(true);
    try {
      const docRef = await addDoc(collection(firestore, 'liveClasses'), {
        title: `Instant Class by ${user.displayName}`,
        instructor: user.displayName,
        instructorId: user.uid,
        course: 'General Session',
        startTime: serverTimestamp(),
        duration: 60,
        attendees: 0,
        isLive: true,
      });
      toast({ title: 'Live class created!', description: 'Redirecting you to the classroom...' });
      router.push(`/dashboard/live/${docRef.id}`);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not start live class.' });
      setIsCreatingClass(false);
    }
  };
  
  const liveClassesQuery = user ? query(collection(firestore, 'liveClasses'), where('instructorId', '==', user.uid), orderBy('startTime', 'desc')) : null;
  const { data: teacherClasses, loading } = useCollection<LiveClass>(liveClassesQuery);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            Manage Live Classes
          </h1>
          <p className="text-muted-foreground mt-1">
            Start an instant class or manage your scheduled sessions.
          </p>
        </div>
        <div className="flex gap-3">
            <Button onClick={handleStartLiveClass} disabled={isCreatingClass} size="lg">
                {isCreatingClass ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {isCreatingClass ? 'Starting...' : 'Start Instant Class'}
            </Button>
        </div>
      </div>
      
      <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Your Classes</h2>
          {loading ? (
               <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
          ) : (
            <div className="grid gap-6">
              {teacherClasses && teacherClasses.length > 0 ? (
                teacherClasses.map((liveClass) => (
                  <Link key={liveClass.id} href={`/dashboard/live/${liveClass.id}`}>
                    <LiveClassCard liveClass={liveClass} />
                  </Link>
                ))
              ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Classes Found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">You haven't created or been assigned any classes yet.</p>
                </div>
              )}
            </div>
          )}

      </section>
    </>
  );
}
