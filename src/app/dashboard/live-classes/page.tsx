
'use client';
import React from 'react';
import LiveClassCard from '@/components/LiveClassCard';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { LiveClass } from '@/lib/types';
import { Loader2, Video } from 'lucide-react';
import Link from 'next/link';

export default function LiveClassesPage() {
  const firestore = useFirestore();

  const { data: liveClasses, loading } = useCollection<LiveClass>(
    firestore ? query(collection(firestore, 'liveClasses'), orderBy('startTime', 'asc')) : null
  );

  const now = new Date();
  
  const upcomingClasses = liveClasses?.filter(c => new Date(c.startTime) > now) || [];
  const liveNow = liveClasses?.filter(c => {
      const startTime = new Date(c.startTime);
      const endTime = new Date(startTime.getTime() + c.duration * 60000);
      return now >= startTime && now <= endTime;
  }) || [];
  const pastClasses = liveClasses?.filter(c => {
      const startTime = new Date(c.startTime);
      const endTime = new Date(startTime.getTime() + c.duration * 60000);
      return now > endTime;
  }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            Live Classes
          </h1>
          <p className="text-muted-foreground mt-1">
            Join live sessions, workshops, and Q&As.
          </p>
        </div>
      </div>

      {liveNow.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            Live Now
          </h2>
          <div className="grid gap-6">
            {liveNow.map((liveClass) => (
              <Link key={liveClass.id} href={`/dashboard/live/${liveClass.id}`}>
                <LiveClassCard liveClass={liveClass} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {upcomingClasses.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Upcoming</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingClasses.map((liveClass) => (
               <Link key={liveClass.id} href={`/dashboard/live/${liveClass.id}`}>
                  <LiveClassCard liveClass={liveClass} />
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {pastClasses.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Past Classes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {pastClasses.map((liveClass) => (
              <div key={liveClass.id} className="opacity-60">
                  <LiveClassCard liveClass={liveClass} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      {!loading && liveClasses?.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Video className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Live Classes Scheduled</h3>
              <p className="mt-1 text-sm text-muted-foreground">Check back soon for upcoming live sessions.</p>
          </div>
      )}

    </>
  );
}
