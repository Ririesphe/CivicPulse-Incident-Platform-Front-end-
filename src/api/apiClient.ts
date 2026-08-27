import { db } from '../db/mockDb';
import type { Incident, Report, AIAnalysis, IncidentUpdate, Feedback, Notification } from '../db/schema';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple Haversine formula to compute distance in kilometers between two points
const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Simple Jaccard similarity for description texts
const getJaccardSimilarity = (text1: string, text2: string): number => {
  const getWords = (t: string) => {
    return new Set(
      t.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3) // Filter short stop words
    );
  };
  const set1 = getWords(text1);
  const set2 = getWords(text2);
  
  if (set1.size === 0 || set2.size === 0) return 0;
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

export const apiClient = {
  getIncidents: async (): Promise<Incident[]> => {
    await delay(600);
    return db.getIncidents().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getIncidentById: async (id: string): Promise<Incident | null> => {
    await delay(300);
    const incidents = db.getIncidents();
    return incidents.find(i => i.id === id) || null;
  },

  getReportsForIncident: async (incidentId: string): Promise<Report[]> => {
    await delay(300);
    const reports = db.getReports();
    return reports.filter(r => r.incident_id === incidentId);
  },

  getUpdatesForIncident: async (incidentId: string): Promise<IncidentUpdate[]> => {
    await delay(300);
    const updates = db.getUpdates();
    return updates
      .filter(u => u.incident_id === incidentId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  getFeedbackForIncident: async (incidentId: string): Promise<Feedback[]> => {
    await delay(200);
    const feedbacks = db.getFeedbacks();
    return feedbacks.filter(f => f.incident_id === incidentId);
  },

  // Perform Simulated AI Triaging
  analyzeReport: async (reportData: {
    description: string;
    latitude: number;
    longitude: number;
    address: string;
  }): Promise<AIAnalysis> => {
    await delay(2000); // Give a realistic AI processing duration

    const text = reportData.description.toLowerCase();
    
    // 1. Classification
    let category = 'Other';
    if (text.match(/pothole|road|tarmac|street|lane|traffic|cars swerving|suspension/)) {
      category = 'Roads & Transport';
    } else if (text.match(/leak|water|pipe|sewer|drain|burst|bubbling|waste water/)) {
      category = 'Water & Sanitation';
    } else if (text.match(/electricity|power|lights|light|streetlight|cable|outage|load shedding|transformer/)) {
      category = 'Electricity';
    } else if (text.match(/dumping|rubbish|refuse|waste|trash|bin|litter|garbage/)) {
      category = 'Waste Management';
    } else if (text.match(/crime|safety|robbery|theft|mugging|assault|police|security|hijack/)) {
      category = 'Public Safety';
    } else if (text.match(/bridge|collapse|infrastructure|fence|rail/)) {
      category = 'Infrastructure';
    } else if (text.match(/fire|smoke|burning|veld|flames/)) {
      category = 'Environment';
    }

    // 2. Severity Detection
    let severity: Incident['severity'] = 'Medium';
    if (text.match(/swerving|danger|accident|injured|head-on|collision|critical|explosion|fire|bursting/)) {
      severity = 'High';
    } else if (text.match(/dark|nuisance|slow|minor/)) {
      severity = 'Low';
    } else if (text.match(/immediate threat|hazard|blocking highway/)) {
      severity = 'Critical';
    }

    // 3. Duplicate Detection & Entity Extraction
    const incidents = db.getIncidents();
    let bestMatchId: string | null = null;
    let maxScore = 0;

    for (const inc of incidents) {
      if (inc.status === 'Closed' || inc.status === 'Resolved') continue;

      // Geolocation check (within 400 meters)
      const dist = getDistanceKm(reportData.latitude, reportData.longitude, inc.latitude, inc.longitude);
      
      // Text Similarity Check
      const simScore = getJaccardSimilarity(reportData.description, inc.description);
      
      // Category match boost
      const catMatch = inc.category === category;
      
      let combinedScore = 0;
      if (dist < 0.4 && catMatch) {
        combinedScore = 0.5 + simScore * 0.5; // Base boost for proximity & same category
      } else if (dist < 0.4) {
        combinedScore = 0.2 + simScore * 0.5;
      } else if (catMatch) {
        combinedScore = simScore * 0.6;
      }

      if (combinedScore > maxScore) {
        maxScore = combinedScore;
        bestMatchId = inc.id;
      }
    }

    // Confidence mapping
    const baseConfidence = 75 + Math.floor(Math.random() * 20);
    const confidence = bestMatchId && maxScore > 0.5 ? Math.max(90, baseConfidence) : baseConfidence;

    // AI Summary Generation
    let summary = `Potential ${severity.toLowerCase()}-priority ${category.toLowerCase()} concern near ${reportData.address.split(',')[0]}.`;
    if (bestMatchId && maxScore > 0.5) {
      const reportCount = db.getReports().filter(r => r.incident_id === bestMatchId).length;
      summary = `${severity} severity ${category.toLowerCase()} issue affecting community near ${reportData.address.split(',')[0]}. Relates closely to incident ${bestMatchId} which has accumulated ${reportCount} community reports.`;
    }

    return {
      id: `AI-${Math.floor(Math.random() * 90000) + 10000}`,
      report_id: '', // set during submission
      category,
      severity,
      confidence,
      summary,
      duplicate_score: parseFloat(maxScore.toFixed(2)),
      possible_duplicate_id: maxScore > 0.5 ? bestMatchId : null,
      created_at: new Date().toISOString()
    };
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
    await delay(800);

    const reportId = `R-${Math.floor(Math.random() * 9000) + 1000}`;
    let incidentId = linkToExistingId;
    let incident: Incident;

    const report: Report = {
      id: reportId,
      user_id: reportData.userId,
      incident_id: null, // will update below
      description: reportData.description,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      address: reportData.address,
      contact_name: reportData.contactName,
      contact_phone: reportData.contactPhone,
      anonymous: reportData.anonymous,
      image_url: reportData.imageUrl,
      video_url: reportData.videoUrl,
      created_at: new Date().toISOString(),
    };

    // If linking to existing incident
    if (incidentId) {
      const incidents = db.getIncidents();
      const existing = incidents.find(i => i.id === incidentId);
      if (existing) {
        report.incident_id = incidentId;
        
        // Update incident stats: increase reports count by updating title/summary or just metadata
        // In full DB, reports count is a COUNT() query on reports table, so we just link the report.
        existing.updated_at = new Date().toISOString();
        db.saveIncident(existing);
        incident = existing;
      } else {
        // Fallback: create new if not found
        incidentId = `CP-${Math.floor(Math.random() * 900) + 1100}`;
        report.incident_id = incidentId;
        incident = {
          id: incidentId,
          title: reportData.description.slice(0, 50) + (reportData.description.length > 50 ? '...' : ''),
          description: reportData.description,
          category: aiResult.category,
          severity: aiResult.severity,
          latitude: reportData.latitude,
          longitude: reportData.longitude,
          address: reportData.address,
          status: 'Reported',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          assigned_team: 'Unassigned Team',
          summary: aiResult.summary,
        };
        db.saveIncident(incident);
      }
    } else {
      // Create a brand new incident
      incidentId = `CP-${Math.floor(Math.random() * 900) + 1100}`;
      report.incident_id = incidentId;
      incident = {
        id: incidentId,
        title: reportData.description.slice(0, 50) + (reportData.description.length > 50 ? '...' : ''),
        description: reportData.description,
        category: aiResult.category,
        severity: aiResult.severity,
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        address: reportData.address,
        status: 'Reported',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assigned_team: 'Unassigned Team',
        summary: aiResult.summary,
      };
      db.saveIncident(incident);
    }

    // Save report
    db.saveReport(report);

    // Save AI assessment
    aiResult.report_id = reportId;
    db.saveAIAnalysis(aiResult);

    // Add first timeline update
    const initUpdate: IncidentUpdate = {
      id: `U-${Math.floor(Math.random() * 9000) + 1000}`,
      incident_id: incidentId,
      status: 'Reported',
      message: `Report logged via CivicPulse web. AI classification assigned: ${aiResult.category}. Severity level: ${aiResult.severity}.`,
      created_at: new Date().toISOString(),
      author_name: 'System AI'
    };
    db.saveUpdate(initUpdate);

    // AI Verified Update
    const verifiedUpdate: IncidentUpdate = {
      id: `U-${Math.floor(Math.random() * 9000) + 1000}`,
      incident_id: incidentId,
      status: 'AI Verified',
      message: `AI analysis complete. Confidence: ${aiResult.confidence}%. Proximity audit scan detected no active conflicts. Summary generated successfully.`,
      created_at: new Date(Date.now() + 5000).toISOString(), // 5s later
      author_name: 'System AI'
    };
    db.saveUpdate(verifiedUpdate);

    // Create notifications for the user
    const welcomeNotif: Notification = {
      id: `N-${Math.floor(Math.random() * 9000) + 1000}`,
      user_id: reportData.userId,
      title: 'Report Received',
      message: `Your report regarding "${reportData.description.slice(0, 30)}..." has been filed as ${reportId}.`,
      type: 'success',
      read: false,
      incident_id: incidentId,
      created_at: new Date().toISOString()
    };
    db.saveNotification(welcomeNotif);

    return { report, incident };
  },

  // Update incident status (for Response Team and Admin)
  updateIncidentStatus: async (
    incidentId: string, 
    status: Incident['status'], 
    message: string, 
    assignedTeam?: string,
    authorName: string = 'Officer Thabo Ndlovu'
  ): Promise<Incident> => {
    await delay(600);
    const incidents = db.getIncidents();
    const idx = incidents.findIndex(i => i.id === incidentId);
    if (idx < 0) throw new Error('Incident not found');

    const inc = incidents[idx];
    inc.status = status;
    inc.updated_at = new Date().toISOString();
    if (assignedTeam) {
      inc.assigned_team = assignedTeam;
    }

    db.saveIncident(inc);

    // Write update log
    const update: IncidentUpdate = {
      id: `U-${Math.floor(Math.random() * 9000) + 1000}`,
      incident_id: incidentId,
      status,
      message: message || `Incident status updated to ${status}.`,
      created_at: new Date().toISOString(),
      author_name: authorName,
    };
    db.saveUpdate(update);

    // Notify any community members who reported this incident
    const reports = db.getReports().filter(r => r.incident_id === incidentId);
    const userIds = Array.from(new Set(reports.map(r => r.user_id)));

    userIds.forEach(userId => {
      const notif: Notification = {
        id: `N-${Math.floor(Math.random() * 9000) + 1000}`,
        user_id: userId,
        title: `Incident Update: ${status}`,
        message: `Incident ${incidentId} has been updated to: ${status}. "${message}"`,
        type: status === 'Resolved' ? 'success' : 'info',
        read: false,
        incident_id: incidentId,
        created_at: new Date().toISOString()
      };
      db.saveNotification(notif);
    });

    return inc;
  },

  // Submit Feedback (for Community User)
  submitFeedback: async (feedbackData: {
    incidentId: string;
    userId: string;
    resolvedStatus: 'Yes' | 'Partially' | 'No';
    rating: number;
    comment: string;
  }): Promise<Feedback> => {
    await delay(500);

    const feedback: Feedback = {
      id: `F-${Math.floor(Math.random() * 9000) + 1000}`,
      incident_id: feedbackData.incidentId,
      user_id: feedbackData.userId,
      resolved_status: feedbackData.resolvedStatus,
      rating: feedbackData.rating,
      comment: feedbackData.comment,
      created_at: new Date().toISOString()
    };

    db.saveFeedback(feedback);

    // Auto update incident to 'Closed' if feedback is 'Yes' (Fully Resolved)
    if (feedbackData.resolvedStatus === 'Yes') {
      const incidents = db.getIncidents();
      const inc = incidents.find(i => i.id === feedbackData.incidentId);
      if (inc && inc.status === 'Resolved') {
        inc.status = 'Closed';
        inc.updated_at = new Date().toISOString();
        db.saveIncident(inc);

        // Add update log
        const update: IncidentUpdate = {
          id: `U-${Math.floor(Math.random() * 9000) + 1000}`,
          incident_id: feedbackData.incidentId,
          status: 'Closed',
          message: 'Incident closed based on positive community feedback.',
          created_at: new Date().toISOString(),
          author_name: 'System AI'
        };
        db.saveUpdate(update);
      }
    }

    return feedback;
  },

  // Fetch Notifications
  getNotifications: async (userId: string): Promise<Notification[]> => {
    await delay(100);
    return db.getNotifications()
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
};
