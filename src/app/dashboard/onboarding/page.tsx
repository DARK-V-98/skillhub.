
'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StudentForm from '@/components/StudentForm';
import TeacherForm from '@/components/TeacherForm';
import SponsorForm from '@/components/SponsorForm';

const OnboardingPage = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold">Welcome to SkillHub!</h1>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                To get started, please select the role that best describes you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="overflow-hidden card-hover">
                <Image src="https://picsum.photos/seed/students/600/400" alt="Students learning" width={600} height={400} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">For Students</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Live, Interactive Sessions</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Personalized Learning Paths</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Peer-to-Peer Collaboration</li>
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-6 w-full">Explore Courses</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Start Your Learning Journey</DialogTitle>
                        <DialogDescription>Sign up to explore our wide range of courses.</DialogDescription>
                      </DialogHeader>
                      <StudentForm />
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
              <Card className="overflow-hidden card-hover">
                <Image src="https://picsum.photos/seed/teacher/600/400" alt="Teacher presenting" width={600} height={400} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">For Teachers</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Content Monetization</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Powerful Authoring Tools</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Audience Engagement Analytics</li>
                  </ul>
                   <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-6 w-full">Become A Teacher</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Become a Teacher</DialogTitle>
                        <DialogDescription>Share your knowledge and start earning today.</DialogDescription>
                      </DialogHeader>
                      <TeacherForm />
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
              <Card className="overflow-hidden card-hover">
                <Image src="https://picsum.photos/seed/sponsors/600/400" alt="Business meeting" width={600} height={400} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">For Sponsors</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Fund Scholarships</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Brand Visibility</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" />Impact Reporting</li>
                  </ul>
                   <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-6 w-full">Become a Sponsor</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Become a Sponsor</DialogTitle>
                        <DialogDescription>Make an impact and empower the next generation of learners.</DialogDescription>
                      </DialogHeader>
                      <SponsorForm />
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            </div>
        </div>
    );
};

export default OnboardingPage;
