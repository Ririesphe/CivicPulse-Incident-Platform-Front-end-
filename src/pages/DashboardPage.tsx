import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/mockDb';
import type { Incident, Feedback } from '../db/schema';
import { 
  BarChart3, CheckCircle, Clock, AlertTriangle, 
  Clipboard, Star 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { refreshTrigger } = useApp();
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    high: 0,
    resolved: 0,
    avgTime: '18.4 Hours'
  });

  useEffect(() => {
    const incs = db.getIncidents();
    const fbs = db.getFeedbacks();
    setIncidents(incs);
    setFeedbacks(fbs);

    const openCount = incs.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
    const highCount = incs.filter(i => (i.severity === 'High' || i.severity === 'Critical') && i.status !== 'Closed').length;
    const resolvedCount = incs.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

    setStats({
      total: incs.length,
      open: openCount,
      high: highCount,
      resolved: resolvedCount,
      avgTime: '18.4 Hours'
    });
  }, [refreshTrigger]);

  // Visualisation 1: Incidents by Category counts
  const categories = [
    'Roads & Transport',
    'Water & Sanitation',
    'Electricity',
    'Waste Management',
    'Public Safety',
    'Infrastructure',
    'Environment'
  ];

  const categoryCounts = categories.map(cat => {
    return {
      name: cat,
      count: incidents.filter(i => i.category === cat).length
    };
  }).sort((a, b) => b.count - a.count);

  const maxCategoryCount = Math.max(...categoryCounts.map(c => c.count), 1);

  // Visualisation 2: Status Breakdown
  const statusLabels = ['Reported', 'Assigned', 'Investigating', 'In Progress', 'Resolved', 'Closed'];
  const statusColors = {
    'Reported': 'var(--color-terracotta)',
    'Assigned': 'var(--color-gold)',
    'Investigating': 'var(--color-sand-dark)',
    'In Progress': '#4A6984',
    'Resolved': 'var(--color-green)',
    'Closed': 'var(--color-charcoal)'
  };
  const statusCounts = statusLabels.map(label => {
    return {
      label,
      count: incidents.filter(i => i.status === label || (label === 'Assigned' && i.status === 'AI Verified')).length
    };
  });

  // Visualisation 3: Weekly Activity Trend (past 5 days count)
  const trendData = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 6 },
    { day: 'Wed', count: 4 },
    { day: 'Thu', count: 9 },
    { day: 'Fri', count: 12 },
  ];
  const maxTrendCount = Math.max(...trendData.map(t => t.count), 1);

  // Response Teams Workload metrics
  const teams = [
    { name: 'Cape Town Roads Dept', active: incidents.filter(i => i.assigned_team === 'Cape Town Roads Dept' && i.status !== 'Resolved' && i.status !== 'Closed').length },
    { name: 'Cape Town Water & Sanitation', active: incidents.filter(i => i.assigned_team === 'Cape Town Water & Sanitation' && i.status !== 'Resolved' && i.status !== 'Closed').length },
    { name: 'City Power Grid Team B', active: incidents.filter(i => i.assigned_team.includes('Power') && i.status !== 'Resolved' && i.status !== 'Closed').length },
    { name: 'Waste Mgmt Emergency Unit', active: incidents.filter(i => i.assigned_team.includes('Waste') && i.status !== 'Resolved' && i.status !== 'Closed').length },
  ];

  return (
    <div className="dashboard-page container" style={{ padding: '40px 16px' }}>
      
      {/* Welcome header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0 }}>Executive Admin Dashboard</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
          CivicPulse system activity, category statistics, department workloads, and community feedback.
        </p>
      </div>

      {/* Stats panels grid */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="stat-label">Total Grid Incidents</span>
            <Clipboard size={18} style={{ color: 'var(--color-sand-dark)' }} />
          </div>
          <span className="stat-number">{stats.total}</span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="stat-label">Active / Open Incidents</span>
            <AlertTriangle size={18} style={{ color: 'var(--color-terracotta)' }} />
          </div>
          <span className="stat-number" style={{ color: 'var(--color-terracotta)' }}>{stats.open}</span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="stat-label">High-Priority Incidents</span>
            <AlertTriangle size={18} style={{ color: 'var(--color-gold)' }} />
          </div>
          <span className="stat-number" style={{ color: 'var(--color-gold)' }}>{stats.high}</span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="stat-label">Resolved / Closed Issues</span>
            <CheckCircle size={18} style={{ color: 'var(--color-green)' }} />
          </div>
          <span className="stat-number" style={{ color: 'var(--color-green)' }}>{stats.resolved}</span>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="stat-label">Avg. Resolution Time</span>
            <Clock size={18} style={{ color: 'var(--color-green)' }} />
          </div>
          <span className="stat-number" style={{ fontSize: '1.4rem', marginTop: '4px', display: 'block' }}>{stats.avgTime}</span>
        </div>
      </div>

      {/* Visualisations Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Chart 1: Incidents by Category */}
        <div className="form-card" style={{ margin: 0 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: 'var(--color-green)' }} />
            <span>Volume by Incident Category</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryCounts.map((cat) => {
              const percentage = (cat.count / maxCategoryCount) * 100;
              return (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>{cat.name}</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>{cat.count} issues</span>
                  </div>
                  {/* Custom horizontal bar */}
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-sand-light)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        backgroundColor: 'var(--color-green)', 
                        borderRadius: '4px',
                        transition: 'width 0.5s ease-out'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column containing Chart 2 & Chart 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Chart 2: Status Gauge Split */}
          <div className="form-card" style={{ margin: 0 }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>Lifecycle Status Breakdown</h3>
            
            {/* Horizontal Gauge Bar */}
            <div style={{ display: 'flex', width: '100%', height: '14px', borderRadius: '7px', overflow: 'hidden', backgroundColor: 'var(--color-sand-light)', marginBottom: '16px' }}>
              {statusCounts.map(st => {
                if (st.count === 0) return null;
                const pct = (st.count / stats.total) * 100;
                return (
                  <div 
                    key={st.label} 
                    style={{ 
                      width: `${pct}%`, 
                      height: '100%', 
                      backgroundColor: statusColors[st.label as keyof typeof statusColors] || 'var(--color-sand-dark)' 
                    }} 
                    title={`${st.label}: ${st.count}`}
                  />
                );
              })}
            </div>

            {/* Labels Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {statusCounts.map(st => (
                <div key={st.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColors[st.label as keyof typeof statusColors] || 'var(--color-sand-dark)' }} />
                  <span style={{ color: 'var(--color-text-muted)', flex: 1 }}>{st.label}</span>
                  <span style={{ fontWeight: 600 }}>{st.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Weekly Activity Trend (SVG Line chart) */}
          <div className="form-card" style={{ margin: 0 }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>Weekly Incident Ingest Trend</h3>
            
            {/* SVG line graph */}
            <div style={{ position: 'relative', width: '100%', height: '100px', marginTop: '12px' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="var(--color-sand-light)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="var(--color-sand-light)" strokeWidth="0.5" />
                
                {/* SVG Path line */}
                <path
                  d={`M 20 ${70 - (trendData[0].count / maxTrendCount) * 55} 
                     L 80 ${70 - (trendData[1].count / maxTrendCount) * 55} 
                     L 140 ${70 - (trendData[2].count / maxTrendCount) * 55} 
                     L 200 ${70 - (trendData[3].count / maxTrendCount) * 55} 
                     L 260 ${70 - (trendData[4].count / maxTrendCount) * 55}`}
                  fill="none"
                  stroke="var(--color-terracotta)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Nodes */}
                {trendData.map((d, idx) => {
                  const x = 20 + idx * 60;
                  const y = 70 - (d.count / maxTrendCount) * 55;
                  return (
                    <g key={d.day}>
                      <circle cx={x} cy={y} r="4" fill="var(--color-white)" stroke="var(--color-terracotta)" strokeWidth="2" />
                      <text x={x} y="78" fill="var(--color-text-muted)" fontSize="7" textAnchor="middle">{d.day}</text>
                      <text x={x} y={y - 8} fill="var(--color-charcoal)" fontSize="7" fontWeight="bold" textAnchor="middle">{d.count}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* Relational bottom panel: Department workloads & Community Feedbacks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Response Team workload list */}
        <div className="form-card" style={{ margin: 0 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Response Team Workloads</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {teams.map((t) => (
              <div 
                key={t.name}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '10px 14px', 
                  border: '1px solid var(--color-sand-light)', 
                  borderRadius: '4px',
                  backgroundColor: 'var(--color-off-white)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', color: 'var(--color-charcoal)' }}>
                    {t.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>City Response Division</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge" style={{ backgroundColor: t.active > 0 ? '#FBEBE6' : 'var(--color-green-light)', color: t.active > 0 ? 'var(--color-terracotta)' : 'var(--color-green)', fontSize: '0.72rem', fontWeight: 700 }}>
                    {t.active} active issues
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community feedback review list */}
        <div className="form-card" style={{ margin: 0 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Recent Resolution Feedback</h3>
          {feedbacks.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <span style={{ fontSize: '0.82rem' }}>No feedback submitted yet.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
              {feedbacks.map((fb) => {
                const date = new Date(fb.created_at).toLocaleDateString('en-ZA', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div key={fb.id} style={{ borderBottom: '1px solid var(--color-sand-light)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Incident {fb.incident_id}</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={12} fill={s <= fb.rating ? 'var(--color-gold)' : 'none'} stroke={s <= fb.rating ? 'var(--color-gold)' : 'var(--color-sand-dark)'} />
                          ))}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{date}</span>
                    </div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--color-charcoal)', lineHeight: 1.3 }}>
                      "{fb.comment || 'No comment provided.'}"
                    </p>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                      <span>Fully Resolved: <strong style={{ color: fb.resolved_status === 'Yes' ? 'var(--color-green)' : 'var(--color-terracotta)' }}>{fb.resolved_status}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
