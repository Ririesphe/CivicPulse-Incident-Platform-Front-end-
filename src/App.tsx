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
        <footer className="site-footer">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '30px' }}>
            <div className="footer-logo-section">
              <div className="footer-logo-name">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 3C10.5 3 6 7.5 6 13C6 20.5 16 29 16 29C16 29 26 20.5 26 13C26 7.5 21.5 3 16 3Z" fill="#3B82F6" />
                  <path d="M10 13H12.5L14.5 10L16.5 16L18.5 13H22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Civic<span>Pulse</span>
              </div>
              <p>
                An intelligent community incident reporting platform built for municipal transparency and citizen action.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
              <div>
                <h4>Platform Navigation</h4>
                <ul>
                  <li><button onClick={() => navigateTo('home')}>Home</button></li>
                  <li><button onClick={() => navigateTo('report')}>Report Incident</button></li>
                  <li><button onClick={() => navigateTo('map')}>Community Map</button></li>
                  <li><button onClick={() => navigateTo('incidents')}>Incident Registry</button></li>
                </ul>
              </div>

              <div>
                <h4>Resources & Info</h4>
                <ul>
                  <li><button onClick={() => navigateTo('how-it-works')}>How It Works</button></li>
                  <li><button onClick={() => navigateTo('about')}>About Us</button></li>
                  <li><a href="https://capetown.gov.za" target="_blank" rel="noreferrer">City of Cape Town Portal</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="container site-footer-bottom">
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
