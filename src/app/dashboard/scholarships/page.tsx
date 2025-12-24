
'use client';
import React from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Scholarship } from '@/lib/types';
import { Loader2, GraduationCap, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ScholarshipsPage() {
  const firestore = useFirestore();
  const { data: scholarships, loading } = useCollection<Scholarship>(
    firestore ? query(collection(firestore, 'scholarships')) : null
  );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Scholarships
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your funded scholarships and their impact.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships && scholarships.length > 0 ? (
            scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{scholarship.title}</CardTitle>
                  <CardDescription>{scholarship.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${scholarship.amount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {scholarship.beneficiaries} beneficiaries
                    </span>
                  </div>
                   <Badge
                        className={
                          scholarship.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }
                      >
                        {scholarship.status}
                    </Badge>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">Manage</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No scholarships found.</h3>
              <p className="mt-1 text-sm text-muted-foreground">Create a scholarship to get started.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
