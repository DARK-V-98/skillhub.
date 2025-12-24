
'use client';
import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  LogOut, 
  Settings, 
  Moon, 
  Sun,
  Menu
} from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/lib/types';
import { notifications } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from '@/firebase/auth';
import Image from 'next/image';

interface NavbarProps {
  onMenuToggle: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  teacher: 'Teacher',
  sponsor: 'Sponsor',
  admin: 'Admin',
};

const roleColors: Record<UserRole, string> = {
  student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  teacher: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  sponsor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  admin: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle, darkMode, onDarkModeToggle }) => {
  const { currentRole, setCurrentRole } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {user && (
            <Button
                variant="ghost"
                size="icon"
                onClick={onMenuToggle}
                className="lg:hidden btn-touch-target"
                aria-label="Toggle menu"
            >
                <Menu className="h-5 w-5" />
            </Button>
          )}
          <Logo size="md" />
        </div>

        {user && (
            <>
                {/* Center section - Search */}
                <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search courses, instructors, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
                    aria-label="Search"
                    />
                </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-2">
                {/* Role Switcher (Demo) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 btn-touch-target">
                        <Badge className={cn('font-normal', roleColors[currentRole])}>
                        {roleLabels[currentRole]}
                        </Badge>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-popover">
                    <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                        <DropdownMenuItem
                        key={role}
                        onClick={() => setCurrentRole(role)}
                        className={cn(
                            'cursor-pointer btn-touch-target',
                            currentRole === role && 'bg-accent'
                        )}
                        >
                        <Badge className={cn('mr-2', roleColors[role])}>
                            {roleLabels[role]}
                        </Badge>
                        {roleLabels[role]}
                        </DropdownMenuItem>
                    ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Dark mode toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDarkModeToggle}
                    className="btn-touch-target"
                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {/* Notifications */}
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="btn-touch-target relative"
                        aria-label={`Notifications, ${unreadCount} unread`}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                            {unreadCount}
                        </span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80 p-0 bg-popover">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={cn(
                            'p-4 border-b border-border last:border-0 hover:bg-accent cursor-pointer transition-colors',
                            !notification.read && 'bg-primary/5'
                            )}
                        >
                            <div className="flex items-start gap-3">
                            <div className={cn(
                                'h-2 w-2 rounded-full mt-2 shrink-0',
                                notification.type === 'success' && 'bg-green-500',
                                notification.type === 'warning' && 'bg-yellow-500',
                                notification.type === 'class' && 'bg-blue-500',
                                notification.type === 'info' && 'bg-gray-400'
                            )} />
                            <div className="flex-1 space-y-1">
                                <p className="font-medium text-sm">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                                <p className="text-xs text-muted-foreground">
                                {new Date(notification.timestamp).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                                </p>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-border">
                        <Button variant="ghost" className="w-full btn-touch-target text-primary">
                        View all notifications
                        </Button>
                    </div>
                    </PopoverContent>
                </Popover>

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="btn-touch-target flex items-center gap-2 px-2"
                        aria-label="User menu"
                    >
                        {user.photoURL && <Image
                          src={user.photoURL}
                          alt={user.displayName || 'User Avatar'}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
                        />}
                        <span className="hidden lg:block font-medium">{user.displayName}</span>
                        <ChevronDown className="h-4 w-4 hidden lg:block" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-popover">
                    <DropdownMenuLabel>
                        <div className="flex flex-col">
                        <span>{user.displayName}</span>
                        <span className="text-sm font-normal text-muted-foreground">{user.email}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer btn-touch-target">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer btn-touch-target">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer btn-touch-target text-destructive" onClick={() => signOut()}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
