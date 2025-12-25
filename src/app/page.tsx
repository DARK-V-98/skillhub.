
'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Video, PenTool, TrendingUp, Shield, GraduationCap, Code, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Course } from '@/lib/types';
import CourseCard from '@/components/CourseCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  visual: ['Screen reader optimization', 'High contrast modes', 'Dyslexia-friendly fonts', 'Adjustable font sizes', 'Color blind safe palette'],
  hearing: ['Mandatory captions', 'Sign language interpretation', 'Visual notifications', 'Transcript-only mode'],
  motor: ['Keyboard-only navigation', 'Voice control support', 'Larger click targets (44px+)', 'No drag-and-drop required'],
  cognitive: ['Simplified UI mode', 'Distraction-free reading', 'Content summarization', 'Clear confirmation dialogs'],
};

const testimonials = [
    {
      quote: "SkillHub එකෙන් මම ඉගෙනගත්ත දේවල් හරිම වටිනවා. Live class නිසා හැමදේම පැහැදිලිව තේරුම්ගන්න පුළුවන් වුණා. Community එකත් ගොඩක් උදව් කළා. මට දැන් අලුත් රස්සාවක් තියෙනවා!",
      name: "Nimali Perera",
      role: "Student",
      avatar: "https://i.pravatar.cc/150?u=nimali",
    },
    {
      quote: "As an instructor, SkillHub gives me the tools I need to create high-quality content and connect with students globally. The monetization options are a fantastic bonus.",
      name: "Dr. Anura Silva",
      role: "Instructor",
      avatar: "https://i.pravatar.cc/150?u=anura",
    },
    {
      quote: "Our company's sponsorship through SkillHub has been a rewarding experience. We're directly impacting students' lives while also discovering incredible new talent for our team.",
      name: "Ravi Fernando",
      role: "Sponsor, Innovate Lanka",
      avatar: "https://i.pravatar.cc/150?u=ravi",
    },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  viewport: { once: true, amount: 0.2 }
};

const stagger = {
    whileInView: {
        transition: {
            staggerChildren: 0.1,
        },
    },
    viewport: { once: true, amount: 0.2 }
};


export default function HomePage() {
  const firestore = useFirestore();
  const featuredCoursesQuery = firestore ? query(collection(firestore, 'courses'), orderBy('rating', 'desc'), limit(6)) : null;
  const { data: featuredCourses } = useCollection<Course>(featuredCoursesQuery);
  const heroText = "Empowering Education for Everyone";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section 
          className="py-20 md:py-32 bg-secondary/50"
          initial="hidden"
          animate="visible"
        >
          <div className="container mx-auto px-4 text-center">
             <div className="typewriter inline-block">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gradient mb-6">
                    {heroText}
                </h1>
            </div>
            <motion.p 
              className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4, duration: 0.5 }}
            >
              Bridge education gaps with our AI-powered, live teaching tools. Launch your own courses, engage with a global community, and unlock new opportunities.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.2, duration: 0.5 }}
            >
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline">
                <Video className="mr-2 h-5 w-5" />
                Watch Video
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="py-12 bg-background"
          initial="initial"
          whileInView="whileInView"
          viewport={fadeInUp.viewport}
          variants={stagger}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[{val: "10K+", desc: "Active Students"}, {val: "500+", desc: "Expert Instructors"}, {val: "100%", desc: "Success Rate"}, {val: "24/7", desc: "Live Support"}].map((stat, i) => (
                <motion.div key={i} className="space-y-1" variants={fadeInUp}>
                  <p className="text-4xl font-bold text-primary">{stat.val}</p>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        
        {/* Featured Courses Section */}
        {featuredCourses && featuredCourses.length > 0 && (
          <motion.section 
            id="courses"
            className="py-20"
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
            variants={stagger}
          >
            <div className="container mx-auto px-4">
              <motion.div className="text-center mb-12" variants={fadeInUp}>
                <h2 className="text-3xl md:text-4xl font-bold">Featured Courses</h2>
                <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                  Explore our most popular courses and start learning a new skill today.
                </p>
              </motion.div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {featuredCourses.map((course) => (
                    <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                        <CourseCard course={course} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          </motion.section>
        )}

        {/* Features Section */}
        <motion.section 
          id="features" 
          className="py-20 bg-secondary/50"
          initial="initial"
          whileInView="whileInView"
          viewport={fadeInUp.viewport}
          variants={stagger}
        >
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Learn & Teach</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                A comprehensive platform designed with the best tools and features to help you succeed, whatever your role.
              </p>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={stagger}>
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp} whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                  <Card className="text-center p-6 h-full border-transparent bg-background/50 shadow-lg hover:shadow-primary/20 transition-shadow">
                    <div className="mb-4 inline-block bg-primary/10 p-4 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
        
        {/* Testimonials Section */}
        <motion.section 
          className="py-20"
          initial="initial"
          whileInView="whileInView"
          viewport={fadeInUp.viewport}
          variants={stagger}
        >
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold">What Our Community is Saying</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                We're proud to have helped thousands of learners and instructors achieve their goals.
              </p>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={stagger}>
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={fadeInUp} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <Card className="p-6 h-full flex flex-col justify-between">
                    <div className="flex-grow">
                      <div className="flex text-yellow-400 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                    </div>
                    <div className="flex items-center mt-6">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Roles Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial="initial"
              whileInView="whileInView"
              viewport={fadeInUp.viewport}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold">Built for Every Role</h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                Whether you’re learning, teaching, or sponsoring, we’ve got you covered.
              </p>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="whileInView"
              viewport={fadeInUp.viewport}
              variants={stagger}
            >
              {[
                { title: "For Students", img: "/st.png", list: ["Live, Interactive Sessions", "Personalized Learning Paths", "Peer-to-Peer Collaboration"], btn: "Explore Courses", href: "/students" },
                { title: "For Teachers", img: "/te.png", list: ["Content Monetization", "Powerful Authoring Tools", "Audience Engagement Analytics"], btn: "Become A Teacher", href: "/teachers" },
                { title: "For Sponsors", img: "/sp.png", list: ["Fund Scholarships", "Brand Visibility", "Impact Reporting"], btn: "Become a Sponsor", href: "/sponsors" }
              ].map((role, i) => (
                <motion.div key={i} variants={fadeInUp} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <Card className="overflow-hidden card-hover h-full flex flex-col">
                    <div className="relative w-full h-48">
                      <Image src={role.img} alt={role.title} fill className="object-cover" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-semibold mb-4">{role.title}</h3>
                      <ul className="space-y-2 text-muted-foreground flex-grow">
                        {role.list.map((item, j) => (
                          <li key={j} className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> {item}</li>
                        ))}
                      </ul>
                      <Button variant="outline" className="mt-6 w-full" asChild>
                        <Link href={role.href}>{role.btn}</Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Accessibility Section */}
        <section className="py-20">
          <motion.div 
            className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center"
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
            variants={stagger}
          >
            <motion.div className="prose lg:prose-lg dark:prose-invert max-w-full" variants={fadeInUp}>
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
            </motion.div>
            <motion.div className="grid grid-cols-2 gap-8" variants={stagger}>
              {Object.entries(accessibilityFeatures).map(([key, value]) => (
                <motion.div key={key} variants={fadeInUp}>
                  <h4 className="font-semibold mb-3 text-lg capitalize">{key}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {value.map(item => <li key={item} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-1 text-emerald-500 shrink-0" /> {item}</li>)}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-secondary/50">
          <motion.div 
            className="container mx-auto px-4 text-center"
            initial="initial"
            whileInView="whileInView"
            viewport={fadeInUp.viewport}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning Journey?</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
              Whether you’re starting a new career path or advancing your skills, we have the right course for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline">
                Explore a Tour
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
