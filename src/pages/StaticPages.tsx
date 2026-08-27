import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Brain, Users, Clipboard, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { navigateTo } = useApp();

  const steps = [
    {
      icon: <Clipboard size={22} style={{ color: 'var(--color-charcoal)' }} />,
      title: '1. Report an Issue',
      desc: 'Fill out a description on your smartphone or desktop. Attach coordinates automatically by clicking your location on the map.'
    },
    {
      icon: <Brain size={22} style={{ color: 'var(--color-green)' }} />,
      title: '2. AI Classification',
      desc: 'Our NLP parser classifies the category (e.g. Roads, Water) and flags urgency indicators to determine the priority level.'
    },
    {
      icon: <Users size={22} style={{ color: 'var(--color-gold)' }} />,
      title: '3. Duplicate Matching',
      desc: 'If other residents reported the same issue within 300 meters, our engine links the reports to represent community-wide impact.'
    },
    {
      icon: <Shield size={22} style={{ color: 'var(--color-terracotta)' }} />,
      title: '4. Dispatched Resolution',
      desc: 'Municipal operations teams receive structured data, assign field crews, and publish updates in real-time.'
    },
    {
      icon: <CheckCircle2 size={22} style={{ color: 'var(--color-green)' }} />,
      title: '5. Resolution Verification',
      desc: 'Once marked resolved, reporting residents submit feedback to verify the repair work meets community standards.'
    }
  ];

  return (
    <div className="how-it-works-page container" style={{ padding: '40px 16px', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0 }}>How CivicPulse Works</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Our platform streamlines communications between Cape Town communities and response teams.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
        {steps.map((s, idx) => (
          <div 
            key={idx} 
            className="form-card" 
            style={{ 
              margin: 0, 
              display: 'flex', 
              gap: '20px', 
              alignItems: 'start',
              border: '1px solid var(--color-sand)'
            }}
          >
            <div style={{ 
              width: '46px', 
              height: '46px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-off-white)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {s.icon}
            </div>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--color-charcoal)' }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.45, color: 'var(--color-text-muted)' }}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigateTo('report')}>
          Report an Incident Now
        </button>
      </div>
    </div>
  );
};

export const About: React.FC = () => {
  return (
    <div className="about-page container" style={{ padding: '40px 16px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0' }}>About CivicPulse</h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>
          "Turning community voices into action."
        </p>
      </div>

      <div className="form-card" style={{ margin: '0 0 24px 0', border: '1px solid var(--color-sand)' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>Our Mission</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--color-charcoal)' }}>
          CivicPulse is a professional, open-source civic technology platform built to bridge the gap between community residents 
          and local municipal administrations. Our goal is to replace slow, opaque filing structures with instant AI classification, 
          proactive duplicate group mapping, and fully transparent resolution tracking. 
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="form-card" style={{ margin: 0, border: '1px solid var(--color-sand)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>South African Focus</h3>
          <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.45, color: 'var(--color-text-muted)' }}>
            Designed and tested with locations across Cape Town (CBD, Woodstock, Observatory, Khayelitsha, Mitchells Plain, Bellville). 
            Our architecture is built around local infrastructure challenges such as pothole merging, water leaks, and electricity triaging.
          </p>
        </div>

        <div className="form-card" style={{ margin: 0, border: '1px solid var(--color-sand)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>Scalable Channels</h3>
          <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.45, color: 'var(--color-text-muted)' }}>
            While our MVP features this responsive web application, the backend data models are pre-structured to ingest 
            incoming logs via WhatsApp automated chat, SMS triggers, voice recording transcripts, and external mobile apps.
          </p>
        </div>
      </div>

      <div className="form-card" style={{ margin: 0, border: '1px solid var(--color-sand)' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>Technologies Used</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--color-text-muted)' }}>
          This platform is built using standard production-grade libraries: React, TypeScript, Leaflet Maps for geographic vector rendering, 
          and Lucide Icons. The user experience is crafted using Vanilla CSS variables matching a curated palette of African accents 
          (Deep Charcoal, Warm Off-White, Muted Sand, Forest Green, Terracotta, and Muted Gold).
        </p>
      </div>
    </div>
  );
};
