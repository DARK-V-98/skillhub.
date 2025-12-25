
'use client';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitTeacherRegistration } from '@/app/actions';
import { teacherRegistrationSchema } from '@/lib/types';
import Step1Personal from './Step1Personal';
import FormNavigation from './FormNavigation';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import StepIndicator from './StepIndicator';

const steps = [
  { id: 1, title: 'Personal Information', fields: ['fullName', 'email', 'phone', 'dateOfBirth', 'profilePhoto', 'country', 'timezone', 'preferredLanguage'] },
  // { id: 2, title: 'Professional Background' },
  // { id: 3, title: 'Education & Credentials' },
  // { id: 4, title: 'Teaching Profile' },
  // { id: 5, title: 'Social Proof & Portfolio' },
  // { id: 6, title: 'Course Planning' },
  // { id: 7, title: 'Payment Information' },
  // { id: 8, title: 'Legal & Agreements' },
  // { id: 9, title: 'Additional Information' },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const methods = useForm<z.infer<typeof teacherRegistrationSchema>>({
    resolver: zodResolver(teacherRegistrationSchema),
    mode: 'onChange',
  });

  const { trigger, getValues, formState } = methods;

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
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if(Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    const result = await submitTeacherRegistration(formData);

    if (result.success) {
      toast({
        title: 'Application Submitted!',
        description: result.message,
      });
      // Optionally reset form or redirect
      // methods.reset();
      // setCurrentStep(1);
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
          
          {currentStep === 1 && <Step1Personal />}

          {/* Other steps will go here */}

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
