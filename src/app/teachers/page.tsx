
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFirestore } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

export default function TeachersPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const applicationRef = user ? doc(firestore, 'teacherApplications', user.uid) : null;
  const { data: application, loading: appLoading } = useDoc(applicationRef);

  const loading = userLoading || appLoading;

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login?redirect=/teachers');
    }
    if (!appLoading && application) {
        router.push('/register/teacher/status');
    }
  }, [user, userLoading, application, appLoading, router]);

  if (loading || !user || application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome, Future Instructor!</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to share your knowledge? Complete our registration process to start creating courses and earning.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/register/teacher">Start Teacher Registration</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
