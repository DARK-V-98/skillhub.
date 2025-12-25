
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Loader2 } from 'lucide-react';
import SponsorForm from '@/components/SponsorForm';

export default function SponsorsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/sponsors');
    }
  }, [user, loading, router]);

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
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold">Become a Sponsor</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Make an impact by funding scholarships and empowering the next generation of talent. Fill out the form below to get in touch with our partnerships team.
          </p>
        </div>
        <div className="max-w-xl mx-auto mt-12">
            <SponsorForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
