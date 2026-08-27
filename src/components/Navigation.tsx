import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PageType } from '../context/AppContext';
import { Logo } from './Logo';
import { Bell, Menu, X, PlusCircle, User, Award, Shield } from 'lucide-react';

interface NavigationProps {
  onToggleNotifications: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onToggleNotifications }) => {
  const { currentPage, currentRole, navigateTo, unreadCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageType; roles?: string[] }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Report Incident', page: 'report' },
    { label: 'Community Map', page: 'map' },
    { label: 'Incidents', page: 'incidents' },
    { label: 'How It Works', page: 'how-it-works' },
    { label: 'About', page: 'about' },
  ];

  const handleNavClick = (page: PageType) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  const getRoleIcon = () => {
    switch (currentRole) {
      case 'admin':
        return <Shield size={16} style={{ color: 'var(--color-terracotta)' }} />;
      case 'response':
        return <Award size={16} style={{ color: 'var(--color-gold)' }} />;
      default:
        return <User size={16} style={{ color: 'var(--color-green)' }} />;
    }
  };

  const getRoleLabel = () => {
    switch (currentRole) {
      case 'admin': return 'Administrator';
      case 'response': return 'Response Team';
      default: return 'Community Member';
    }
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div onClick={() => handleNavClick('home')}>
          <Logo />
        </div>

        {/* Desktop Nav Items */}
        <nav className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="desktop-actions">
          {/* Dashboard shortcuts for response/admin */}
          {currentRole === 'admin' && (
            <button 
              onClick={() => handleNavClick('admin-dashboard')}
              className={`nav-link-btn ${currentPage === 'admin-dashboard' ? 'active' : ''}`}
              style={{ fontWeight: 600 }}
            >
              Admin Dashboard
            </button>
          )}

          {currentRole === 'community' && (
            <button 
              onClick={() => handleNavClick('user-dashboard')}
              className={`nav-link-btn ${currentPage === 'user-dashboard' ? 'active' : ''}`}
              style={{ fontWeight: 600 }}
            >
              My Reports
            </button>
          )}

          {/* User profile role badge */}
          <div className="role-profile-badge" title={`Logged in as ${getRoleLabel()}`}>
            {getRoleIcon()}
            <span className="role-badge-text">{getRoleLabel()}</span>
          </div>

          {/* Notifications Trigger */}
          <button 
            className="notif-trigger-btn" 
            onClick={onToggleNotifications}
            aria-label="Open notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge-dot">{unreadCount}</span>}
          </button>

          {/* Report an Incident button CTA */}
          <button 
            className="btn btn-primary btn-icon"
            onClick={() => handleNavClick('report')}
          >
            <PlusCircle size={16} />
            <span>Report an Incident</span>
          </button>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="mobile-toggle-wrapper">
          <button
            className="notif-trigger-btn"
            onClick={onToggleNotifications}
            style={{ marginRight: '8px' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge-dot">{unreadCount}</span>}
          </button>
          
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Logo />
              <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="mobile-role-info">
              {getRoleIcon()}
              <span>Logged in as <strong>{getRoleLabel()}</strong></span>
            </div>

            <nav className="mobile-nav-links">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`mobile-nav-link ${currentPage === link.page ? 'active' : ''}`}
                >
                  {link.label}
                </button>
              ))}

              {currentRole === 'admin' && (
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`mobile-nav-link ${currentPage === 'admin-dashboard' ? 'active' : ''}`}
                >
                  Admin Dashboard
                </button>
              )}

              {currentRole === 'community' && (
                <button
                  onClick={() => handleNavClick('user-dashboard')}
                  className={`mobile-nav-link ${currentPage === 'user-dashboard' ? 'active' : ''}`}
                >
                  My Reports
                </button>
              )}
            </nav>

            <div className="mobile-drawer-actions">
              <button
                className="btn btn-primary w-full btn-icon"
                style={{ justifyContent: 'center' }}
                onClick={() => handleNavClick('report')}
              >
                <PlusCircle size={16} />
                <span>Report an Incident</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navigation;
