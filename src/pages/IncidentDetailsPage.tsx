import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import type { Incident, Report, IncidentUpdate, Feedback } from '../db/schema';
import LeafletMap from '../components/LeafletMap';
import { 
  Users, Shield, 
  MapPin, CheckCircle2, Star, Send, Award, RefreshCw
} from 'lucide-react';

export const IncidentDetailsPage: React.FC = () => {
  const { selectedIncidentId, currentRole, currentUser, navigateTo, refreshTrigger } = useApp();
  
  const [incident, setIncident] = useState<Incident | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [updates, setUpdates] = useState<IncidentUpdate[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Response Controls State
  const [newStatus, setNewStatus] = useState<Incident['status']>('Investigating');
  const [assignedTeam, setAssignedTeam] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Feedback State
  const [feedbackResolved, setFeedbackResolved] = useState<'Yes' | 'Partially' | 'No'>('Yes');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const loadDetails = async () => {
    if (!selectedIncidentId) return;
    setLoading(true);
    try {
      const incData = await apiClient.getIncidentById(selectedIncidentId);
      if (incData) {
        setIncident(incData);
        setNewStatus(incData.status);
        setAssignedTeam(incData.assigned_team || '');
        
        const reps = await apiClient.getReportsForIncident(selectedIncidentId);
        setReports(reps);
        
        const ups = await apiClient.getUpdatesForIncident(selectedIncidentId);
        setUpdates(ups);

        const fbs = await apiClient.getFeedbackForIncident(selectedIncidentId);
        setFeedbacks(fbs);
      }
    } catch (e) {
      console.error('Error loading details:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [selectedIncidentId, refreshTrigger]);

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident) return;
    setUpdatingStatus(true);
    
    try {
      await apiClient.updateIncidentStatus(
        incident.id,
        newStatus,
        statusMessage || `Status changed to ${newStatus}.`,
        assignedTeam,
        currentUser.name
      );
      setStatusMessage('');
      loadDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident) return;
    setSubmittingFeedback(true);

    try {
      await apiClient.submitFeedback({
        incidentId: incident.id,
        userId: currentUser.id,
        resolvedStatus: feedbackResolved,
        rating: feedbackRating,
        comment: feedbackComment
      });
      setFeedbackComment('');
      loadDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (!selectedIncidentId) {
    return (
      <div className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
        <p>No incident selected. <button className="btn btn-secondary" onClick={() => navigateTo('incidents')}>Back to Registry</button></p>
      </div>
    );
  }

  if (loading || !incident) {
    return (
      <div className="container" style={{ padding: '60px 16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <RefreshCw className="spin-animation" size={32} style={{ margin: '0 auto 12px' }} />
        <span>Loading incident details...</span>
      </div>
    );
  }

  const timelineSteps: Incident['status'][] = [
    'Reported',
    'AI Verified',
    'Assigned',
    'Investigating',
    'In Progress',
    'Resolved',
    'Closed'
  ];

  const currentStepIdx = timelineSteps.indexOf(incident.status);

  // Find image from reports list
  const reportWithImage = reports.find(r => r.image_url);
  const imagePreview = reportWithImage ? reportWithImage.image_url : null;

  // Check if current user has already submitted feedback
  const userFeedback = feedbacks.find(f => f.user_id === currentUser.id);

  return (
    <div className="incident-details-page container" style={{ padding: '40px 16px' }}>
      
      {/* Back CTA */}
      <button 
        className="btn btn-secondary btn-sm" 
        onClick={() => navigateTo(currentRole === 'admin' ? 'admin-dashboard' : currentRole === 'response' ? 'incidents' : 'user-dashboard')}
        style={{ marginBottom: '20px' }}
      >
        ← Back to Dashboard
      </button>

      {/* Header Info */}
      <div className="details-header-card" style={{ border: '1px solid var(--color-sand)', borderRadius: '6px', padding: '24px', backgroundColor: 'var(--color-white)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-sand-dark)', letterSpacing: '0.05em' }}>
                INCIDENT ID: {incident.id}
              </span>
              <span className={`status-badge status-${incident.status.toLowerCase().replace(' ', '-')}`}>
                {incident.status}
              </span>
            </div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>{incident.title}</h1>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} />
              <span>{incident.address}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="meta-info-box">
              <span className="box-label">Category</span>
              <span className="box-val">{incident.category}</span>
            </div>
            <div className="meta-info-box">
              <span className="box-label">Severity</span>
              <span className="box-val" style={{ color: incident.severity === 'High' || incident.severity === 'Critical' ? 'var(--color-terracotta)' : 'inherit' }}>
                {incident.severity}
              </span>
            </div>
            <div className="meta-info-box">
              <span className="box-label">Community Impact</span>
              <span className="box-val" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} style={{ color: 'var(--color-sand-dark)' }} />
                <span>{reports.length} Reports</span>
              </span>
            </div>
          </div>
        </div>

        {/* Visual Timeline Stepper */}
        <div className="timeline-stepper-wrapper" style={{ marginTop: '32px', borderTop: '1px solid var(--color-sand-light)', paddingTop: '24px' }}>
          <div className="timeline-stepper" style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            
            {/* Background line */}
            <div className="stepper-line" style={{ 
              position: 'absolute', 
              top: '12px', 
              left: '4%', 
              right: '4%', 
              height: '3px', 
              backgroundColor: 'var(--color-sand)', 
              zIndex: 1 
            }}>
              <div className="stepper-line-fill" style={{ 
                height: '100%', 
                backgroundColor: 'var(--color-green)', 
                width: `${(currentStepIdx / (timelineSteps.length - 1)) * 100}%`,
                transition: 'width 0.4s ease'
              }} />
            </div>

            {timelineSteps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;

              let dotBg = 'var(--color-white)';
              let dotBorder = '2px solid var(--color-sand-dark)';
              let textColor = 'var(--color-text-muted)';

              if (isPast) {
                dotBg = 'var(--color-green-light)';
                dotBorder = '2px solid var(--color-green)';
                textColor = 'var(--color-charcoal)';
              } else if (isActive) {
                dotBg = 'var(--color-green)';
                dotBorder = '2px solid var(--color-green)';
                textColor = 'var(--color-charcoal)';
              }

              return (
                <div key={step} className="stepper-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative', width: '12%' }}>
                  <div className={`stepper-dot ${isActive ? 'active' : ''}`} style={{ 
                    width: '26px', 
                    height: '26px', 
                    borderRadius: '50%', 
                    backgroundColor: dotBg, 
                    border: dotBorder, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}>
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span className="stepper-text" style={{ 
                    marginTop: '8px', 
                    fontSize: '0.72rem', 
                    fontWeight: isActive ? 600 : 500, 
                    color: textColor,
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Visuals/Map) & Right Column (Logs/Reports) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Description Card */}
          <div className="form-card" style={{ margin: 0 }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>Problem Description</h3>
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--color-charcoal)' }}>
              {incident.description}
            </p>
          </div>

          {/* Map Display */}
          <div className="form-card" style={{ margin: 0, height: '300px', padding: '12px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Incident Coordinates</h3>
            <div style={{ height: 'calc(100% - 28px)' }}>
              <LeafletMap 
                incidents={[incident]} 
                center={[incident.latitude, incident.longitude]} 
                zoom={15} 
                interactive={false}
              />
            </div>
          </div>

          {/* Images Gallery */}
          {imagePreview && (
            <div className="form-card" style={{ margin: 0 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>Field Evidence (Photos)</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <img 
                  src={imagePreview} 
                  alt="Incident Evidence" 
                  style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-sand)' }} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* AI Summary Box */}
          <div className="form-card" style={{ margin: 0, backgroundColor: 'var(--color-off-white)', borderLeft: '3px solid var(--color-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Award size={16} style={{ color: 'var(--color-green)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                AI Summary & Classification
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--color-charcoal)' }}>
              {incident.summary}
            </p>
          </div>

          {/* Response controls OR Resolution Feedback loop */}
          {currentRole !== 'community' ? (
            // Response Team Admin Controls
            <div className="form-card" style={{ margin: 0, border: '1px solid var(--color-gold)' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} style={{ color: 'var(--color-gold)' }} />
                <span>Response Team Coordinator</span>
              </h3>

              <form onSubmit={handleUpdateStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="newStatus" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Update Status</label>
                    <select
                      id="newStatus"
                      className="form-control"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Incident['status'])}
                      style={{ fontSize: '0.82rem', padding: '6px 8px' }}
                    >
                      {timelineSteps.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="assignedTeam" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Assigned Team</label>
                    <input
                      type="text"
                      id="assignedTeam"
                      className="form-control"
                      value={assignedTeam}
                      onChange={(e) => setAssignedTeam(e.target.value)}
                      placeholder="e.g. Cape Town Roads Dept"
                      style={{ fontSize: '0.82rem', padding: '6px 8px' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="statusMessage" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Status Update Log Message</label>
                  <textarea
                    id="statusMessage"
                    rows={2}
                    className="form-control"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Provide details about the progress or action taken..."
                    style={{ fontSize: '0.82rem' }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="btn btn-primary btn-sm btn-icon"
                  style={{ alignSelf: 'flex-end' }}
                >
                  <Send size={12} />
                  <span>{updatingStatus ? 'Updating...' : 'Publish Update'}</span>
                </button>
              </form>
            </div>
          ) : (
            // Community Feedback Loop (Active ONLY if status is Resolved or Closed)
            (incident.status === 'Resolved' || incident.status === 'Closed') && (
              <div className="form-card" style={{ margin: 0, border: '1px solid var(--color-green)' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>Resolution Verification</span>
                </h3>

                {userFeedback ? (
                  // Submitted State
                  <div style={{ backgroundColor: 'var(--color-off-white)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-green)', display: 'block', marginBottom: '4px' }}>
                      ✓ Feedback Submitted
                    </span>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      You rated this resolution:
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
                      {[1,2,3,4,5].map(star => (
                        <Star 
                          key={star} 
                          size={14} 
                          fill={star <= userFeedback.rating ? 'var(--color-gold)' : 'none'} 
                          stroke={star <= userFeedback.rating ? 'var(--color-gold)' : 'var(--color-sand-dark)'} 
                        />
                      ))}
                    </div>
                    {userFeedback.comment && (
                      <p style={{ margin: 0, fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--color-charcoal)' }}>
                        "{userFeedback.comment}"
                      </p>
                    )}
                  </div>
                ) : (
                  // Active feedback form
                  <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Has this issue been resolved?</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['Yes', 'Partially', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFeedbackResolved(opt as any)}
                            className={`btn btn-sm ${feedbackResolved === opt ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Rate the resolution:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          >
                            <Star
                              size={18}
                              fill={star <= feedbackRating ? 'var(--color-gold)' : 'none'}
                              stroke={star <= feedbackRating ? 'var(--color-gold)' : 'var(--color-sand-dark)'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="feedbackComment" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Additional comments</label>
                      <textarea
                        id="feedbackComment"
                        rows={2}
                        className="form-control"
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="Help response teams evaluate performance..."
                        style={{ fontSize: '0.8rem' }}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="btn btn-primary btn-sm"
                      style={{ alignSelf: 'flex-end' }}
                    >
                      {submittingFeedback ? 'Submitting...' : 'Submit Rating'}
                    </button>
                  </form>
                )}
              </div>
            )
          )}

          {/* Timeline Updates Log */}
          <div className="form-card" style={{ margin: 0 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', borderBottom: '1px solid var(--color-sand)', paddingBottom: '6px' }}>
              Incident Progress History
            </h3>
            <div className="timeline-log-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
              {/* Vertical line connector */}
              <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'var(--color-sand)' }} />
              
              {updates.map((up) => {
                const date = new Date(up.created_at).toLocaleDateString('en-ZA', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={up.id} style={{ display: 'flex', gap: '14px', position: 'relative', zIndex: 2 }}>
                    {/* Circle icon marker */}
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--color-white)', 
                      border: '2px solid var(--color-sand-dark)', 
                      marginTop: '3px',
                      flexShrink: 0
                    }} />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span className={`status-badge status-${up.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                          {up.status}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{date}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>• by {up.author_name}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', lineHeight: 1.4, color: 'var(--color-charcoal)' }}>
                        {up.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Merged Reports Ticker List */}
          <div className="form-card" style={{ margin: 0 }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Merged Reports Group</span>
              <span className="badge" style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', fontSize: '0.72rem' }}>
                {reports.length} reports
              </span>
            </h3>
            
            <div className="merged-reports-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
              {reports.map((rep) => {
                const date = new Date(rep.created_at).toLocaleDateString('en-ZA', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div key={rep.id} style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--color-sand-light)', backgroundColor: 'var(--color-off-white)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>Report ID: {rep.id}</span>
                      <span>{date}</span>
                    </div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.78rem', color: 'var(--color-charcoal)', lineHeight: 1.3 }}>
                      "{rep.description}"
                    </p>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                      Logged by: {rep.anonymous ? 'Anonymous Resident' : rep.contact_name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default IncidentDetailsPage;
