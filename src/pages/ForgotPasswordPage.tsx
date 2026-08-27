import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '60px', marginBottom: '60px' }}>
      <div className="form-card">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Reset Password</h2>
        
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '16px', borderRadius: '4px', marginBottom: '24px', fontWeight: 600 }}>
              If an account with that email exists, we've sent a password reset link.
            </div>
            <button 
              className="btn btn-primary w-full" 
              onClick={() => navigateTo('login')}
              style={{ justifyContent: 'center' }}
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '20px', textAlign: 'center' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="e.g. siphelele@civicpulse.org" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: '10px' }}>
              Send Reset Link
            </button>
          </form>
        )}
        
        {!submitted && (
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem' }}>
            <button 
              type="button" 
              onClick={() => navigateTo('login')}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}
            >
              &larr; Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
