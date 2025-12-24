
'use client';
import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import SponsorDashboard from '@/components/dashboards/SponsorDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const DashboardPage: React.FC = () => {
    const { currentRole, setCurrentRole } = useRole();
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
  
    const userProfileRef = user ? doc(firestore, 'users', user.uid) : null;
    const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userProfileRef);

    React.useEffect(() => {
        if (userProfile?.role) {
            setCurrentRole(userProfile.role);
        }
    }, [userProfile, setCurrentRole]);

    const renderDashboard = () => {
      // Determine which role to render. If the stored role is 'developer', use the one from context, otherwise use the stored one.
      const roleToRender = userProfile?.role === 'developer' ? currentRole : userProfile?.role;
    
      switch (roleToRender) {
        case 'teacher':
          return <TeacherDashboard />;
        case 'sponsor':
          return <SponsorDashboard />;
        case 'admin':
          return <AdminDashboard />;
        case 'student':
        default:
          return <StudentDashboard />;
      }
    };
  
    // Show a loading spinner while user or profile data is being fetched.
    if (userLoading || profileLoading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-20rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }

    // If there is no user, we can show an empty state or redirect, but for now we'll just show nothing
    // as the layout should handle the redirect.
    if (!user) {
        return null;
    }

    return (
      <>
        {renderDashboard()}
      </>
    );
  };
  
  export default DashboardPage;
