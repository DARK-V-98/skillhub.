'use client';
import React from 'react';
import { Heart, ArrowRight, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccessibilityBannerProps {
  sidebarCollapsed: boolean;
}

const AccessibilityBanner: React.FC<AccessibilityBannerProps> = ({ sidebarCollapsed }) => {
  return (
    <div className={cn("bg-gradient-to-r from-primary via-primary/80 to-primary text-primary-foreground fixed top-16 z-40 transition-all duration-300", 
      sidebarCollapsed ? 'lg:left-16 right-0' : 'lg:left-64 right-0'
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary-foreground/20 rounded-full">
              <Heart className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Accessibility className="h-5 w-5" aria-hidden="true" />
                100% Free for All Differently-Abled Students
              </h2>
              <p className="text-sm text-primary-foreground/90 hidden sm:block">
                SkillHub is committed to making education accessible to everyone. Apply for our Disability Inclusion Scholarship today.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="btn-touch-target bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
          >
            Apply for Free Access
            <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityBanner;
