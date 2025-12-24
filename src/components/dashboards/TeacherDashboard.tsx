'use client';
import React from 'react';
import { 
  Users, 
  DollarSign, 
  Star, 
  BookOpen,
  TrendingUp,
  Eye,
  BarChart3,
  PlusCircle,
  Video,
  MessageSquare
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { teacherStats, courses } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Image from 'next/image';

const TeacherDashboard: React.FC = () => {
  const myCourses = courses.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your courses and track performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="btn-touch-target">
            <Video className="h-4 w-4 mr-2" />
            Start Live Class
          </Button>
          <Button className="btn-touch-target">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={teacherStats.totalStudents.toLocaleString()}
          icon={Users}
          change={{ value: 12, positive: true }}
        />
        <StatCard
          title="Course Revenue"
          value={`$${teacherStats.courseRevenue.toLocaleString()}`}
          icon={DollarSign}
          change={{ value: 18, positive: true }}
        />
        <StatCard
          title="Average Rating"
          value={teacherStats.averageRating.toString()}
          icon={Star}
          change={{ value: 2, positive: true }}
        />
        <StatCard
          title="Active Courses"
          value={teacherStats.activeCourses}
          icon={BookOpen}
          change={{ value: 1, positive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={teacherStats.monthlyEarnings}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                    name="Earnings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{teacherStats.completionRate}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${teacherStats.completionRate}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student Engagement</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-accent rounded-lg text-center">
                <Eye className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{teacherStats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
              <div className="p-4 bg-accent rounded-lg text-center">
                <MessageSquare className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">234</p>
                <p className="text-sm text-muted-foreground">Q&A Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Courses Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">My Courses</h2>
          <Button variant="ghost" className="text-primary">
            Manage All
          </Button>
        </div>
        <div className="grid gap-4">
          {myCourses.map((course) => (
            <Card key={course.id} className="card-hover">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={128}
                    height={80}
                    className="rounded-lg object-cover w-full sm:w-32 h-auto sm:h-20"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students.toLocaleString()} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${(course.students * course.price * 0.7).toLocaleString()} earned
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 self-start sm:self-center">
                    <Button variant="outline" size="sm" className="btn-touch-target">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="btn-touch-target">
                      Analytics
                    </Button>
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

export default TeacherDashboard;
