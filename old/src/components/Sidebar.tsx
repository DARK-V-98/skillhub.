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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const studentNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'my-courses', label: 'My Courses', icon: BookOpen },
  { id: 'live-classes', label: 'Live Classes', icon: Video },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'community', label: 'Community', icon: MessageSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const teacherNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'create-course', label: 'Create Course', icon: PlusCircle },
  { id: 'my-courses', label: 'My Courses', icon: BookOpen },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'live-classes', label: 'Live Classes', icon: Video },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const sponsorNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
  { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
  { id: 'impact', label: 'Impact Reports', icon: Heart },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const adminNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'courses', label: 'Course Approval', icon: BookOpen },
  { id: 'sponsors', label: 'Sponsors', icon: GraduationCap },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'moderation', label: 'Moderation', icon: Shield },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  activePage,
  onNavigate,
}) => {
  const { currentRole } = useRole();

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

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full py-4">
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full justify-start btn-touch-target transition-all duration-200',
                collapsed ? 'px-3' : 'px-4',
                activePage === item.id
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              aria-current={activePage === item.id ? 'page' : undefined}
            >
              <item.icon className={cn('h-5 w-5', collapsed ? '' : 'mr-3')} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>

        <div className="px-2 mt-auto">
          <Button
            variant="ghost"
            onClick={onToggle}
            className="w-full justify-start btn-touch-target text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
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
              className="w-full justify-start btn-touch-target text-sidebar-foreground hover:bg-sidebar-accent mt-1"
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
