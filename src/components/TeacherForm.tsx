
"use client";

import Link from 'next/link';
import { Button } from './ui/button';

export default function TeacherForm() {
  return (
    <div className="text-center p-4">
        <p className="mb-4">To become an instructor, please complete our detailed registration form. This helps us verify your qualifications and set up your teaching profile.</p>
        <Button asChild className="w-full">
            <Link href="/register/teacher">Start Teacher Registration</Link>
        </Button>
    </div>
  );
}
