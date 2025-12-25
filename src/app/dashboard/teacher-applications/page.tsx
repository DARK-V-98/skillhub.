'use client';
import React from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { teacherRegistrationSchema } from '@/lib/types';
import { Loader2, FileText } from 'lucide-react';
import { columns } from '@/components/admin/teacher-applications/columns';
import { DataTable } from '@/components/admin/teacher-applications/data-table';
import { z } from 'zod';

type ApplicationData = z.infer<typeof teacherRegistrationSchema> & {
    id: string;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected';
    submittedAt: any;
};

export default function AdminTeacherApplicationsPage() {
  const firestore = useFirestore();

  const { data: applications, loading } = useCollection<ApplicationData>(
    firestore ? query(collection(firestore, 'teacherApplications')) : null
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Teacher Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve new instructor applications.
          </p>
        </div>
      </div>
      
      {loading ? (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      ) : (
        <DataTable columns={columns} data={applications || []} />
      )}
    </>
  );
}
