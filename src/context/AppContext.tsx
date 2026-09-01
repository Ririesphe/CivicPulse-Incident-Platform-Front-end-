import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Notification } from '../db/schema';
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
  | 'ai-analysis'
  | 'login'
  | 'register'
  | 'forgot-password';

interface AppContextProps {
  currentUser: User | null;
  currentPage: PageType;
  selectedIncidentId: string | null;
  notifications: Notification[];
  unreadCount: number;
  refreshTrigger: number;
  aiAnalysisInProgress: boolean;
  setAiAnalysisInProgress: (val: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  navigateTo: (page: PageType, incidentId?: string | null) => void;
  triggerRefresh: () => void;
  markNotificationAsRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [aiAnalysisInProgress, setAiAnalysisInProgress] = useState<boolean>(false);

  const login = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') navigateTo('admin-dashboard');
    else if (user.role === 'response') navigateTo('incidents');
    else navigateTo('user-dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    navigateTo('home');
  };

  const navigateTo = (page: PageType, incidentId: string | null = null) => {
    // Protected routes logic
    const protectedPages: PageType[] = ['report', 'user-dashboard', 'admin-dashboard', 'incident-details', 'ai-analysis'];
    
    if (!currentUser && protectedPages.includes(page)) {
      setCurrentPage('login');
      if (incidentId !== null) setSelectedIncidentId(incidentId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    if (incidentId !== undefined) {
      setSelectedIncidentId(incidentId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const fetchNotifications = async () => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
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
    await apiClient.markNotificationRead(id);
    triggerRefresh();
  };

  const clearNotifications = async () => {
    if (!currentUser) return;
    await apiClient.clearAllNotifications(currentUser.id);
    triggerRefresh();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentPage,
        selectedIncidentId,
        notifications,
        unreadCount,
        refreshTrigger,
        aiAnalysisInProgress,
        setAiAnalysisInProgress,
        login,
        logout,
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
