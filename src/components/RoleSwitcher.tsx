import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../db/schema';
import { Shield, Award, User, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, switchRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'community',
      label: 'Community User',
      desc: 'Siphelele Malotana',
      icon: <User size={16} />,
      color: 'var(--color-green)',
    },
    {
      role: 'response',
      label: 'Response Team',
      desc: 'Officer Thabo Ndlovu',
      icon: <Award size={16} />,
      color: 'var(--color-gold)',
    },
    {
      role: 'admin',
      label: 'Administrator',
      desc: 'Sarah Jenkins',
      icon: <Shield size={16} />,
      color: 'var(--color-terracotta)',
    },
  ];

  const getActiveRoleLabel = () => {
    switch (currentRole) {
      case 'admin': return 'Admin View';
      case 'response': return 'Response View';
      default: return 'User View';
    }
  };

  const getActiveColor = () => {
    switch (currentRole) {
      case 'admin': return 'var(--color-terracotta)';
      case 'response': return 'var(--color-gold)';
      default: return 'var(--color-green)';
    }
  };

  return (
    <div className="role-switcher-floating">
      <button 
        className="role-switcher-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderColor: getActiveColor() }}
      >
        <RefreshCw size={14} className="spin-on-hover" />
        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{getActiveRoleLabel()}</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {isOpen && (
        <div className="role-switcher-dropdown">
          <div className="dropdown-header">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Demo Persona
            </span>
          </div>
          <div className="dropdown-options">
            {rolesList.map((item) => {
              const isSelected = currentRole === item.role;
              return (
                <button
                  key={item.role}
                  className={`dropdown-option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    switchRole(item.role);
                    setIsOpen(false);
                  }}
                  style={{
                    borderLeft: isSelected ? `3px solid ${item.color}` : '3px solid transparent'
                  }}
                >
                  <div className="option-icon-wrapper" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', textAlign: 'left' }}>
                    <span className="option-label" style={{ fontWeight: isSelected ? 600 : 500, fontSize: '0.85rem' }}>
                      {item.label}
                    </span>
                    <span className="option-desc" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
