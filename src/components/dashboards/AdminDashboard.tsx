'use client';
import React from 'react';
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Bell,
  Settings,
  FileText
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { adminStats } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const COLORS = ['hsl(160, 72%, 50%)', 'hsl(200, 84%, 45%)', 'hsl(280, 84%, 45%)', 'hsl(0, 84%, 60%)'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="btn-touch-target">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" className="btn-touch-target">
            <Bell className="h-4 w-4 mr-2" />
            Announcements
          </Button>
          <Button className="btn-touch-target">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 mx-auto text-emerald-600 dark:text-emerald-500" />
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
              {adminStats.systemHealth}%
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-500">System Health</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto text-blue-600 dark:text-blue-500" />
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-2">
              {adminStats.activeSessionsNow.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-500">Active Now</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto text-amber-600 dark:text-amber-500" />
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-2">
              {adminStats.pendingApprovals}
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-500">Pending Approvals</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800">
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 mx-auto text-rose-600 dark:text-rose-500" />
            <p className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-2">
              {adminStats.reportedContent}
            </p>
            <p className="text-sm text-rose-600 dark:text-rose-500">Reported Content</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={adminStats.totalUsers.toLocaleString()}
          icon={Users}
          change={{ value: 15, positive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`$${(adminStats.totalRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          change={{ value: 22, positive: true }}
        />
        <StatCard
          title="Active Courses"
          value={adminStats.activeCourses}
          icon={BookOpen}
          change={{ value: 8, positive: true }}
        />
        <StatCard
          title="New Users Today"
          value={adminStats.newUsersToday}
          icon={TrendingUp}
          change={{ value: 5, positive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Platform Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={adminStats.userGrowth}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    name="Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Users by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adminStats.usersByRole}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="role"
                  >
                    {adminStats.usersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {adminStats.usersByRole.map((role, index) => (
                <div key={role.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{role.role}</span>
                  </div>
                  <span className="text-sm font-medium">{role.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
