import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/mockDb';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setError('');
      login(user);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '60px', marginBottom: '60px' }}>
      <div className="form-card">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome Back</h2>
        
        {error && (
          <div style={{ backgroundColor: 'var(--color-terracotta-light)', color: 'var(--color-terracotta)', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
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
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ marginBottom: 0 }}>Password <span className="required">*</span></label>
              <button 
                type="button" 
                onClick={() => navigateTo('forgot-password')}
                style={{ background: 'none', border: 'none', color: 'var(--color-green)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Forgot?
              </button>
            </div>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginTop: '6px' }}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: '10px' }}>
            Sign In
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={() => navigateTo('register')}
            style={{ background: 'none', border: 'none', color: 'var(--color-green)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
