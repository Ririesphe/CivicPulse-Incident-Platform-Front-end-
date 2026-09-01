import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PageType } from '../context/AppContext';
import { Logo } from './Logo';
import { Bell, Menu, X, PlusCircle, User, Award, Shield, LogOut } from 'lucide-react';

interface NavigationProps {
  onToggleNotifications: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onToggleNotifications }) => {
  const { currentPage, currentUser, navigateTo, unreadCount, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    // { label: 'Community Map', page: 'map' }, // map removed for competition version
    { label: 'Incidents', page: 'incidents' },
  ];

  const handleNavClick = (page: PageType) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  const getRoleIcon = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'admin':
        return <Shield size={16} style={{ color: 'var(--color-terracotta)' }} />;
      case 'response':
        return <Award size={16} style={{ color: 'var(--color-gold)' }} />;
      default:
        return <User size={16} style={{ color: 'var(--color-green)' }} />;
    }
  };

  const getRoleLabel = () => {
    if (!currentUser) return '';
    switch (currentUser.role) {
      case 'admin': return 'Administrator';
      case 'response': return 'Response Team';
      default: return 'Community Member';
    }
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Left side: Logo and Nav Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Brand Logo */}
          <div onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
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
        </div>

        {/* Right side actions */}
        <div className="desktop-actions">
          {currentUser ? (
            <>
              {/* Dashboard shortcuts for response/admin */}
              {currentUser.role === 'admin' && (
                <button 
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`nav-link-btn ${currentPage === 'admin-dashboard' ? 'active' : ''}`}
                  style={{ fontWeight: 600 }}
                >
                  Admin Dashboard
                </button>
              )}

              {currentUser.role === 'community' && (
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
                <span className="role-badge-text">{currentUser.name}</span>
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

              <button 
                className="btn btn-outline btn-icon btn-sm"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn btn-outline"
                onClick={() => handleNavClick('login')}
              >
                Sign In
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => handleNavClick('register')}
              >
                Register
              </button>
            </>
          )}

          {/* Report an Incident button CTA — only visible when logged in */}
          {currentUser && (
            <button
              className="btn btn-primary btn-icon"
              onClick={() => handleNavClick('report')}
            >
              <PlusCircle size={16} />
              <span>Report an Incident</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="mobile-toggle-wrapper">
          {currentUser && (
            <button
              className="notif-trigger-btn"
              onClick={onToggleNotifications}
              style={{ marginRight: '8px' }}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notif-badge-dot">{unreadCount}</span>}
            </button>
          )}
          
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

            {currentUser ? (
              <div className="mobile-role-info">
                {getRoleIcon()}
                <span>{currentUser.name} (<strong>{getRoleLabel()}</strong>)</span>
              </div>
            ) : (
              <div style={{ padding: '16px 24px', display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-outline w-full"
                  onClick={() => handleNavClick('login')}
                >
                  Sign In
                </button>
                <button 
                  className="btn btn-secondary w-full"
                  onClick={() => handleNavClick('register')}
                >
                  Register
                </button>
              </div>
            )}

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

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`mobile-nav-link ${currentPage === 'admin-dashboard' ? 'active' : ''}`}
                >
                  Admin Dashboard
                </button>
              )}

              {currentUser?.role === 'community' && (
                <button
                  onClick={() => handleNavClick('user-dashboard')}
                  className={`mobile-nav-link ${currentPage === 'user-dashboard' ? 'active' : ''}`}
                >
                  My Reports
                </button>
              )}
            </nav>

            <div className="mobile-drawer-actions">
              {currentUser && (
                <button
                  className="btn btn-primary w-full btn-icon"
                  style={{ justifyContent: 'center', marginBottom: '10px' }}
                  onClick={() => handleNavClick('report')}
                >
                  <PlusCircle size={16} />
                  <span>Report an Incident</span>
                </button>
              )}

              {currentUser && (
                <button
                  className="btn btn-outline w-full btn-icon"
                  style={{ justifyContent: 'center' }}
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navigation;
