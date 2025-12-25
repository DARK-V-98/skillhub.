
'use client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  isSubmitting,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between pt-8 mt-8 border-t">
      <div>
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={onPrev} disabled={isSubmitting}>
            Previous
          </Button>
        )}
      </div>
      <div>
        {currentStep < totalSteps ? (
          <Button type="button" onClick={onNext} disabled={isSubmitting}>
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        )}
      </div>
    </div>
  );
}
