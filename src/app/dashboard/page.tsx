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
    const { user } = useUser();
    const firestore = useFirestore();
  
    const userProfileRef = user ? doc(firestore, 'users', user.uid) : null;
    const { data: userProfile, loading: userProfileLoading } = useDoc<UserProfile>(userProfileRef);

    React.useEffect(() => {
        if(userProfile?.role) {
            setCurrentRole(userProfile.role);
        }
    },[userProfile, setCurrentRole]);

    const renderDashboard = () => {
      const roleToRender = userProfile?.role === 'developer' ? currentRole : userProfile?.role;
    
      if (!userProfile) return null;

      switch (roleToRender) {
        case 'student':
          return <StudentDashboard />;
        case 'teacher':
          return <TeacherDashboard />;
        case 'sponsor':
          return <SponsorDashboard />;
        case 'admin':
          return <AdminDashboard />;
        case 'developer':
        default:
          return <StudentDashboard />;
      }
    };
  
    if(userProfileLoading){
      return(
        <div className="flex items-center justify-center h-[calc(100vh-20rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )
    }

    return (
      <>
        {renderDashboard()}
      </>
    );
  };
  
  export default DashboardPage;
