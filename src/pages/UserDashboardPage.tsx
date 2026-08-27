import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/mockDb';
import type { Report, Incident } from '../db/schema';
import { Calendar, MapPin, FileText, ChevronRight } from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { currentUser, navigateTo, refreshTrigger } = useApp();
  
  if (!currentUser) return null;

  const [userReports, setUserReports] = useState<Report[]>([]);
  const [incidentsMap, setIncidentsMap] = useState<Record<string, Incident>>({});

  useEffect(() => {
    const reports = db.getReports().filter(r => r.user_id === currentUser.id);
    setUserReports(reports);

    // Build mapping incident details
    const incs = db.getIncidents();
    const mapping: Record<string, Incident> = {};
    incs.forEach(inc => {
      mapping[inc.id] = inc;
    });
    setIncidentsMap(mapping);
  }, [currentUser, refreshTrigger]);

  return (
    <div className="user-dashboard container" style={{ padding: '40px 16px', maxWidth: '850px' }}>
      
      {/* Welcome Message */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0 }}>My Civic Workspace</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Track progress on reports you have filed in your neighborhood.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigateTo('report')}>
          Report New Incident
        </button>
      </div>

      {/* Info card profile */}
      <div className="form-card" style={{ margin: '0 0 24px 0', padding: '16px 20px', backgroundColor: 'var(--color-off-white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Reporter Profile</span>
            <h4 style={{ margin: '2px 0 0', fontSize: '1rem' }}>{currentUser.name}</h4>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            📧 {currentUser.email} • 📞 {currentUser.phone}
          </div>
        </div>
      </div>

      {/* Reports history */}
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Filed Reports ({userReports.length})</h3>
      </div>

      {userReports.length === 0 ? (
        <div style={{ padding: '60px 20px', border: '1px solid var(--color-sand)', borderRadius: '6px', backgroundColor: 'var(--color-white)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <FileText size={40} style={{ margin: '0 auto 12px', color: 'var(--color-sand-dark)' }} />
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-charcoal)' }}>You haven't logged any incidents</p>
          <p style={{ margin: '4px 0 20px', fontSize: '0.82rem' }}>Help improve your neighborhood by reporting roads, water, or electricity concerns.</p>
          <button className="btn btn-primary btn-sm" onClick={() => navigateTo('report')}>
            File First Report
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {userReports.map((report) => {
            // Find corresponding incident
            const incident = report.incident_id ? incidentsMap[report.incident_id] : null;
            const status = incident ? incident.status : 'Reported';
            const assignedTeam = incident ? incident.assigned_team : 'Unassigned';
            
            // Get latest update message
            const relatedUpdates = db.getUpdates().filter(u => u.incident_id === report.incident_id);
            const latestUpdate = relatedUpdates.length > 0 
              ? relatedUpdates[relatedUpdates.length - 1] 
              : null;

            const date = new Date(report.created_at).toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div 
                key={report.id}
                onClick={() => report.incident_id && navigateTo('incident-details', report.incident_id)}
                className="form-card table-row-hover" 
                style={{ 
                  margin: 0, 
                  cursor: report.incident_id ? 'pointer' : 'default', 
                  border: '1px solid var(--color-sand)',
                  transition: 'transform 0.15s, border-color 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-sand-dark)' }}>REPORT ID: {report.id}</span>
                    {report.incident_id && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>• Incident ID: {report.incident_id}</span>
                    )}
                  </div>
                  <span className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
                    {status}
                  </span>
                </div>

                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>
                  {report.description.slice(0, 80)}{report.description.length > 80 ? '...' : ''}
                </h4>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span>Logged on {date}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} />
                    <span>{report.address.split(',')[0]}</span>
                  </span>
                  {assignedTeam && (
                    <span>• Assigned: <b>{assignedTeam}</b></span>
                  )}
                </div>

                {latestUpdate && (
                  <div style={{ borderTop: '1px solid var(--color-sand-light)', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-charcoal)', lineHeight: 1.4 }}>
                      🔊 <strong>Latest Update ({latestUpdate.status}):</strong> "{latestUpdate.message.slice(0, 100)}{latestUpdate.message.length > 100 ? '...' : ''}"
                    </p>
                    <ChevronRight size={16} style={{ color: 'var(--color-sand-dark)', flexShrink: 0, marginLeft: '8px' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default UserDashboardPage;
