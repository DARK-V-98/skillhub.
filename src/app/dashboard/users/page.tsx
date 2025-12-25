'use client';
import React from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { UserProfile } from '@/lib/types';
import { Loader2, Users } from 'lucide-react';
import { columns } from '@/components/admin/users/columns';
import { DataTable } from '@/components/admin/users/data-table';

export default function AdminUsersPage() {
  const firestore = useFirestore();

  const { data: users, loading } = useCollection<UserProfile>(
    firestore ? query(collection(firestore, 'users')) : null
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all users on the platform.
          </p>
        </div>
      </div>
      
      {loading ? (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      ) : (
        <DataTable columns={columns} data={users || []} />
      )}
    </>
  );
}
