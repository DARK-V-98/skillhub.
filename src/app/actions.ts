
"use server";

import { z } from "zod";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, runTransaction, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { app } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { Course, CommunityVote } from "@/lib/types";

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
      if (Array.isArray(course.students) && course.students.includes(userId)) {
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


export async function handleVote(
    refId: string,
    refType: 'post' | 'comment',
    userId: string,
    direction: 'up' | 'down'
  ): Promise<{ success: boolean; message: string }> {
    if (!userId) {
      return { success: false, message: 'You must be logged in to vote.' };
    }
  
    const firestore = getFirestore(app);
    const votesCollection = collection(firestore, 'votes');
    const q = query(votesCollection, where('refId', '==', refId), where('userId', '==', userId));
    
    const contentRef = doc(firestore, refType === 'post' ? 'communityPosts' : `communityPosts/${refId.split('_')[0]}/comments`, refId);
  
    try {
      await runTransaction(firestore, async (transaction) => {
        const voteSnapshot = await getDocs(q);
        const existingVoteDoc = voteSnapshot.docs[0];
  
        const contentSnapshot = await transaction.get(contentRef);
        if (!contentSnapshot.exists()) {
          throw new Error("Content not found");
        }
  
        let upvotesChange = 0;
        let downvotesChange = 0;
  
        if (existingVoteDoc) {
          // User has voted before
          const existingVote = existingVoteDoc.data() as CommunityVote;
          
          const voteRef = doc(firestore, 'votes', existingVoteDoc.id);

          if (existingVote.direction === direction) {
            // User is retracting their vote
            transaction.delete(voteRef);
            if (direction === 'up') upvotesChange = -1;
            else downvotesChange = -1;
          } else {
            // User is changing their vote
            transaction.update(voteRef, { direction });
            if (direction === 'up') {
              upvotesChange = 1;
              downvotesChange = -1;
            } else {
              upvotesChange = -1;
              downvotesChange = 1;
            }
          }
        } else {
          // New vote
          const newVoteRef = doc(collection(firestore, 'votes'));
          transaction.set(newVoteRef, {
            userId,
            refId,
            refType,
            direction,
          });
          if (direction === 'up') upvotesChange = 1;
          else downvotesChange = 1;
        }

        const currentUpvotes = contentSnapshot.data().upvotes || 0;
        const currentDownvotes = contentSnapshot.data().downvotes || 0;

        transaction.update(contentRef, {
            upvotes: Math.max(0, currentUpvotes + upvotesChange),
            downvotes: Math.max(0, currentDownvotes + downvotesChange),
        });
      });
      return { success: true, message: 'Vote recorded.' };
    } catch (e) {
      console.error("Transaction failed: ", e);
      if (e instanceof Error) {
        return { success: false, message: e.message };
      }
      return { success: false, message: 'An unknown error occurred.' };
    }
  }

export async function toggleBlogPostLike(postId: string, userId: string): Promise<{ success: boolean; message: string; liked: boolean }> {
  if (!userId) {
    return { success: false, message: 'You must be logged in to like a post.', liked: false };
  }

  const firestore = getFirestore(app);
  const postRef = doc(firestore, 'blogPosts', postId);

  try {
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) {
      return { success: false, message: 'Post not found.', liked: false };
    }

    const postData = postSnap.data();
    const likes: string[] = postData.likes || [];
    let liked = false;

    if (likes.includes(userId)) {
      // User is unliking the post
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
      });
      liked = false;
    } else {
      // User is liking the post
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
      });
      liked = true;
    }

    return { success: true, message: 'Success', liked };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, message: 'An unknown error occurred.', liked: false };
  }
}
