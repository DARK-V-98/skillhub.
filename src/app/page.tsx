
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, BarChart, Heart, Video, PenTool, TrendingUp, BookOpen, Shield, GraduationCap, Code } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StudentForm from '@/components/StudentForm';
import TeacherForm from '@/components/TeacherForm';
import SponsorForm from '@/components/SponsorForm';

const features = [
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: 'Live Virtual Classroom',
    description: 'Engage with expert instructors in real-time and collaborate with peers.',
  },
  {
    icon: <PenTool className="h-8 w-8 text-primary" />,
    title: 'Content Monetization',
    description: 'Share your expertise and build a sustainable income stream.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: 'Verified Credentials',
    description: 'Earn industry-recognized certificates to boost your career profile.',
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: 'Accessible by Default',
    description: 'Our platform is built with inclusivity at its core, supporting all learners.',
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    title: 'Corporate Sponsorship',
    description: 'Empower your team with tailored learning programs and scholarships.',
  },
  {
    icon: <Code className="h-8 w-8 text-primary" />,
    title: 'Developer Portal',
    description: 'Integrate and extend SkillHub with our powerful developer APIs.',
  },
];

const accessibilityFeatures = {
  visual: [
    'Screen reader optimization',
    'High contrast modes',
    'Dyslexia-friendly fonts',
    'Adjustable font sizes (16-32px)',
    'Color blind safe palette',
  ],
  hearing: [
    'Mandatory captions',
    'Sign language interpretation',
    'Visual notifications',
    'Transcript-only mode',
    'Audio description tracks',
  ],
  motor: [
    'Keyboard-only navigation',
    'Voice control support',
    'Larger click targets (44px+)',
    'Extended timeout periods',
    'No drag-and-drop required',
  ],
  cognitive: [
    'Simplified UI mode',
    'Distraction-free reading',
    'Content summarization',
    'Dictionary tooltips',
    'Clear confirmation dialogs',
  ],
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="#courses" className="transition-colors hover:text-primary">
              Courses
            </Link>
            <Link href="#live" className="transition-colors hover:text-primary">
              Live
            </Link>
            <Link href="#sponsorship" className="transition-colors hover:text-primary">
              Sponsorship
            </Link>
            <Link href="#contact" className="transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-secondary/50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gradient mb-6">
              Empowering Education for Everyone
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
              Bridge education gaps with our AI-powered, live teaching tools. Launch your own courses, engage with a global community, and unlock new opportunities.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline">
                <Video className="mr-2 h-5 w-5" />
                Watch Video
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-4xl font-bold text-primary">10K+</p>
                <p className="text-muted-foreground">Active Students</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold text-primary">500+</p>
                <p className="text-muted-foreground">Expert Instructors</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold text-primary">100%</p>
                <p className="text-muted-foreground">Success Rate</p>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-bold text-primary">24/7</p>
                <p className="text-muted-foreground">Live Support</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Learn & Teach</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                A comprehensive platform designed with the best tools and features to help you succeed, whatever your role.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 card-hover">
                  <div className="mb-4 inline-block bg-primary/10 p-4 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Built for Every Role</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                Whether you’re learning, teaching, or sponsoring, we’ve got you covered.
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
        </section>
        
        {/* Accessibility Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="prose lg:prose-lg dark:prose-invert">
              <h2 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-gradient">Accessibility First, Always</span></h2>
              <p className="text-muted-foreground">
                Every student deserves equal access to education. Our platform is built from the ground up with comprehensive accessibility features that empower all individuals to thrive.
              </p>
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-2">100% Free for All Differently-Abled Students</h3>
                <p className="text-muted-foreground">
                  We are committed to removing barriers. Contact us to learn more about our scholarship programs.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 text-lg">Visual</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {accessibilityFeatures.visual.map(item => <li key={item} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> {item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-lg">Hearing</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {accessibilityFeatures.hearing.map(item => <li key={item} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> {item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-lg">Motor</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {accessibilityFeatures.motor.map(item => <li key={item} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> {item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-lg">Cognitive</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {accessibilityFeatures.cognitive.map(item => <li key={item} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> {item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning Journey?</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
              Whether you’re starting a new career path or advancing your skills, we have the right course for you.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline">
                Explore a Tour
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <Logo size="md" />
              <p className="mt-4 text-muted-foreground max-w-xs">
                Empowering learners and educators worldwide with accessible, quality education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#courses" className="hover:text-primary">Courses</Link></li>
                <li><Link href="#live" className="hover:text-primary">Live Sessions</Link></li>
                <li><Link href="#community" className="hover:text-primary">Community</Link></li>
                <li><Link href="#sponsorship" className="hover:text-primary">Sponsorship</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="#careers" className="hover:text-primary">Careers</Link></li>
                <li><Link href="#contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#blog" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#help" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="#terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} SkillHub. All rights reserved. Developed by esystemlk.
          </div>
        </div>
      </footer>
    </div>
  );
}
