
'use client';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Step1Personal() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="A. B. C. Perera" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+94 77 123 4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="text" placeholder="YYYY-MM-DD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

       <FormField
          control={control}
          name="profilePhoto"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Profile Photo</FormLabel>
              <FormControl>
                <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                    {...rest}
                />
              </FormControl>
              <FormDescription>A professional headshot is recommended.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Country</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="Maldives">Maldives</SelectItem>
                                <SelectItem value="Singapore">Singapore</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name="timezone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Timezone</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select your timezone" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="GMT+5.5">Asia/Colombo (GMT+5:30)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
         <FormField
            control={control}
            name="preferredLanguage"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Preferred Teaching Language(s)</FormLabel>
                     <Select onValueChange={(value) => field.onChange([value])} defaultValue={field.value?.[0]}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select languages" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Sinhala">Sinhala</SelectItem>
                            <SelectItem value="Tamil">Tamil</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription>You can select multiple languages in later steps.</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />

    </div>
  );
}
