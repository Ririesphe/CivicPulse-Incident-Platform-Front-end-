import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, CheckCheck, Info, AlertTriangle, AlertCircle, Calendar } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markNotificationAsRead, clearNotifications, navigateTo } = useApp();

  if (!isOpen) return null;

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.incident_id) {
      navigateTo('incident-details', notif.incident_id);
    }
    onClose();
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: 'var(--color-gold)' }} />;
      case 'alert':
        return <AlertCircle size={18} style={{ color: 'var(--color-terracotta)' }} />;
      default:
        return <Info size={18} style={{ color: 'var(--color-green)' }} />;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="notif-center-overlay" onClick={onClose}>
      <div className="notif-center-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notif-center-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="notif-count-badge">{unreadCount} new</span>
            )}
          </div>
          <button className="notif-close-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="notif-center-toolbar">
          {notifications.length > 0 && (
            <button 
              className="notif-action-btn"
              onClick={clearNotifications}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        <div className="notif-center-list">
          {notifications.length === 0 ? (
            <div className="notif-empty-state">
              <Info size={32} style={{ color: 'var(--color-sand)', marginBottom: '8px' }} />
              <p style={{ margin: 0, fontWeight: 500 }}>All caught up!</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                You have no notifications at this time.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`notif-item ${!notif.read ? 'unread' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ marginTop: '2px' }}>{getNotifIcon(notif.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', width: '100%' }}>
                      <span className="notif-title" style={{ fontWeight: !notif.read ? 600 : 500, fontSize: '0.9rem' }}>
                        {notif.title}
                      </span>
                      {!notif.read && <span className="unread-dot" />}
                    </div>
                    <p className="notif-message" style={{ margin: '4px 0', fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      {notif.message}
                    </p>
                    <div className="notif-time-row" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                      <Calendar size={10} />
                      <span>{formatDate(notif.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const CheckCircleIcon = () => (
  <div style={{ 
    width: '18px', 
    height: '18px', 
    borderRadius: '50%', 
    background: 'var(--color-green-light)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    <Check size={12} style={{ color: 'var(--color-green)' }} />
  </div>
);

export default NotificationCenter;
