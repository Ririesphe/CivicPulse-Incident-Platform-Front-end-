import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import { Shield, Users, CheckCircle, Eye, EyeOff, AlertCircle, MapPin } from 'lucide-react';
import type { User } from '../db/schema';

// Cape Region areas grouped by sub-region
const CAPE_AREAS = [
  {
    group: 'Cape Town Metro',
    areas: [
      'Cape Town CBD', 'Woodstock', 'Observatory', 'Salt River', 'Gardens',
      'Green Point', 'Sea Point', 'Camps Bay', 'Claremont', 'Rondebosch',
      'Newlands', 'Wynberg', 'Constantia', 'Muizenberg', 'Fish Hoek',
      "Simon's Town", 'Hout Bay', 'Milnerton', 'Table View', 'Bloubergstrand',
      'Bellville', 'Parow', 'Goodwood', 'Durbanville',
    ],
  },
  {
    group: 'Cape Flats',
    areas: [
      'Athlone', 'Mitchells Plain', 'Khayelitsha', 'Gugulethu', 'Nyanga',
      'Langa', 'Philippi', 'Delft', 'Mfuleni', 'Grassy Park', 'Hanover Park',
    ],
  },
  {
    group: 'Northern Suburbs',
    areas: ['Brackenfell', 'Kraaifontein', 'Kuils River', 'Eerste River'],
  },
  {
    group: 'Helderberg & Winelands',
    areas: ['Somerset West', 'Strand', "Gordon's Bay", 'Stellenbosch', 'Paarl', 'Franschhoek'],
  },
  {
    group: 'West Coast',
    areas: ['Langebaan', 'Saldanha', 'Vredenburg'],
  },
];

export const RegisterPage: React.FC = () => {
  const { login, navigateTo } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.register({ name, email, phone, area, password });
      if (response && response.user) {
        login(response.user);
      } else {
        setError('Invalid response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Left branding panel */}
      <div className="auth-left-panel">
        <div className="auth-panel-logo">
          <div className="auth-panel-logo-icon">
            <Shield size={22} color="#fff" />
          </div>
          <span className="auth-panel-logo-text">CivicPulse</span>
        </div>

        <h1 className="auth-panel-headline">
          Your community,<br />your voice.
        </h1>
        <p className="auth-panel-sub">
          Create a free account to start reporting community incidents, tracking resolution progress, and connecting with your local response teams.
        </p>

        <div className="auth-panel-features">
          <div className="auth-panel-feature">
            <div className="auth-panel-feature-icon">
              <CheckCircle size={18} />
            </div>
            <div className="auth-panel-feature-text">
              <strong>Free to Join</strong>
              <span>Creating an account is completely free for all community members.</span>
            </div>
          </div>
          <div className="auth-panel-feature">
            <div className="auth-panel-feature-icon">
              <Users size={18} />
            </div>
            <div className="auth-panel-feature-text">
              <strong>Community Driven</strong>
              <span>Be part of a network that holds municipalities accountable.</span>
            </div>
          </div>
          <div className="auth-panel-feature">
            <div className="auth-panel-feature-icon">
              <Shield size={18} />
            </div>
            <div className="auth-panel-feature-text">
              <strong>Anonymous Reporting</strong>
              <span>Report incidents anonymously if you prefer — we protect your identity.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-subtitle">Join CivicPulse and start making a difference in your community.</p>

          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name <span className="required">*</span></label>
              <input
                id="reg-name"
                type="text"
                className="form-control"
                placeholder="e.g. Siphelele Malotana"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address <span className="required">*</span></label>
              <input
                id="reg-email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number <span style={{ color: 'var(--color-gray-400)', fontWeight: 400 }}>(optional)</span></label>
              <input
                id="reg-phone"
                type="tel"
                className="form-control"
                placeholder="+27 82 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-area">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} style={{ color: 'var(--color-blue)' }} />
                  Area / Suburb <span className="required">*</span>
                </span>
              </label>
              <select
                id="reg-area"
                className="form-control"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              >
                <option value="" disabled>Select your area in the Cape Region</option>
                {CAPE_AREAS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.areas.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password <span className="required">*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', padding: '11px 20px', fontSize: '0.9375rem', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer-link">
            Already have an account?{' '}
            <button type="button" onClick={() => navigateTo('login')}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

