
"use server";

import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type FormState = {
  success: boolean;
  message: string;
}

export async function submitInquiry(
  data: z.infer<typeof formSchema>
): Promise<FormState> {
  const parsedData = formSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: false,
      message: "Invalid data provided.",
    };
  }

  // In a real application, you would save this to a database,
  // send an email, etc.
  console.log("New inquiry received:", parsedData.data);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Inquiry submitted successfully.",
  };
}

const studentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export async function submitStudentInquiry(
  data: z.infer<typeof studentFormSchema>
): Promise<FormState> {
  const parsedData = studentFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided." };
  }

  console.log("New student inquiry:", parsedData.data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Thank you for your interest! We'll be in touch." };
}

const teacherFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  expertise: z.string().min(10, { message: "Please tell us about your expertise." }),
});

export async function submitTeacherApplication(
  data: z.infer<typeof teacherFormSchema>
): Promise<FormState> {
  const parsedData = teacherFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided." };
  }

  console.log("New teacher application:", parsedData.data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Thank you for your application! We'll review it and get back to you." };
}

const sponsorFormSchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required." }),
  contactPerson: z.string().min(2, { message: "Contact person is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export async function submitSponsorInquiry(
  data: z.infer<typeof sponsorFormSchema>
): Promise<FormState> {
  const parsedData = sponsorFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, message: "Invalid data provided." };
  }

  console.log("New sponsor inquiry:", parsedData.data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Thank you for your interest in sponsoring! We will contact you shortly." };
}
