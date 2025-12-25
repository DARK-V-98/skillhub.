
'use client';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitTeacherRegistration } from '@/app/actions';
import { teacherRegistrationSchema } from '@/lib/types';
import Step1Personal from './Step1Personal';
import Step2Professional from './Step2Professional';
import FormNavigation from './FormNavigation';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import StepIndicator from './StepIndicator';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';


const steps = [
  { id: 1, title: 'Personal Information', fields: ['fullName', 'email', 'phone', 'dateOfBirth', 'country', 'timezone', 'preferredLanguage'] },
  { id: 2, title: 'Professional Background', fields: ['bio', 'headline', 'areasOfExpertise', 'linkedinUrl', 'websiteUrl'] },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();


  const methods = useForm<z.infer<typeof teacherRegistrationSchema>>({
    resolver: zodResolver(teacherRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        country: '',
        timezone: '',
        bio: '',
        headline: '',
        areasOfExpertise: [],
        linkedinUrl: '',
        websiteUrl: '',
        preferredLanguage: [],
    }
  });

  const { trigger, formState } = methods;

  const handleNext = async () => {
    const fields = steps[currentStep - 1].fields;
    const isValid = await trigger(fields as any, { shouldFocus: true });
    if (isValid) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: z.infer<typeof teacherRegistrationSchema>) => {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to submit an application."});
        return;
    }

    const plainDataObject: { [key: string]: any } = {};
    Object.entries(data).forEach(([key, value]) => {
        if (!(value instanceof File)) {
            plainDataObject[key] = value;
        }
    });

    const result = await submitTeacherRegistration(plainDataObject, user.uid);

    if (result.success) {
      toast({
        title: 'Application Submitted!',
        description: result.message,
      });
      router.push('/register/teacher/status');
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.message,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="bg-card p-8 rounded-xl border">
        <StepIndicator steps={steps} currentStep={currentStep} />
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          
          <div className={currentStep === 1 ? 'block' : 'hidden'}>
            <Step1Personal />
          </div>
          <div className={currentStep === 2 ? 'block' : 'hidden'}>
            <Step2Professional />
          </div>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={handleNext}
            onPrev={handlePrev}
            isSubmitting={formState.isSubmitting}
          />
        </form>
      </div>
    </FormProvider>
  );
}
