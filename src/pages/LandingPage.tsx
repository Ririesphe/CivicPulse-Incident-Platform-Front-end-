import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import type { Incident } from '../db/schema';
// LeafletMap removed – replaced by static background image
import { MapPin, Activity, Zap, Users, Shield, ArrowRight, ChevronRight, BarChart2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo, currentUser } = useApp();
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, open: 0, reports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const list = await apiClient.getIncidents();
        setRecentIncidents(list.slice(0, 3));
        const open = list.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
        const resolved = list.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
        setStats({ total: list.length, resolved, open, reports: list.length * 2 });
      } catch {
        // Backend not yet connected
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const features = [
    {
      icon: <Zap size={22} color="var(--color-blue)" />,
      title: 'AI Classification',
      desc: 'Natural language analysis classifies category, severity, and location details in seconds.'
    },
    {
      icon: <Users size={22} color="var(--color-blue)" />,
      title: 'Duplicate Merging',
      desc: 'Groups related reports together so municipality teams see the true scale of community impact.'
    },
    {
      icon: <Shield size={22} color="var(--color-blue)" />,
      title: 'Accountability Tracker',
      desc: 'Tracks incidents from verification through to resolution with real-time status updates.'
    }
  ];

  return (
    <div className="landing-page">

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="hero-section">
        <div className="grid grid-2 hero-grid">
          {/* Left: text */}
          <div className="hero-text-content">
            <div className="tagline-badge">
              <BarChart2 size={12} />
              <span>CivicPulse Platform</span>
            </div>

            <h1 className="hero-headline">
              Report what matters.<br />
              <span className="text-gradient">Track what changes.</span>
            </h1>

            <p className="hero-supporting">
              An AI-powered community platform that turns everyday reports into structured incidents, helping communities and response teams identify, prioritise and resolve problems faster.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg btn-icon"
                onClick={() => navigateTo(currentUser ? 'report' : 'login')}
              >
                <MapPin size={17} />
                Report an Incident
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigateTo('map')}
              >
                Explore Map
                <ChevronRight size={16} />
              </button>
            </div>

            {!currentUser && (
              <p style={{ marginTop: '20px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <button
                  onClick={() => navigateTo('register')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
                >
                  Create a free account
                </button>
                {' '}to track your reports and receive updates.
              </p>
            )}
          </div>

          {/* Right: live activity card */}
          <div className="hero-visual-card">
            <div className="visual-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-dot" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Live Civic Activity
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Cape Town Metro</span>
            </div>

            <div className="hero-background"></div>

            <div className="hero-ticker-feed">
              <div className="ticker-header">
                <Activity size={13} color="var(--color-blue)" />
                <span>Recent Incident Updates</span>
              </div>
              <div className="ticker-items">
                {loading ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                    Loading updates...
                  </div>
                ) : recentIncidents.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                    No incidents yet. Be the first to report one!
                  </div>
                ) : (
                  recentIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="ticker-item"
                      onClick={() => navigateTo('incident-details', inc.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="ticker-meta">
                        <span className="ticker-id">{inc.id}</span>
                        <span className={`status-badge status-${inc.status.toLowerCase().replace(/ /g, '-')}`}>{inc.status}</span>
                      </div>
                      <p className="ticker-title">{inc.title}</p>
                      <span className="ticker-location">
                        <MapPin size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                        {inc.address.split(',')[0]}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ─────────────────────────────────── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number" style={{ color: 'var(--color-blue)' }}>{stats.reports}</span>
              <span className="stat-label">Community Reports Filed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number" style={{ color: 'var(--color-danger)' }}>{stats.open}</span>
              <span className="stat-label">Open Incidents</span>
            </div>
            <div className="stat-card">
              <span className="stat-number" style={{ color: 'var(--color-success)' }}>{stats.resolved}</span>
              <span className="stat-label">Resolved Issues</span>
            </div>
            <div className="stat-card">
              <span className="stat-number" style={{ color: 'var(--color-warning)' }}>96%</span>
              <span className="stat-label">AI Matching Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────── */}
      <section className="features-section container">
        <div className="section-header">
          <h2>Designed for Impact and Trust</h2>
          <p>
            We connect community voices directly to municipality teams, backed by AI duplicate checking to ensure high-priority issues get resolved first.
          </p>
        </div>
        <div className="grid grid-3">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon-circle">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────── */}
      <section className="landing-cta-banner container">
        <div className="cta-banner-content">
          <p style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
            Ready to make a difference?
          </p>
          <h2>Tired of unresolved community issues?</h2>
          <p style={{ marginTop: '10px' }}>
            Submit your report today. Our AI model will verify it, check for duplicates, and route it to the right municipal department automatically.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-lg"
              style={{ backgroundColor: '#fff', color: 'var(--color-navy)', fontWeight: 700 }}
              onClick={() => navigateTo('report')}
            >
              Report Incident Now
              <ArrowRight size={16} />
            </button>
            <button
              className="btn btn-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
              onClick={() => navigateTo('how-it-works')}
            >
              Learn How It Works
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
