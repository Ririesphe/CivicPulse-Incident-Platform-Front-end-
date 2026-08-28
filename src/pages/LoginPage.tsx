import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import { Shield, Zap, Bell, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.login({ email, password });
      if (response && response.user) {
        login(response.user);
      } else {
        setError('Invalid response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
          Community intelligence,<br />built for impact.
        </h1>
        <p className="auth-panel-sub">
          Join thousands of residents and response teams using CivicPulse to report, track, and resolve community incidents — faster than ever.
        </p>

        <div className="auth-panel-features">
          <div className="auth-panel-feature">
            <div className="auth-panel-feature-icon">
              <Zap size={18} />
            </div>
            <div className="auth-panel-feature-text">
              <strong>AI-Powered Triage</strong>
              <span>Reports are classified and prioritised automatically within seconds.</span>
            </div>
          </div>
          <div className="auth-panel-feature">
            <div className="auth-panel-feature-icon">
              <Bell size={18} />
            </div>
            <div className="auth-panel-feature-text">
              <strong>Real-Time Notifications</strong>
              <span>Get instant updates when your incident status changes.</span>
            </div>
          </div>
          <div className="auth-panel-feature">
            <div className="auth-panel-feature-icon">
              <Shield size={18} />
            </div>
            <div className="auth-panel-feature-text">
              <strong>Secure & Accountable</strong>
              <span>Role-based access for community members, officers, and admins.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-subtitle">Sign in to your CivicPulse account to continue.</p>

          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => navigateTo('forgot-password')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer-link">
            Don't have an account?{' '}
            <button type="button" onClick={() => navigateTo('register')}>Create one</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
