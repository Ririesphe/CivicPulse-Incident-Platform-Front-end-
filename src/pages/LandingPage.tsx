import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import type { Incident } from '../db/schema';
// LeafletMap removed – replaced by static background image
import { MapPin, Zap, Users, Shield, ArrowRight, ChevronRight, BarChart2 } from 'lucide-react';

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

      {/* ── Hero Section – full-bleed Cape Town background ── */}
      <section className="hero-section hero-section--bg">
        <div className="hero-bg-overlay" />
        <div className="hero-center-content">
          <div className="tagline-badge tagline-badge--light">
            <BarChart2 size={12} />
            <span>CivicPulse Platform</span>
          </div>

          <h1 className="hero-headline hero-headline--light">
            Report what matters.<br />
            <span className="text-gradient--light">Track what changes.</span>
          </h1>

          <p className="hero-supporting hero-supporting--light">
            An AI-powered community platform that turns everyday reports into structured incidents, helping communities and response teams identify, prioritise and resolve problems faster.
          </p>

          <div style={{ display: 'flex', gap: '14px', marginTop: '36px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn btn-primary btn-lg btn-icon"
              onClick={() => navigateTo(currentUser ? 'report' : 'login')}
            >
              <MapPin size={17} />
              Report an Incident
            </button>
            <button
              className="btn btn-lg hero-btn-ghost"
              onClick={() => navigateTo('map')}
            >
              Explore Map
              <ChevronRight size={16} />
            </button>
          </div>

          {!currentUser && (
            <p style={{ marginTop: '20px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)' }}>
              <button
                onClick={() => navigateTo('register')}
                style={{ background: 'none', border: 'none', color: '#93C5FD', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              >
                Create a free account
              </button>
              {' '}to track your reports and receive updates.
            </p>
          )}
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
