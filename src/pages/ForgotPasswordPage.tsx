import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Mail, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
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
          Account security<br />you can trust.
        </h1>
        <p className="auth-panel-sub">
          We take the security of your account seriously. Follow the steps to reset your password and regain access to your CivicPulse account.
        </p>
      </div>

      {/* Right form panel */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={32} color="var(--color-blue)" />
              </div>
              <h2 className="auth-form-title" style={{ textAlign: 'center' }}>Check your inbox</h2>
              <p style={{ color: 'var(--color-text-muted)', margin: '10px 0 28px', fontSize: '0.9375rem' }}>
                If an account with <strong>{email}</strong> exists, we've sent a password reset link. Check your email.
              </p>
              <button
                className="btn btn-primary w-full"
                style={{ justifyContent: 'center', padding: '11px 20px' }}
                onClick={() => navigateTo('login')}
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--color-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Mail size={24} color="var(--color-blue)" />
              </div>
              <h2 className="auth-form-title">Reset your password</h2>
              <p className="auth-form-subtitle">Enter your email address and we'll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="forgot-email">Email address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  style={{ justifyContent: 'center', padding: '11px 20px', fontSize: '0.9375rem', marginTop: '8px' }}
                >
                  Send Reset Link
                </button>
              </form>

              <div className="auth-footer-link" style={{ marginTop: '20px' }}>
                <button type="button" onClick={() => navigateTo('login')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
