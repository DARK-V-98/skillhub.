
'use client';
import React from 'react';
import { Loader2, Heart, TrendingUp, DollarSign, Users, GraduationCap } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Scholarship } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImpactPage() {
    const firestore = useFirestore();
    const { data: scholarships, loading } = useCollection<Scholarship>(
        firestore ? query(collection(firestore, 'scholarships')) : null
    );

    const totalBeneficiaries = React.useMemo(() => scholarships?.reduce((acc, s) => acc + s.beneficiaries, 0) || 0, [scholarships]);
    const totalBudget = React.useMemo(() => scholarships?.reduce((acc, s) => acc + s.amount, 0) || 0, [scholarships]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            Impact Report
          </h1>
          <p className="text-muted-foreground mt-1">
            An overview of your contributions and their impact.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Scholarships Funded"
          value={scholarships?.length || 0}
          icon={GraduationCap}
        />
        <StatCard
          title="Students Helped"
          value={totalBeneficiaries.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Total Contribution"
          value={`$${totalBudget.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Impact Score (Demo)"
          value={`94/100`}
          icon={TrendingUp}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Contribution Over Time (Demo)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Contribution chart coming soon.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Beneficiary Demographics (Demo)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Demographics chart coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
