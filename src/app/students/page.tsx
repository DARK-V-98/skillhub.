
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Loader2, BookHeart, Accessibility } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StudentForm from '@/components/StudentForm';


export default function StudentsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/students');
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
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Choose Your Path</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Select a package that best fits your needs to start your learning journey.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="flex flex-col card-hover">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <BookHeart className="h-8 w-8 text-primary"/>
                        Standard Package
                    </CardTitle>
                    <CardDescription>
                        Access our full library of courses and features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                    <p className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500"/> Unlimited course access</p>
                    <p className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500"/> Live virtual classrooms</p>
                    <p className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500"/> Community forum access</p>
                    <p className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500"/> Verified certificates</p>
                </CardContent>
                <CardFooter>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full">Continue with Standard</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Student Registration</DialogTitle>
                                <DialogDescription>
                                    Please fill in your details to continue.
                                </DialogDescription>
                            </DialogHeader>
                            <StudentForm />
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>

             <Card className="flex flex-col card-hover border-2 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Accessibility className="h-8 w-8 text-primary"/>
                        Disability Inclusion Scholarship
                    </CardTitle>
                    <CardDescription>
                        100% free access for all differently-abled students.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                    <p className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500"/> All standard features</p>
                    <p className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500"/> Priority support</p>
                    <p className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500"/> Additional accessibility tools</p>
                    <p className="text-sm text-muted-foreground mt-4">We are committed to making education accessible to everyone.</p>
                </CardContent>
                <CardFooter>
                    <Button variant="secondary" className="w-full">Apply for Scholarship</Button>
                </CardFooter>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
