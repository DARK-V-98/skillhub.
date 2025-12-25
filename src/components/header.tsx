
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Logo from './Logo';
import { useState } from 'react';

const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#courses", label: "Courses" },
    { href: "/teachers", label: "Instructors" },
    { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={64} />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map(link => (
                 <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Sign Up</Link>
            </Button>
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
                    <Logo width={40} />
                  </Link>
                  <nav className="flex flex-col gap-4 text-lg font-medium">
                     {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className="transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    <div className="border-t pt-4 mt-4 space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                        </Button>
                        <Button className="w-full" asChild>
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                        </Button>
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
