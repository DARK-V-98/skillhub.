import React, { useState, useEffect } from 'react';
import { RoleProvider, useRole } from '@/contexts/RoleContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AccessibilityPanel from '@/components/AccessibilityPanel';
import AccessibilityBanner from '@/components/AccessibilityBanner';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import SponsorDashboard from '@/components/dashboards/SponsorDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { cn } from '@/lib/utils';

const DashboardContent: React.FC = () => {
  const { currentRole } = useRole();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderDashboard = () => {
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
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <AccessibilityBanner />
      
      <Navbar
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />
      
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activePage={activePage}
        onNavigate={setActivePage}
      />
      
      <main
        id="main-content"
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
        style={{ marginTop: '48px' }}
      >
        <div className="p-4 lg:p-8">
          {renderDashboard()}
        </div>
      </main>
      
      <AccessibilityPanel />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AccessibilityProvider>
      <RoleProvider>
        <DashboardContent />
      </RoleProvider>
    </AccessibilityProvider>
  );
};

export default Index;
