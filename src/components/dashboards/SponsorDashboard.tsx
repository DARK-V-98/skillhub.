'use client';
import React from 'react';
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  Heart,
  TrendingUp,
  FileText,
  PlusCircle,
  Download,
  MessageSquare
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Scholarship } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const SponsorDashboard: React.FC = () => {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sponsor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your impact and manage scholarships.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="btn-touch-target">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="btn-touch-target">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Scholarship
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
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
          icon={Heart}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Impact Over Time (Demo)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Impact chart coming soon.</p>
          </CardContent>
        </Card>

        {/* Placeholder for Budget Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Budget Overview
            </CardTitle>
          </CardHeader>
           <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Budget allocation chart coming soon.</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Scholarships */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Active Scholarships</h2>
          <Button variant="ghost" className="text-primary">
            View All
          </Button>
        </div>
        <div className="grid gap-4">
          {scholarships?.map((scholarship) => (
            <Card key={scholarship.id} className="card-hover">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{scholarship.title}</h3>
                      <Badge
                        className={
                          scholarship.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : scholarship.status === 'completed'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }
                      >
                        {scholarship.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{scholarship.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${scholarship.amount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {scholarship.beneficiaries} beneficiaries
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="btn-touch-target">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm" className="btn-touch-target">
                      <FileText className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
           {!loading && scholarships?.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-medium">No scholarships found.</h3>
            </div>
           )}
        </div>
      </section>
    </div>
  );
};

export default SponsorDashboard;
