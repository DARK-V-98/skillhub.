import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <Logo size="lg" showText={false} />
          <p className="mt-4 text-muted-foreground max-w-xs">
            Empowering learners and educators worldwide with accessible, quality education.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#courses" className="hover:text-primary">Courses</Link></li>
            <li><Link href="#live" className="hover:text-primary">Live Sessions</Link></li>
            <li><Link href="#community" className="hover:text-primary">Community</Link></li>
            <li><Link href="#sponsorship" className="hover:text-primary">Sponsorship</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="#careers" className="hover:text-primary">Careers</Link></li>
            <li><Link href="#contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#blog" className="hover:text-primary">Blog</Link></li>
            <li><Link href="#help" className="hover:text-primary">Help Center</Link></li>
            <li><Link href="#terms" className="hover:text-primary">Terms of Service</Link></li>
            <li><Link href="#privacy" className="hover:text-primary">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SkillHub. All rights reserved. Developed by esystemlk.
      </div>
    </div>
  </footer>
  );
}
