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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { UserProfile, Course } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const firestore = useFirestore();

  const { data: users, loading: usersLoading } = useCollection<UserProfile>(
    firestore ? query(collection(firestore, 'users')) : null
  );

  const { data: courses, loading: coursesLoading } = useCollection<Course>(
    firestore ? query(collection(firestore, 'courses')) : null
  );

  const loading = usersLoading || coursesLoading;
  
  const totalRevenue = React.useMemo(() => {
    if (!courses) return 0;
    return courses.reduce((acc, course) => {
        const studentCount = Array.isArray(course.students) ? course.students.length : 0;
        return acc + (course.price * studentCount);
    }, 0);
  }, [courses]);

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
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={users?.length || 0}
          icon={Users}
        />
        <StatCard
          title="Active Courses"
          value={courses?.length || 0}
          icon={BookOpen}
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
         <StatCard
          title="System Health"
          value="99.8%"
          icon={Activity}
        />
      </div>

       {/* Placeholder sections */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">User growth chart coming soon.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Approval queue coming soon.</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboard;
