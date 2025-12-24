'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AccessibilityBanner from '@/components/AccessibilityBanner';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Logo from '@/components/Logo';


const DashboardLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDark);
      if(window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
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


  const handleNavigate = (path: string) => {
    setIsMobileSidebarOpen(false);
    router.push(path);
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 top-4 left-4 bg-background p-2 rounded-md">
        Skip to main content
      </a>
      
      <Navbar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />

      <div className={cn("fixed top-16 z-30 w-full transition-all duration-300", 
        !sidebarCollapsed ? 'lg:pl-64' : 'lg:pl-16'
      )}>
        <AccessibilityBanner />
      </div>
      
      <div className="lg:hidden">
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64 bg-sidebar">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-sidebar-border">
                <Logo size="md" />
              </div>
              <Sidebar
                collapsed={false}
                onToggle={() => {}}
                onNavigate={handleNavigate}
                isMobile={true}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      <main
        id="main-content"
        className={cn(
          'min-h-screen transition-all duration-300',
          'pt-32', // header + banner
          !sidebarCollapsed ? 'lg:pl-64' : 'lg:pl-16'
        )}
      >
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
