import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Simple Site. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" prefetch={false}>
            <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" prefetch={false}>
            <Github className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" prefetch={false}>
            <Linkedin className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
