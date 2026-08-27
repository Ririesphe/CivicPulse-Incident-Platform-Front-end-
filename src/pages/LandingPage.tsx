import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/mockDb';
import type { Incident } from '../db/schema';
import LeafletMap from '../components/LeafletMap';
import { Shield, Users, ArrowRight, Activity, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, open: 0, reports: 0 });

  useEffect(() => {
    const list = db.getIncidents();
    const reports = db.getReports();
    setRecentIncidents(list.slice(0, 3));
    
    const open = list.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
    const resolved = list.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
    
    setStats({
      total: list.length,
      resolved: resolved,
      open: open,
      reports: reports.length,
    });
  }, []);

  const features = [
    {
      icon: <Zap size={22} style={{ color: 'var(--color-gold)' }} />,
      title: 'AI Classification',
      desc: 'Natural language analysis classifies category, severity, and location details in seconds.'
    },
    {
      icon: <Users size={22} style={{ color: 'var(--color-green)' }} />,
      title: 'Duplicate Merging',
      desc: 'Groups related reports together. Shows municipality teams the true number of affected residents.'
    },
    {
      icon: <Shield size={22} style={{ color: 'var(--color-terracotta)' }} />,
      title: 'Accountability Tracker',
      desc: 'Tracks incidents from verification to resolved with automatic updates and resolution feedback loops.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="grid grid-2 hero-grid">
          <div className="hero-text-content">
            <div className="tagline-badge">
              <span>CivicPulse Platform</span>
            </div>
            <h1 className="hero-headline">
              Report what matters.<br />
              <span className="text-gradient">Track what changes.</span>
            </h1>
            <p className="hero-supporting">
              An AI-powered community platform that turns everyday reports into structured incidents, 
              helping communities and response teams identify, prioritise and resolve problems faster.
            </p>
            <div className="hero-actions" style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => navigateTo('report')}
              >
                Report an Incident
              </button>
              <button 
                className="btn btn-secondary btn-lg" 
                onClick={() => navigateTo('map')}
              >
                Explore Community Map
              </button>
            </div>
          </div>
          
          {/* Subtle Visual Representation: Interactive Map / Recent Feed */}
          <div className="hero-visual-card">
            <div className="visual-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-dot"></span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Live Civic Activity
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Cape Town Metro</span>
            </div>
            
            <div className="hero-mini-map">
              <LeafletMap 
                incidents={recentIncidents} 
                interactive={false} 
                center={[-33.9249, 18.428]} 
                zoom={12} 
              />
            </div>

            <div className="hero-ticker-feed">
              <div className="ticker-header">
                <Activity size={14} style={{ color: 'var(--color-green)' }} />
                <span>Recent Updates</span>
              </div>
              <div className="ticker-items">
                {recentIncidents.map((inc) => (
                  <div 
                    key={inc.id} 
                    className="ticker-item"
                    onClick={() => navigateTo('incident-details', inc.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="ticker-meta">
                      <span className="ticker-id">{inc.id}</span>
                      <span className={`status-badge status-${inc.status.toLowerCase().replace(' ', '-')}`}>{inc.status}</span>
                    </div>
                    <p className="ticker-title">{inc.title}</p>
                    <span className="ticker-location">📍 {inc.address.split(',')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="stats-section container">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.reports}</span>
            <span className="stat-label">Community Reports</span>
          </div>
          <div className="stat-card">
            <span className="stat-number" style={{ color: 'var(--color-terracotta)' }}>{stats.open}</span>
            <span className="stat-label">Open Incidents</span>
          </div>
          <div className="stat-card">
            <span className="stat-number" style={{ color: 'var(--color-green)' }}>{stats.resolved}</span>
            <span className="stat-label">Resolved Issues</span>
          </div>
          <div className="stat-card">
            <span className="stat-number" style={{ color: 'var(--color-gold)' }}>96%</span>
            <span className="stat-label">AI Matching Accuracy</span>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Features */}
      <section className="features-section container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2>Designed for Impact and Trust</h2>
          <p style={{ maxWidth: '600px', margin: '8px auto 0', color: 'var(--color-text-muted)' }}>
            We connect community voices directly to municipality teams, backed by AI duplicate checking to ensure high-priority issues get resolved first.
          </p>
        </div>
        <div className="grid grid-3 features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon-circle">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="landing-cta-banner container">
        <div className="cta-banner-content">
          <h2>Tired of unresolved community issues?</h2>
          <p>
            Submit your report today. Our AI matching model will verify it, check for duplicates, and route it to the assigned municipal department.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={() => navigateTo('report')}>
              Report Incident Now
              <ArrowRight size={16} style={{ marginLeft: '6px' }} />
            </button>
            <button className="btn btn-outline" onClick={() => navigateTo('how-it-works')}>
              Learn How It Works
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
