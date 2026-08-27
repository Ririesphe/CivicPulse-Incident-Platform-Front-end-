export type UserRole = 'community' | 'response' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  created_at: string;
}

export interface Incident {
  id: string; // e.g. "CP-1042"
  title: string;
  description: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  latitude: number;
  longitude: number;
  address: string;
  status: 'Reported' | 'AI Verified' | 'Assigned' | 'Investigating' | 'In Progress' | 'Resolved' | 'Closed';
  created_at: string;
  updated_at: string;
  assigned_team: string; // e.g. "Cape Town Roads Dept"
  summary: string; // AI generated summary
}

export interface Report {
  id: string;
  user_id: string;
  incident_id: string | null; // Null if not assigned to any incident yet (e.g. during duplicate analysis)
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  contact_name: string;
  contact_phone: string;
  anonymous: boolean;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
}

export interface AIAnalysis {
  id: string;
  report_id: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number; // e.g. 94 (meaning 94%)
  summary: string;
  duplicate_score: number; // e.g. 0.85
  possible_duplicate_id: string | null; // ID of potential duplicate incident
  created_at: string;
}

export interface IncidentUpdate {
  id: string;
  incident_id: string;
  status: Incident['status'];
  message: string;
  created_at: string;
  author_name: string;
}

export interface Feedback {
  id: string;
  incident_id: string;
  user_id: string;
  resolved_status: 'Yes' | 'Partially' | 'No';
  rating: number; // 1-5 stars
  comment: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  incident_id?: string;
  created_at: string;
}
