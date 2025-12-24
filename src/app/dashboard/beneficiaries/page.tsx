
'use client';
import React from 'react';
import { Loader2, Users } from 'lucide-react';

export default function BeneficiariesPage() {
    // This is a placeholder page.
    // In a real application, you would fetch and display a list of students
    // who have benefited from the sponsor's scholarships.
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Beneficiaries
          </h1>
          <p className="text-muted-foreground mt-1">
            View students supported by your scholarships.
          </p>
        </div>
      </div>
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Beneficiary list is not yet available.</h3>
        <p className="mt-1 text-sm text-muted-foreground">This feature is coming soon.</p>
    </div>
    </>
  );
}
