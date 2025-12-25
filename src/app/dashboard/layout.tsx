
'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardNav, { studentNav, teacherNav, sponsorNav, adminNav, NavItem } from '@/components/DashboardNav';
import Footer from '@/components/footer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';


const DashboardLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();
  const { currentRole } = useRole();
  const pathname = usePathname();

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
  
  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'teacher': return teacherNav;
      case 'sponsor': return sponsorNav;
      case 'admin':
      case 'developer': return adminNav;
      default: return studentNav;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 top-4 left-4 bg-background p-2 rounded-md">
        Skip to main content
      </a>
      
      <Navbar
        isMobileSidebarOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72">
           <nav className="flex flex-col gap-1 p-4 pt-20">
                {navItems.map((item) => (
                <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors',
                    pathname.startsWith(item.href) && (pathname.length === item.href.length || pathname.startsWith(item.href + '/'))
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </Link>
                ))}
            </nav>
        </SheetContent>
      </Sheet>
      
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
