'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';
import Footer from '@/components/footer';


const DashboardLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 top-4 left-4 bg-background p-2 rounded-md">
        Skip to main content
      </a>
      
      <Navbar
        isMobileSidebarOpen={false}
        onMobileMenuToggle={() => {}}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />
      
      <main
        id="main-content"
        className={cn('pt-16 flex-grow')}
      >
        <DashboardNav />
        <div className="container mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
