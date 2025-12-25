
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import MultiStepForm from '@/components/teacher-registration/MultiStepForm';

export default function TeacherRegistrationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Become a SkillHub Instructor</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Share your expertise with a global audience. We're excited to have you on board.
                </p>
            </div>
            <MultiStepForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
