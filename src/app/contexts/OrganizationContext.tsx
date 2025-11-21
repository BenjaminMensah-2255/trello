'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Board } from '../types/board'; 

interface Organization {
  id: string;
  name: string;
  projectCount: number;
  imageUrl: string;
  altText: string;
}



interface OrganizationContextType {
  selectedOrganization: Organization | null;
  setSelectedOrganization: (org: Organization | null) => void;
  selectedBoard: Board | null;
  setSelectedBoard: (board: Board | null) => void;
  refreshOrganizations: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshOrganizations = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const contextValue: OrganizationContextType = {
    selectedOrganization,
    setSelectedOrganization,
    selectedBoard,
    setSelectedBoard,
    refreshOrganizations
  };

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}