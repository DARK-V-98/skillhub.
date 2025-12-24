

'use client';
import React from 'react';
import { 
  Home, 
  BookOpen, 
  Video, 
  Trophy, 
  MessageSquare, 
  Calendar,
  Settings,
  PlusCircle,
  Users,
  BarChart3,
  DollarSign,
  GraduationCap,
  Heart,
  FileText,
  Shield,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onNavigate?: (path: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const studentNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'my-courses', label: 'My Courses', icon: BookOpen, href: '/dashboard/my-courses' },
  { id: 'live-classes', label: 'Live Classes', icon: Video, href: '/dashboard/live-classes' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, href: '/dashboard/achievements' },
  { id: 'community', label: 'Community', icon: MessageSquare, href: '/dashboard/community' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

const teacherNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'create-course', label: 'Create Course', icon: PlusCircle, href: '/dashboard/create-course' },
  { id: 'my-courses', label: 'My Courses', icon: BookOpen, href: '/dashboard/my-courses' },
  { id: 'students', label: 'Students', icon: Users, href: '/dashboard/students' },
  { id: 'live-classes', label: 'Live Classes', icon: Video, href: '/dashboard/live-classes' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { id: 'earnings', label: 'Earnings', icon: DollarSign, href: '/dashboard/earnings' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

const sponsorNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'scholarships', label: 'Scholarships', icon: GraduationCap, href: '/dashboard/scholarships' },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: Users, href: '/dashboard/beneficiaries' },
    { id: 'impact', label: 'Impact Reports', icon: Heart, href: '/dashboard/impact' },
    { id: 'budget', label: 'Budget', icon: DollarSign, href: '/dashboard/budget' },
    { id: 'documents', label: 'Documents', icon: FileText, href: '/dashboard/documents' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];
  
const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'users', label: 'User Management', icon: Users, href: '/dashboard/users' },
    { id: 'courses', label: 'Course Approval', icon: BookOpen, href: '/dashboard/courses' },
    { id: 'sponsors', label: 'Sponsors', icon: GraduationCap, href: '/dashboard/sponsors' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    { id: 'moderation', label: 'Moderation', icon: Shield, href: '/dashboard/moderation' },
    { id: 'announcements', label: 'Announcements', icon: Bell, href: '/dashboard/announcements' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  isMobile = false,
  onNavigate,
}) => {
  const { currentRole } = useRole();
  const { user } = useUser();
  const pathname = usePathname();

  const getNavItems = () => {
    switch (currentRole) {
      case 'teacher':
        return teacherNav;
      case 'sponsor':
        return sponsorNav;
      case 'admin':
        return adminNav;
      default:
        return studentNav;
    }
  };

  const navItems = getNavItems();
  
  if (!user && !isMobile) return null;

  const NavLinks = () => (
    <nav className="flex-1 px-2 space-y-1 py-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            asChild
            className={cn(
              'w-full justify-start btn-touch-target transition-all duration-200',
              collapsed && !isMobile ? 'px-3' : 'px-4',
              pathname === item.href
                ? 'bg-primary/10 text-primary border-l-4 border-primary'
                : 'text-sidebar-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            title={collapsed ? item.label : ''}
          >
            <Link href={item.href} onClick={() => onNavigate?.(item.href)}>
              <item.icon className={cn('h-5 w-5 shrink-0', collapsed && !isMobile ? '' : 'mr-3')} />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          </Button>
        ))}
    </nav>
  );

  if(isMobile) {
    return <NavLinks />;
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-border transition-all duration-300 z-40 hidden lg:flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <NavLinks />

        <div className="px-2 mt-auto py-4">
          <Button
            variant="ghost"
            onClick={onToggle}
            className="w-full justify-start btn-touch-target text-sidebar-foreground hover:bg-accent"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 mx-auto" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-3" />
                <span>Collapse</span>
              </>
            )}
          </Button>

          {!collapsed && (
            <Button
              variant="ghost"
              className="w-full justify-start btn-touch-target text-sidebar-foreground hover:bg-accent mt-1"
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
