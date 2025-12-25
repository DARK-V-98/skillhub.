import type { Metadata } from 'next';
import { Inter, Open_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import AccessibilityPanel from '@/components/AccessibilityPanel';
import AppLoader from '@/components/AppLoader';
import HelpChatWidget from '@/components/help-chat/HelpChatWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const openSans = Open_Sans({ 
  subsets: ['latin'], 
  variable: '--font-dyslexic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkillHub',
  description: 'Your hub for online learning',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${openSans.variable} font-sans`}>
        <AppLoader>
            <FirebaseClientProvider>
            <AccessibilityProvider>
                <RoleProvider>
                {children}
                <Toaster />
                <AccessibilityPanel />
                <HelpChatWidget />
                </RoleProvider>
            </AccessibilityProvider>
            </FirebaseClientProvider>
        </AppLoader>
      </body>
    </html>
  );
}
