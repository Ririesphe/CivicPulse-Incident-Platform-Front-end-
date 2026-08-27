import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../db/mockDb';
import type { User } from '../db/schema';

export const RegisterPage: React.FC = () => {
  const { login, navigateTo } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user already exists
    const users = db.getUsers();
    if (users.some(u => u.email === email)) {
      setError('An account with this email already exists.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      password,
      role: 'community',
      created_at: new Date().toISOString()
    };

    db.saveUser(newUser);
    login(newUser);
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '60px', marginBottom: '60px' }}>
      <div className="form-card">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Create an Account</h2>
        
        {error && (
          <div style={{ backgroundColor: 'var(--color-terracotta-light)', color: 'var(--color-terracotta)', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name <span className="required">*</span></label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Siphelele Malotana" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

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
            <label>Phone Number</label>
            <input 
              type="tel" 
              className="form-control" 
              placeholder="e.g. +27 82 123 4567" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Password <span className="required">*</span></label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Create a strong password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: '10px' }}>
            Register
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={() => navigateTo('login')}
            style={{ background: 'none', border: 'none', color: 'var(--color-green)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
