
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BookOpen } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={64} />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/#features" className="transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="/#courses" className="transition-colors hover:text-primary">
              Courses
            </Link>
             <Link href="/teachers" className="transition-colors hover:text-primary">
              Instructors
            </Link>
            <Link href="#sponsorship" className="transition-colors hover:text-primary">
              Sponsorship
            </Link>
            <Link href="#contact" className="transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
  );
}
