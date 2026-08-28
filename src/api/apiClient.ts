import type { Incident, Report, AIAnalysis, IncidentUpdate, Feedback, Notification } from '../db/schema';

// Placeholder for Ntando's backend API URL
// In development, this could be http://localhost:3000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }
  return response.json();
};

export const apiClient = {
  login: async (credentials: { email: string; password?: string }): Promise<{ user: import('../db/schema').User; token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await handleResponse(response);
    } catch (error) {
      throw new Error("Backend not available for login.");
    }
  },

  register: async (userData: any): Promise<{ user: import('../db/schema').User; token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await handleResponse(response);
    } catch (error) {
      throw new Error("Backend not available for registration.");
    }
  },

  getIncidents: async (): Promise<Incident[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents`);
      return await handleResponse(response);
    } catch (error) {
      console.warn("Backend not connected yet. Returning empty incidents array.");
      return [];
    }
  },

  getIncidentById: async (id: string): Promise<Incident | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/${id}`);
      if (response.status === 404) return null;
      return await handleResponse(response);
    } catch (error) {
       console.warn("Backend not connected yet.");
       return null;
    }
  },

  getReportsForIncident: async (incidentId: string): Promise<Report[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}/reports`);
      return await handleResponse(response);
    } catch (error) {
      return [];
    }
  },

  getUpdatesForIncident: async (incidentId: string): Promise<IncidentUpdate[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}/updates`);
      return await handleResponse(response);
    } catch (error) {
      return [];
    }
  },

  getFeedbackForIncident: async (incidentId: string): Promise<Feedback[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}/feedback`);
      return await handleResponse(response);
    } catch (error) {
      return [];
    }
  },

  // Perform AI Triaging -> now handled by backend
  analyzeReport: async (reportData: {
    description: string;
    latitude: number;
    longitude: number;
    address: string;
  }): Promise<AIAnalysis> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      return await handleResponse(response);
    } catch (error) {
      throw new Error("Backend not available to analyze report.");
    }
  },

  // Submit report flow
  submitReport: async (reportData: {
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    contactName: string;
    contactPhone: string;
    anonymous: boolean;
    imageUrl: string | null;
    videoUrl: string | null;
    userId: string;
  }, aiResult: AIAnalysis, linkToExistingId: string | null): Promise<{ report: Report; incident: Incident }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reportData, aiResult, linkToExistingId })
      });
      return await handleResponse(response);
    } catch (error) {
      throw new Error("Backend not available to submit report.");
    }
  },

  // Update incident status (for Response Team and Admin)
  updateIncidentStatus: async (
    incidentId: string, 
    status: Incident['status'], 
    message: string, 
    assignedTeam?: string,
    authorName: string = 'Officer Thabo Ndlovu'
  ): Promise<Incident> => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, message, assignedTeam, authorName })
      });
      return await handleResponse(response);
    } catch (error) {
      throw new Error("Backend not available to update status.");
    }
  },

  // Submit Feedback (for Community User)
  submitFeedback: async (feedbackData: {
    incidentId: string;
    userId: string;
    resolvedStatus: 'Yes' | 'Partially' | 'No';
    rating: number;
    comment: string;
  }): Promise<Feedback> => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      return await handleResponse(response);
    } catch (error) {
       throw new Error("Backend not available to submit feedback.");
    }
  },

  // Fetch Notifications
  getNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/notifications`);
      return await handleResponse(response);
    } catch (error) {
      return [];
    }
  },

  markNotificationRead: async (notificationId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      await handleResponse(response);
    } catch (error) {
      // ignore
    }
  },

  clearAllNotifications: async (userId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/notifications`, {
        method: 'DELETE'
      });
      await handleResponse(response);
    } catch (error) {
      // ignore
    }
  }
};
