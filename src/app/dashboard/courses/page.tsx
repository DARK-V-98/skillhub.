
'use client';
import React from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Course } from '@/lib/types';
import { Loader2, BookOpen } from 'lucide-react';
import { columns } from '@/components/admin/courses/columns';
import { DataTable } from '@/components/admin/courses/data-table';

export default function AdminCoursesPage() {
  const firestore = useFirestore();

  const { data: courses, loading } = useCollection<Course>(
    firestore ? query(collection(firestore, 'courses')) : null
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Course Management
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all courses on the platform.
          </p>
        </div>
      </div>
      
      {loading ? (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      ) : (
        <DataTable columns={columns} data={courses || []} />
      )}
    </>
  );
}
