'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { LiveClass } from '@/lib/types';
import { Loader2, VideoOff } from 'lucide-react';
import DashboardLayout from '../../layout';
import LiveClassroom from '@/components/LiveClassroom';

const LiveClassPage = () => {
  const params = useParams();
  const classId = params.classId as string;
  const firestore = useFirestore();

  const classRef = firestore ? doc(firestore, 'liveClasses', classId) : null;
  const { data: liveClass, loading: classLoading, error: classError } = useDoc<LiveClass>(classRef);

  if (classLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (classError || !liveClass) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive">Live Class Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The class you are looking for does not exist or has ended.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-0">
        <LiveClassroom liveClass={liveClass} />
      </div>
    </DashboardLayout>
  );
};

export default LiveClassPage;
