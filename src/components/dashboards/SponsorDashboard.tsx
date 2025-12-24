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
import { sponsorStats, scholarships } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import Image from 'next/image';

const SponsorDashboard: React.FC = () => {
  const budgetPercentage = Math.round((sponsorStats.budgetUsed / sponsorStats.totalBudget) * 100);

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
          value={sponsorStats.scholarshipsFunded}
          icon={GraduationCap}
          change={{ value: 1, positive: true }}
        />
        <StatCard
          title="Students Helped"
          value={sponsorStats.studentsHelped.toLocaleString()}
          icon={Users}
          change={{ value: 28, positive: true }}
        />
        <StatCard
          title="Budget Allocated"
          value={`$${sponsorStats.totalBudget.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Impact Score"
          value={`${sponsorStats.impactScore}/100`}
          icon={Heart}
          change={{ value: 5, positive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Impact Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sponsorStats.monthlyImpact}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="students"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                    name="Students"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="budget"
                    stroke="hsl(var(--info))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--info))' }}
                    name="Budget"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Budget Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-accent rounded-xl">
              <p className="text-4xl font-bold text-foreground">
                ${sponsorStats.budgetUsed.toLocaleString()}
              </p>
              <p className="text-muted-foreground">
                of ${sponsorStats.totalBudget.toLocaleString()} used
              </p>
              <div className="mt-4 progress-bar h-3">
                <div
                  className="progress-fill"
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{budgetPercentage}% allocated</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">CSR Rating</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{sponsorStats.csrRating}</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Avg. Course Completion</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">78%</p>
              </div>
            </div>
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
          {scholarships.map((scholarship) => (
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
        </div>
      </section>

      {/* Recent Beneficiaries */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Beneficiaries</h2>
          <Button variant="ghost" className="text-primary">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Maria Santos', course: 'Web Development', progress: 85, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
            { name: 'James Wilson', course: 'Data Science', progress: 62, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
            { name: 'Lisa Chen', course: 'UI/UX Design', progress: 94, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
          ].map((student, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={student.avatar}
                    alt={student.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.course}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-primary">{student.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SponsorDashboard;
