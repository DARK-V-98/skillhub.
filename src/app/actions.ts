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
