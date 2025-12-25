
'use client';
import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const expertiseOptions = [
    'Web Development', 'Data Science', 'UI/UX Design', 'Marketing', 'Business', 'Photography', 'Music'
];

export default function Step2Professional() {
  const { control } = useFormContext();
  const [expertiseInput, setExpertiseInput] = useState('');

  return (
    <div className="space-y-6">
       <FormField
        control={control}
        name="headline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Headline</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Senior Software Engineer at Google" {...field} />
            </FormControl>
            <FormDescription>A short, catchy headline that appears under your name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Biography</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about your professional journey, your passion for teaching, and what students can expect from your courses."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormDescription>A detailed bio helps students connect with you. Minimum 100 characters.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Controller
        control={control}
        name="areasOfExpertise"
        defaultValue={[]}
        render={({ field }) => (
            <FormItem>
                <FormLabel>Areas of Expertise</FormLabel>
                 <div className="flex flex-wrap gap-2">
                    {field.value.map((expertise: string, index: number) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                            {expertise}
                            <button type="button" onClick={() => field.onChange(field.value.filter((e: string) => e !== expertise))} className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                <X className="h-3 w-3"/>
                            </button>
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Add an expertise area"
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && expertiseInput.trim()) {
                                e.preventDefault();
                                if (!field.value.includes(expertiseInput.trim())) {
                                    field.onChange([...field.value, expertiseInput.trim()]);
                                }
                                setExpertiseInput('');
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                             if (expertiseInput.trim() && !field.value.includes(expertiseInput.trim())) {
                                field.onChange([...field.value, expertiseInput.trim()]);
                            }
                            setExpertiseInput('');
                        }}
                    >
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                </div>
                 <div className="flex flex-wrap gap-1">
                    {expertiseOptions.filter(opt => !field.value.includes(opt)).map(opt => (
                         <button 
                            key={opt}
                            type="button" 
                            onClick={() => field.onChange([...field.value, opt])}
                            className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full hover:bg-primary/20"
                         >
                            + {opt}
                        </button>
                    ))}
                </div>
                <FormDescription>List your skills and subjects you can teach.</FormDescription>
                <FormMessage />
            </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile URL (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://www.linkedin.com/in/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website or Portfolio URL (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://yourportfolio.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
