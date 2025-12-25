
"use server";

import { z } from "zod";
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { app } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { Course } from "@/lib/types";

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
    return { success: true, message: "Thank you for your interest! We'll be in touch with you shortly." };
}


export async function submitTeacherRegistration(data: any): Promise<FormState> {
    console.log("New teacher registration submission:", data);
    // In a real application, you would save this to Firestore,
    // upload files to Cloud Storage, and trigger a review process.
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For now, we'll just simulate a success response.
    return {
        success: true,
        message: "Application submitted successfully! We'll review it and get back to you within 3-5 business days."
    };
}


export async function enrollInCourse(courseId: string, userId: string): Promise<FormState> {
    if (!userId) {
      return { success: false, message: "You must be logged in to enroll." };
    }
  
    const firestore = getFirestore(app);
    const courseRef = doc(firestore, "courses", courseId);
  
    try {
      const courseSnap = await getDoc(courseRef);
      if (!courseSnap.exists()) {
        return { success: false, message: "This course does not exist." };
      }
  
      const course = courseSnap.data() as Course;
      if (course.students?.includes(userId)) {
        return { success: false, message: "You are already enrolled in this course." };
      }
  
      // Initialize progress object for the student
      const studentProgress = {
        progress: 0,
        score: 0,
        completedLessons: 0,
        timeSpent: 0
      };
  
      await updateDoc(courseRef, {
        students: arrayUnion(userId),
        [`progress.${userId}`]: studentProgress
      });
  
      return { success: true, message: "Successfully enrolled! The course has been added to your dashboard." };
    } catch (error) {
      console.error("Error enrolling in course:", error);
      if (error instanceof Error) {
        return { success: false, message: `Failed to enroll: ${error.message}` };
      }
      return { success: false, message: "An unknown error occurred during enrollment." };
    }
  }
