import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import type { AIAnalysis, Incident } from '../db/schema';
import { db } from '../db/mockDb';
import { Brain, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export const AIAnalysisPage: React.FC = () => {
  const { navigateTo, currentUser, triggerRefresh } = useApp();

  if (!currentUser) return null;
  
  // Loading & Result States
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysis | null>(null);
  const [duplicateIncident, setDuplicateIncident] = useState<Incident | null>(null);
  const [tempReport, setTempReport] = useState<any>(null);

  useEffect(() => {
    // 1. Fetch temp report data from sessionStorage
    const stored = sessionStorage.getItem('civicpulse_temp_report');
    if (!stored) {
      navigateTo('report');
      return;
    }
    const reportData = JSON.parse(stored);
    setTempReport(reportData);

    // 2. Trigger AI analysis simulation
    const runAnalysis = async () => {
      try {
        const result = await apiClient.analyzeReport(reportData);
        setAnalysisResult(result);
        
        // Check if duplicate is found
        if (result.possible_duplicate_id) {
          const match = await apiClient.getIncidentById(result.possible_duplicate_id);
          setDuplicateIncident(match);
        }
        setAnalyzing(false);
      } catch (err) {
        console.error('AI Analysis failed:', err);
        setAnalyzing(false);
      }
    };

    runAnalysis();
  }, []);

  const handleMergeReport = async () => {
    if (!tempReport || !analysisResult || !duplicateIncident) return;
    
    // Submit report, linking it to the existing incident ID
    await apiClient.submitReport(
      {
        ...tempReport,
        userId: currentUser.id,
      },
      analysisResult,
      duplicateIncident.id
    );

    // Clean session
    sessionStorage.removeItem('civicpulse_temp_report');
    triggerRefresh();
    
    // Navigate to incident details
    navigateTo('incident-details', duplicateIncident.id);
  };

  const handleContinueAnyway = async () => {
    if (!tempReport || !analysisResult) return;

    // Submit report as a BRAND NEW incident
    const res = await apiClient.submitReport(
      {
        ...tempReport,
        userId: currentUser.id,
      },
      analysisResult,
      null // No link
    );

    // Clean session
    sessionStorage.removeItem('civicpulse_temp_report');
    triggerRefresh();

    // Navigate to new incident details
    navigateTo('incident-details', res.incident.id);
  };

  if (analyzing) {
    return (
      <div className="ai-analysis-loading container" style={{ maxWidth: '600px', padding: '80px 16px', textAlign: 'center' }}>
        <div className="ai-pulse-circle">
          <Brain size={48} className="brain-spin-animation" style={{ color: 'var(--color-green)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '24px' }}>Analysing your report...</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '8px auto 0' }}>
          Our AI engine is extracting keywords, locating coordinates, assessing severity, and scanning database records for duplicates.
        </p>
        
        {/* Animated Progress Bar */}
        <div className="analysis-progress-bar" style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-sand)', borderRadius: '2px', overflow: 'hidden', marginTop: '32px' }}>
          <div className="progress-bar-fill"></div>
        </div>
        
        <div className="analysis-steps-list" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>📍 Resolving GPS coordinates...</span>
        </div>
      </div>
    );
  }

  const reportsCount = duplicateIncident 
    ? db.getReports().filter(r => r.incident_id === duplicateIncident.id).length 
    : 0;

  return (
    <div className="ai-analysis-page container" style={{ maxWidth: '750px', padding: '40px 16px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div className="feature-icon-circle" style={{ background: 'var(--color-green-light)', margin: 0, width: '40px', height: '40px' }}>
          <Brain size={20} style={{ color: 'var(--color-green)' }} />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>AI Assessment Complete</h1>
          <p style={{ margin: '2px 0 0', color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
            We processed your description and mapped it to the city database.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* AI Diagnostics details */}
        <div className="form-card" style={{ margin: 0 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', borderBottom: '1px solid var(--color-sand)', paddingBottom: '8px' }}>
            Parsed Entity Parameters
          </h3>
          
          <div className="ai-param-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-sand-light)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Detected Category</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{analysisResult?.category}</span>
          </div>

          <div className="ai-param-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-sand-light)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Severity Level</span>
            <span 
              style={{ 
                fontSize: '0.85rem', 
                fontWeight: 600,
                color: analysisResult?.severity === 'High' || analysisResult?.severity === 'Critical' ? 'var(--color-terracotta)' : 'var(--color-gold)'
              }}
            >
              {analysisResult?.severity}
            </span>
          </div>

          <div className="ai-param-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-sand-light)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Location Focus</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tempReport?.address.split(',')[0]}</span>
          </div>

          <div className="ai-param-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-sand-light)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>AI Confidence Score</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-green)' }}>
              {analysisResult?.confidence}%
            </span>
          </div>

          <div className="ai-summary-box" style={{ marginTop: '16px', backgroundColor: 'var(--color-off-white)', padding: '12px', borderRadius: '4px', borderLeft: '3px solid var(--color-green)' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              Structured Summary
            </span>
            <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.4, color: 'var(--color-charcoal)' }}>
              {analysisResult?.summary}
            </p>
          </div>
        </div>

        {/* Action Panel / Duplicate warnings */}
        <div>
          {duplicateIncident ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="warning-card" style={{ border: '1px solid rgba(184,92,56,0.2)', backgroundColor: '#FBEBE6', borderRadius: '6px', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-terracotta)', marginBottom: '8px' }}>
                  <AlertTriangle size={18} />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Potential Duplicate Detected</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.4, color: 'var(--color-charcoal)' }}>
                  We found a similar active report within approximately 300 metres of your location. Your report can be linked to this existing incident.
                </p>
              </div>

              {/* Duplicate Card Detail */}
              <div className="form-card" style={{ margin: 0, padding: '14px', border: '1px solid var(--color-sand)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    EXISTING INCIDENT
                  </span>
                  <span className={`status-badge status-${duplicateIncident.status.toLowerCase().replace(' ', '-')}`}>
                    {duplicateIncident.status}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-charcoal)' }}>
                  {duplicateIncident.title}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '10px' }}>
                  📍 {duplicateIncident.address}
                </span>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', borderTop: '1px solid var(--color-sand-light)', paddingTop: '8px' }}>
                  <span>Incident ID: <b>{duplicateIncident.id}</b></span>
                  <span>Impact: <b style={{ color: 'var(--color-terracotta)' }}>{reportsCount} community reports</b></span>
                </div>
              </div>

              {/* Dual Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleMergeReport}
                  className="btn btn-primary w-full btn-icon"
                  style={{ justifyContent: 'center' }}
                >
                  <span>Link to Existing Incident</span>
                  <ChevronRight size={16} />
                </button>
                
                <button
                  onClick={handleContinueAnyway}
                  className="btn btn-secondary w-full"
                  style={{ justifyContent: 'center' }}
                >
                  Create New Report Anyway
                </button>
              </div>
            </div>
          ) : (
            // No duplicates, prompt simple submit
            <div className="form-card" style={{ margin: 0, textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--color-green-light)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px' 
              }}>
                <CheckCircle2 size={24} style={{ color: 'var(--color-green)' }} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem' }}>No Duplicates Detected</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                This appears to be a new incident. Confirm and submit to file it in the registry.
              </p>
              
              <button
                onClick={handleContinueAnyway}
                className="btn btn-primary w-full btn-icon"
                style={{ justifyContent: 'center' }}
              >
                <span>File New Incident Report</span>
                <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPage;
