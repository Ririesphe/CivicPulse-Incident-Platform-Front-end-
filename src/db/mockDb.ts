import type { User, Incident, Report, AIAnalysis, IncidentUpdate, Feedback, Notification } from './schema';

const STORAGE_KEYS = {
  USERS: 'civicpulse_users',
  INCIDENTS: 'civicpulse_incidents',
  REPORTS: 'civicpulse_reports',
  AI_ANALYSIS: 'civicpulse_ai_analysis',
  UPDATES: 'civicpulse_updates',
  FEEDBACK: 'civicpulse_feedback',
  NOTIFICATIONS: 'civicpulse_notifications',
};

// Seed Users
const SEED_USERS: User[] = [
  {
    id: 'user-siphelele',
    name: 'Siphelele Malotana',
    email: 'siphelele@civicpulse.org',
    phone: '+27 82 123 4567',
    role: 'community',
    password: 'password123',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-responder',
    name: 'Officer Thabo Ndlovu',
    email: 'thabo.ndlovu@capetown.gov.za',
    phone: '+27 83 987 6543',
    role: 'response',
    password: 'password123',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-admin',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@civicpulse.org',
    phone: '+27 71 555 1234',
    role: 'admin',
    password: 'password123',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Seed Incidents
const SEED_INCIDENTS: Incident[] = [
  {
    id: 'CP-1042',
    title: 'Large pothole blocking lane near taxi rank',
    description: 'There is a large pothole near the taxi rank that is causing traffic and forcing drivers into the opposite lane.',
    category: 'Roads & Transport',
    severity: 'High',
    latitude: -33.9228,
    longitude: 18.4278,
    address: 'Darling St & Strand St, Cape Town CBD',
    status: 'Investigating',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_team: 'Cape Town Roads Dept',
    summary: 'High-priority road infrastructure issue affecting traffic near Cape Town CBD. 17 community reports indicate a recurring pothole approximately 300m from the submitted location.'
  },
  {
    id: 'CP-1043',
    title: 'Water pipe leak on pavement',
    description: 'Water is bubbling up from the pavement outside the shop and running down the street. It has been leaking for two days.',
    category: 'Water & Sanitation',
    severity: 'Medium',
    latitude: -33.9275,
    longitude: 18.4482,
    address: '142 Albert Rd, Woodstock',
    status: 'Assigned',
    created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    assigned_team: 'Cape Town Water & Sanitation',
    summary: 'Water leak reported in Woodstock near Albert Rd. 4 community reports have linked to this, indicating a broken pipe under the pavement.'
  },
  {
    id: 'CP-1044',
    title: 'Broken streetlight next to public park',
    description: 'Streetlight is completely out next to the public park, making it very dark and unsafe at night.',
    category: 'Electricity',
    severity: 'Low',
    latitude: -33.9358,
    longitude: 18.4715,
    address: 'Lower Main Rd & Station Rd, Observatory',
    status: 'Resolved',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_team: 'City Power Grid Team B',
    summary: 'Power issue affecting a streetlight on Lower Main Rd in Observatory. Resolved by replacing the bulb and correcting circuit wiring.'
  }
];

// Seed Reports (17 reports for CP-1042, 4 for CP-1043, 2 for CP-1044)
const seedReports = (): Report[] => {
  const reports: Report[] = [];
  const now = Date.now();

  // CP-1042 Reports (17 total)
  const cp1042Desc = [
    'Massive pothole outside taxi rank, cars swerving',
    'Huge pothole near CBD taxi rank causing traffic delays',
    'Dangerous hole in road on Darling St near rank',
    'Car tires getting damaged by pothole near taxi stand',
    'Traffic is backed up because cars are avoiding a big pothole near the rank',
    'Really bad pothole near taxi rank CBD',
    'Driver swerved into my lane to miss a pothole near taxi rank',
    'Road damage near taxi rank, needs urgent repair',
    'Deep road cavity outside taxi rank CBD',
    'Taxi rank road has a huge pothole, traffic nightmare',
    'Strand street corner Darling street pothole is growing daily',
    'Heavy traffic on Darling st, everyone slowing down for pothole',
    'Suspension damage warning: big pothole near rank',
    'Hole in tarmac CBD',
    'Taxi rank pothole is forcing cars into oncoming traffic!',
    'Pothole Darling street Cape Town',
    'Darling Street taxi rank road has collapsed in one lane'
  ];

  cp1042Desc.forEach((desc, idx) => {
    reports.push({
      id: `R-100${idx + 1}`,
      user_id: idx === 0 ? 'user-siphelele' : `user-community-${idx}`,
      incident_id: 'CP-1042',
      description: desc,
      latitude: -33.9228 + (Math.random() - 0.5) * 0.0015,
      longitude: 18.4278 + (Math.random() - 0.5) * 0.0015,
      address: 'Darling St & Strand St, Cape Town CBD',
      contact_name: idx === 0 ? 'Siphelele Malotana' : `Resident ${idx}`,
      contact_phone: idx === 0 ? '+27 82 123 4567' : `+27 82 000 00${idx}`,
      anonymous: idx % 3 === 0,
      image_url: idx === 0 ? 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600' : null,
      video_url: null,
      created_at: new Date(now - (3.5 - idx * 0.15) * 24 * 60 * 60 * 1000).toISOString(),
    });
  });

  // CP-1043 Reports (4 total)
  const cp1043Desc = [
    'Clean water flowing on the road outside Albert Road shop',
    'Water pipe burst Woodstock',
    'Water leak next to Albert Road sidewalk, running into gutter',
    'Clean water wasting in Albert Rd'
  ];
  cp1043Desc.forEach((desc, idx) => {
    reports.push({
      id: `R-200${idx + 1}`,
      user_id: `user-community-w-${idx}`,
      incident_id: 'CP-1043',
      description: desc,
      latitude: -33.9275 + (Math.random() - 0.5) * 0.001,
      longitude: 18.4482 + (Math.random() - 0.5) * 0.001,
      address: '142 Albert Rd, Woodstock',
      contact_name: `Woodstock Local ${idx}`,
      contact_phone: `+27 72 000 01${idx}`,
      anonymous: false,
      image_url: idx === 0 ? 'https://images.unsplash.com/photo-1542013936693-8848e574047e?auto=format&fit=crop&q=80&w=600' : null,
      video_url: null,
      created_at: new Date(now - (2 - idx * 0.3) * 24 * 60 * 60 * 1000).toISOString(),
    });
  });

  // CP-1044 Reports (2 total)
  const cp1044Desc = [
    'Streetlight out near Lower Main road park',
    'Dark corner at Lower Main / Station Rd streetlight is broken'
  ];
  cp1044Desc.forEach((desc, idx) => {
    reports.push({
      id: `R-300${idx + 1}`,
      user_id: `user-community-o-${idx}`,
      incident_id: 'CP-1044',
      description: desc,
      latitude: -33.9358 + (Math.random() - 0.5) * 0.0005,
      longitude: 18.4715 + (Math.random() - 0.5) * 0.0005,
      address: 'Lower Main Rd & Station Rd, Observatory',
      contact_name: `Obs Resident ${idx}`,
      contact_phone: `+27 61 000 02${idx}`,
      anonymous: idx === 1,
      image_url: null,
      video_url: null,
      created_at: new Date(now - (5.5 - idx * 0.5) * 24 * 60 * 60 * 1000).toISOString(),
    });
  });

  return reports;
};

// Seed Updates
const SEED_UPDATES: IncidentUpdate[] = [
  // CP-1042
  {
    id: 'U-101',
    incident_id: 'CP-1042',
    status: 'Reported',
    message: 'Incident reported by Siphelele Malotana. Relational analysis pending.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'System AI'
  },
  {
    id: 'U-102',
    incident_id: 'CP-1042',
    status: 'AI Verified',
    message: 'AI engine verified description and linked 17 duplicate reports. Severity flagged as HIGH due to traffic threat and collision risk. Confidence score: 94%.',
    created_at: new Date(Date.now() - 2.8 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'System AI'
  },
  {
    id: 'U-103',
    incident_id: 'CP-1042',
    status: 'Assigned',
    message: 'Incident assigned to Cape Town Roads Dept. Dispatched field crew for survey.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'Sarah Jenkins (Admin)'
  },
  {
    id: 'U-104',
    incident_id: 'CP-1042',
    status: 'Investigating',
    message: 'Field technician inspected. Confirmed 1.2m wide, 15cm deep pothole close to taxi entrance. Temporary traffic cones deployed. Permanent patching scheduled.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'Officer Thabo Ndlovu'
  },

  // CP-1043
  {
    id: 'U-201',
    incident_id: 'CP-1043',
    status: 'Reported',
    message: 'Water leak reported. Flowing on pavement.',
    created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'System AI'
  },
  {
    id: 'U-202',
    incident_id: 'CP-1043',
    status: 'AI Verified',
    message: 'AI verified category as Water & Sanitation. Gained 4 linking reports.',
    created_at: new Date(Date.now() - 1.4 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'System AI'
  },
  {
    id: 'U-203',
    incident_id: 'CP-1043',
    status: 'Assigned',
    message: 'Assigned to Cape Town Water & Sanitation. Standard 48h turnaround time.',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    author_name: 'Sarah Jenkins (Admin)'
  },

  // CP-1044
  {
    id: 'U-301',
    incident_id: 'CP-1044',
    status: 'Reported',
    message: 'Broken streetlight next to park.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'System AI'
  },
  {
    id: 'U-302',
    incident_id: 'CP-1044',
    status: 'AI Verified',
    message: 'AI Verified. Identified low severity. Linked 2 community reports.',
    created_at: new Date(Date.now() - 4.8 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'System AI'
  },
  {
    id: 'U-303',
    incident_id: 'CP-1044',
    status: 'Assigned',
    message: 'Assigned to City Power Grid Team B.',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'Sarah Jenkins'
  },
  {
    id: 'U-304',
    incident_id: 'CP-1044',
    status: 'In Progress',
    message: 'Crew replaced fixture bulb and inspected fuse box.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'Officer Thabo Ndlovu'
  },
  {
    id: 'U-305',
    incident_id: 'CP-1044',
    status: 'Resolved',
    message: 'Streetlight fully operational. Area safety restored.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'Officer Thabo Ndlovu'
  }
];

// Seed Feedbacks (for CP-1044 which is Resolved)
const SEED_FEEDBACKS: Feedback[] = [
  {
    id: 'F-301',
    incident_id: 'CP-1044',
    user_id: 'user-community-o-0',
    resolved_status: 'Yes',
    rating: 5,
    comment: 'Thanks for fixing this! The park is much safer to walk past at night now.',
    created_at: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Seed Notifications
const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'N-101',
    user_id: 'user-siphelele',
    title: 'Report Received',
    message: 'Your report regarding the CBD taxi rank pothole has been logged as R-1001.',
    type: 'success',
    read: true,
    incident_id: 'CP-1042',
    created_at: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'N-102',
    user_id: 'user-siphelele',
    title: 'AI Verification Complete',
    message: 'AI analyzed your report R-1001 and mapped it to existing Incident CP-1042.',
    type: 'info',
    read: false,
    incident_id: 'CP-1042',
    created_at: new Date(Date.now() - 2.8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'N-103',
    user_id: 'user-siphelele',
    title: 'Incident Update',
    message: 'Incident CP-1042 status changed to: Investigating.',
    type: 'info',
    read: false,
    incident_id: 'CP-1042',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Seed AI Analysis
const SEED_AI_ANALYSIS: AIAnalysis[] = [
  {
    id: 'AI-101',
    report_id: 'R-1001',
    category: 'Roads & Transport',
    severity: 'High',
    confidence: 94,
    summary: 'Road damage blocking lane on Darling St Cape Town CBD. Swerving risk identified.',
    duplicate_score: 0.92,
    possible_duplicate_id: 'CP-1042',
    created_at: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initializeDb = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INCIDENTS)) {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(SEED_INCIDENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(seedReports()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.UPDATES)) {
    localStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(SEED_UPDATES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(SEED_FEEDBACKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AI_ANALYSIS)) {
    localStorage.setItem(STORAGE_KEYS.AI_ANALYSIS, JSON.stringify(SEED_AI_ANALYSIS));
  }
};

// Database Getter/Setter Helpers
export const db = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUser: (user: User) => {
    const list = db.getUsers();
    list.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
  },
  
  getIncidents: (): Incident[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]'),
  saveIncident: (incident: Incident) => {
    const list = db.getIncidents();
    const idx = list.findIndex(i => i.id === incident.id);
    if (idx >= 0) list[idx] = incident;
    else list.push(incident);
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(list));
  },

  getReports: (): Report[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]'),
  saveReport: (report: Report) => {
    const list = db.getReports();
    const idx = list.findIndex(r => r.id === report.id);
    if (idx >= 0) list[idx] = report;
    else list.push(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
  },

  getAIAnalyses: (): AIAnalysis[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.AI_ANALYSIS) || '[]'),
  saveAIAnalysis: (analysis: AIAnalysis) => {
    const list = db.getAIAnalyses();
    list.push(analysis);
    localStorage.setItem(STORAGE_KEYS.AI_ANALYSIS, JSON.stringify(list));
  },

  getUpdates: (): IncidentUpdate[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.UPDATES) || '[]'),
  saveUpdate: (update: IncidentUpdate) => {
    const list = db.getUpdates();
    list.push(update);
    localStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(list));
  },

  getFeedbacks: (): Feedback[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || '[]'),
  saveFeedback: (feedback: Feedback) => {
    const list = db.getFeedbacks();
    list.push(feedback);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(list));
  },

  getNotifications: (): Notification[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'),
  saveNotification: (notif: Notification) => {
    const list = db.getNotifications();
    list.push(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },
  markNotificationRead: (id: string) => {
    const list = db.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) item.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },
  clearAllNotifications: (userId: string) => {
    const list = db.getNotifications();
    const updated = list.map(n => n.user_id === userId ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }
};
