'use client';
import React from 'react';
import { 
  Home, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Settings,
  PlusCircle,
  Users,
  BarChart3,
  GraduationCap,
  Heart,
  Shield,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  { id: 'community', label: 'Community', icon: MessageSquare, href: '/dashboard/community' },
  { id: 'settings', label: 'Profile', icon: Settings, href: '/dashboard/settings' },
];

const teacherNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'create-course', label: 'Create Course', icon: PlusCircle, href: '/dashboard/create-course' },
  { id: 'my-courses', label: 'My Courses', icon: BookOpen, href: '/dashboard/my-courses' },
  { id: 'students', label: 'Students', icon: Users, href: '/dashboard/students' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { id: 'settings', label: 'Profile', icon: Settings, href: '/dashboard/settings' },
];

const sponsorNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'scholarships', label: 'Scholarships', icon: GraduationCap, href: '/dashboard/scholarships' },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: Users, href: '/dashboard/beneficiaries' },
    { id: 'impact', label: 'Impact', icon: Heart, href: '/dashboard/impact' },
    { id: 'settings', label: 'Profile', icon: Settings, href: '/dashboard/settings' },
];
  
const adminNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'users', label: 'Users', icon: Users, href: '/dashboard/users' },
    { id: 'courses', label: 'Courses', icon: BookOpen, href: '/dashboard/courses' },
    { id: 'sponsors', label: 'Sponsors', icon: GraduationCap, href: '/dashboard/sponsors' },
    { id: 'moderation', label: 'Moderation', icon: Shield, href: '/dashboard/moderation' },
    { id: 'settings', label: 'Profile', icon: Settings, href: '/dashboard/settings' },
];


const DashboardNav: React.FC = () => {
    const { currentRole } = useRole();
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

    return (
        <div className="border-b hidden md:block">
            <div className="container mx-auto">
                <nav className="flex items-center gap-1 -mb-px">
                    {navItems.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={cn(
                        'flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors',
                        pathname === item.href
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export default DashboardNav;
