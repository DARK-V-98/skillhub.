
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { submitStudentInquiry } from "@/app/actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  fullNameWithInitials: z.string().min(2, "Full name with initials is required"),
  nic: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  contactNo: z.string().min(10, "A valid contact number is required"),
  guardianContactNo: z.string().optional(),
});

export default function StudentForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      fullNameWithInitials: "",
      nic: "",
      address: "",
      contactNo: "",
      guardianContactNo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await submitStudentInquiry(values);
    if (result.success) {
      toast({
        title: "Registration Complete!",
        description: "Your details have been saved. Redirecting...",
      });
      router.push('/discover');
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                    <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                    <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="fullNameWithInitials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name with Initials</FormLabel>
              <FormControl>
                <Input placeholder="J. K. Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, Anytown, USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIC (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="National Identity Card number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="contactNo"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                    <Input type="tel" placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="guardianContactNo"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Guardian's Contact (Optional)</FormLabel>
                <FormControl>
                    <Input type="tel" placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save and Continue"}
        </Button>
      </form>
    </Form>
  );
}
