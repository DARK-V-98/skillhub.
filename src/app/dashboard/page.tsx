'use client';
import React, { useState, useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AccessibilityBanner from '@/components/AccessibilityBanner';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import SponsorDashboard from '@/components/dashboards/SponsorDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { cn } from '@/lib/utils';
import { useUser, signInWithGoogle } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const DashboardContent: React.FC = () => {
  const { currentRole } = useRole();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const { user, loading } = useUser();

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

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] text-center">
                <h1 className="text-4xl font-bold mb-4 text-gradient">Welcome to SkillHub</h1>
                <p className="mb-8 text-lg text-muted-foreground">Your journey to mastery starts here. Please sign in to continue.</p>
                <Button
                    onClick={signInWithGoogle}
                    size="lg"
                >
                    Sign in with Google
                </Button>
            </div>
        );
    }
    
    switch (currentRole) {
      case 'teacher':
        return <TeacherDashboard />;
      case 'sponsor':
        return <SponsorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 top-4 left-4 bg-background p-2 rounded-md">
        Skip to main content
      </a>
      
      <AccessibilityBanner />
      
      <Navbar
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />
      
      {user && (
        <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            activePage={activePage}
            onNavigate={setActivePage}
        />
      )}
      
      <main
        id="main-content"
        className={cn(
          'pt-28 min-h-screen transition-all duration-300',
          user && !sidebarCollapsed ? 'lg:pl-64' : (user ? 'lg:pl-16' : '')
        )}
      >
        <div className="p-4 lg:p-8">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <DashboardContent />
  );
};

export default DashboardPage;
