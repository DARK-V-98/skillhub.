
'use client';
import React from 'react';
import AchievementCard from '@/components/AchievementCard';
import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Achievement } from '@/lib/types';
import { Loader2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AchievementsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const achievementsQuery = user && firestore 
    ? query(collection(firestore, 'users', user.uid, 'achievements'), orderBy('earnedAt', 'desc')) 
    : null;
  const { data: achievements, loading: achievementsLoading } = useCollection<Achievement>(achievementsQuery);

  const isLoading = userLoading || achievementsLoading;

  const handleDownload = (title: string) => {
    toast({
        title: 'Downloading Certificate',
        description: `Your certificate for "${title}" will be downloaded shortly.`,
    });
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            My Achievements
          </h1>
          <p className="text-muted-foreground mt-1">
            All your hard-earned badges and certificates in one place.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {achievements && achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onDownload={() => handleDownload(achievement.title)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Achievements Yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep learning to earn your first badge or certificate!
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
