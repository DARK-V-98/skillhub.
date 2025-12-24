import React from 'react';
import { Heart, ArrowRight, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AccessibilityBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-primary-foreground">
      <div className="container mx-auto px-4 py-4">
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
              <p className="text-sm text-primary-foreground/90">
                SkillHub is committed to making education accessible to everyone. Apply for our Disability Inclusion Scholarship today.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="btn-touch-target bg-primary-foreground text-emerald-700 hover:bg-primary-foreground/90 font-semibold"
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
