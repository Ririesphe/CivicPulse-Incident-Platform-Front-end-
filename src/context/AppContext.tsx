import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, Notification } from '../db/schema';
import { initializeDb, db } from '../db/mockDb';
import { apiClient } from '../api/apiClient';

export type PageType = 
  | 'home' 
  | 'report' 
  | 'map' 
  | 'incidents' 
  | 'how-it-works' 
  | 'about' 
  | 'user-dashboard' 
  | 'admin-dashboard' 
  | 'incident-details' 
  | 'ai-analysis';

interface AppContextProps {
  currentUser: User;
  currentRole: UserRole;
  currentPage: PageType;
  selectedIncidentId: string | null;
  notifications: Notification[];
  unreadCount: number;
  refreshTrigger: number;
  aiAnalysisInProgress: boolean;
  setAiAnalysisInProgress: (val: boolean) => void;
  switchRole: (role: UserRole) => void;
  navigateTo: (page: PageType, incidentId?: string | null) => void;
  triggerRefresh: () => void;
  markNotificationAsRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize database once
  useEffect(() => {
    initializeDb();
  }, []);

  const users = db.getUsers();
  
  // States
  const [currentRole, setCurrentRole] = useState<UserRole>('community');
  const [currentUser, setCurrentUser] = useState<User>(
    users.find(u => u.role === 'community') || {
      id: 'user-siphelele',
      name: 'Siphelele Malotana',
      email: 'siphelele@civicpulse.org',
      phone: '+27 82 123 4567',
      role: 'community',
      created_at: new Date().toISOString()
    }
  );
  
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [aiAnalysisInProgress, setAiAnalysisInProgress] = useState<boolean>(false);

  // Sync role-based mock user
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const allUsers = db.getUsers();
    const matchedUser = allUsers.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
    }
    
    // Redirect role-appropriate dashboards
    if (role === 'community' && (currentPage === 'admin-dashboard' || currentPage === 'incident-details' && selectedIncidentId === null)) {
      setCurrentPage('home');
    } else if (role === 'response' && (currentPage === 'user-dashboard' || currentPage === 'home')) {
      setCurrentPage('incidents');
    } else if (role === 'admin' && (currentPage === 'user-dashboard' || currentPage === 'home')) {
      setCurrentPage('admin-dashboard');
    }
  };

  // Nav helper
  const navigateTo = (page: PageType, incidentId: string | null = null) => {
    setCurrentPage(page);
    if (incidentId !== undefined) {
      setSelectedIncidentId(incidentId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Fetch notifications for active user
  const fetchNotifications = async () => {
    try {
      const data = await apiClient.getNotifications(currentUser.id);
      setNotifications(data);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser, refreshTrigger]);

  const markNotificationAsRead = async (id: string) => {
    db.markNotificationRead(id);
    triggerRefresh();
  };

  const clearNotifications = async () => {
    db.clearAllNotifications(currentUser.id);
    triggerRefresh();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentPage,
        selectedIncidentId,
        notifications,
        unreadCount,
        refreshTrigger,
        aiAnalysisInProgress,
        setAiAnalysisInProgress,
        switchRole,
        navigateTo,
        triggerRefresh,
        markNotificationAsRead,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppContextProvider');
  return context;
};
