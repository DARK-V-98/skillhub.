
'use client';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase/provider';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { courses, liveClasses, achievements, scholarships } from '@/lib/seedData';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SeedPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const seedDatabase = async () => {
    if (!firestore) return;
    setIsLoading(true);

    try {
      const batch = writeBatch(firestore);

      // Seed Courses
      const coursesCollection = collection(firestore, 'courses');
      courses.forEach(courseData => {
        const docRef = doc(coursesCollection);
        batch.set(docRef, courseData);
      });

      // Seed Live Classes
      const liveClassesCollection = collection(firestore, 'liveClasses');
      liveClasses.forEach(classData => {
        const docRef = doc(liveClassesCollection);
        batch.set(docRef, classData);
      });

      // Seed Scholarships
      const scholarshipsCollection = collection(firestore, 'scholarships');
      scholarships.forEach(scholarshipData => {
        const docRef = doc(scholarshipsCollection);
        batch.set(docRef, scholarshipData);
      });

      // Seed Achievements (for the current user)
      if (user) {
        const achievementsCollection = collection(firestore, `users/${user.uid}/achievements`);
        achievements.forEach(achievementData => {
          const docRef = doc(achievementsCollection);
          batch.set(docRef, achievementData);
        });
      }

      await batch.commit();
      toast({
        title: 'Success!',
        description: 'Database has been seeded with sample data.',
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an issue seeding the database.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Seed Firestore Database</CardTitle>
          <CardDescription>
            Click the button to populate your Firestore database with sample data for courses, classes, and more. This will make the dashboards look populated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={seedDatabase} disabled={isLoading || !user} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? 'Seeding...' : 'Seed Database'}
          </Button>
          {!user && <p className="text-sm text-center text-muted-foreground mt-4">Please log in to seed the database.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
