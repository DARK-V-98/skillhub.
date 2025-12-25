
'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole } from '@/lib/types';

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, _setCurrentRole] = useState<UserRole>('student');

  useEffect(() => {
    // On mount, try to load the role from localStorage
    const savedRole = localStorage.getItem('developer-role') as UserRole;
    if (savedRole) {
      _setCurrentRole(savedRole);
    }
  }, []);

  const setCurrentRole = (role: UserRole) => {
    // Save the new role to localStorage and update the state
    localStorage.setItem('developer-role', role);
    _setCurrentRole(role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};
