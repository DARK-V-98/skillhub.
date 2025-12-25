
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User } from 'lucide-react';
import Logo from './Logo';
import { useState } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#courses", label: "Courses" },
    { href: "/teachers", label: "Instructors" },
    { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={40} />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map(link => (
                 <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {loading ? (
                <div className="h-10 w-24 rounded-md bg-muted animate-pulse" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                             {user?.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt={user.displayName || 'User Avatar'}
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                ) : (
                                <User className="h-8 w-8 rounded-full object-cover p-1" />
                            )}
                            <span>{user.displayName || 'My Account'}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile">Profile</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="p-6">
                  <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                    <Logo width={60} />
                  </Link>
                  <nav className="flex flex-col gap-4 text-lg font-medium">
                     {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    <div className="border-t pt-4 mt-4 space-y-2">
                        {user ? (
                             <Button className="w-full" asChild>
                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Go to Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                                </Button>
                                <Button className="w-full" asChild>
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
  );
}
