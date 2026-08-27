import React, { useState } from 'react';
import { AppContextProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import NotificationCenter from './components/NotificationCenter';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import ReportIncidentPage from './pages/ReportIncidentPage';
import AIAnalysisPage from './pages/AIAnalysisPage';
import CommunityMapPage from './pages/CommunityMapPage';
import IncidentsPage from './pages/IncidentsPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import DashboardPage from './pages/DashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import { HowItWorks, About } from './pages/StaticPages';
import Logo from './components/Logo';

const AppContent: React.FC = () => {
  const { currentPage, navigateTo } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage />;
      case 'report':
        return <ReportIncidentPage />;
      case 'map':
        return <CommunityMapPage />;
      case 'incidents':
        return <IncidentsPage />;
      case 'how-it-works':
        return <HowItWorks />;
      case 'about':
        return <About />;
      case 'user-dashboard':
        return <UserDashboardPage />;
      case 'admin-dashboard':
        return <DashboardPage />;
      case 'incident-details':
        return <IncidentDetailsPage />;
      case 'ai-analysis':
        return <AIAnalysisPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      default:
        return <LandingPage />;
    }
  };

  // Maps take full screen, other views require container layout margins
  const isFullWidthPage = currentPage === 'map';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Header */}
      <Navigation onToggleNotifications={() => setNotifOpen(!notifOpen)} />

      {/* Main Render Area */}
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      {/* Footer (Not displayed on Map to prevent scroll layout conflicts) */}
      {!isFullWidthPage && (
        <footer style={{ borderTop: '1px solid var(--color-sand)', backgroundColor: 'var(--color-white)', padding: '40px 0', marginTop: 'auto' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '30px' }}>
            <div style={{ maxWidth: '320px' }}>
              <Logo />
              <p style={{ margin: '12px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                An intelligent community incident reporting platform built for municipal transparency and citizen action.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: '12px', letterSpacing: '0.05em' }}>
                  Platform Navigation
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <li><button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>Home</button></li>
                  <li><button onClick={() => navigateTo('report')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>Report Incident</button></li>
                  <li><button onClick={() => navigateTo('map')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>Community Map</button></li>
                  <li><button onClick={() => navigateTo('incidents')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>Incident Registry</button></li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: '12px', letterSpacing: '0.05em' }}>
                  Resources & Info
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <li><button onClick={() => navigateTo('how-it-works')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>How It Works</button></li>
                  <li><button onClick={() => navigateTo('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>About Us</button></li>
                  <li><a href="https://capetown.gov.za" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)' }}>City of Cape Town Portal</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="container" style={{ borderTop: '1px solid var(--color-sand-light)', marginTop: '30px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <span>© {new Date().getFullYear()} CivicPulse. Turning community voices into action.</span>
            <span>Simulated Hackathon Environment • South African Metros Initiative</span>
          </div>
        </footer>
      )}

      {/* Slide-over notifications list */}
      <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
};

export default App;
