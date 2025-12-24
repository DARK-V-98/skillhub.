import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Mountain } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Mountain className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Simple Site
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              href="#contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contact
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="inline-flex items-center justify-center md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <Mountain className="h-6 w-6" />
                <span className="font-bold">
                Simple Site
                </span>
            </Link>
            <div className="grid gap-2 py-6">
              <Link href="#features" className="flex w-full items-center py-2 text-lg font-semibold">Features</Link>
              <Link href="#contact" className="flex w-full items-center py-2 text-lg font-semibold">Contact</Link>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild>
            <Link href="#contact">
              Get In Touch
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
