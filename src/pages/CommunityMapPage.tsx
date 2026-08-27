import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import type { Incident } from '../db/schema';
import LeafletMap from '../components/LeafletMap';
import { Filter, Search, AlertCircle, RefreshCw } from 'lucide-react';

export const CommunityMapPage: React.FC = () => {
  const { navigateTo, refreshTrigger } = useApp();
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // 'active' | 'resolved' | ''
  
  // Selected map focus coordinate
  const [mapCenter, setMapCenter] = useState<[number, number]>([-33.9249, 18.4241]);
  const [mapZoom, setMapZoom] = useState(13);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getIncidents();
      setIncidents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [refreshTrigger]);

  // Filter logic
  const filteredIncidents = incidents.filter((inc) => {
    // Search filter
    const matchesSearch = 
      inc.title.toLowerCase().includes(search.toLowerCase()) || 
      inc.description.toLowerCase().includes(search.toLowerCase()) || 
      inc.address.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase());
      
    // Category filter
    const matchesCategory = selectedCategory ? inc.category === selectedCategory : true;
    
    // Severity filter
    const matchesSeverity = selectedSeverity ? inc.severity === selectedSeverity : true;
    
    // Status filter
    let matchesStatus = true;
    if (selectedStatus === 'resolved') {
      matchesStatus = inc.status === 'Resolved' || inc.status === 'Closed';
    } else if (selectedStatus === 'active') {
      matchesStatus = inc.status !== 'Resolved' && inc.status !== 'Closed';
    }

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  const handleFocusIncident = (inc: Incident) => {
    setMapCenter([inc.latitude, inc.longitude]);
    setMapZoom(16);
    // Simple DOM click simulation or let Leaflet focus. 
    // The map wrapper will pan automatically when center changes.
  };

  return (
    <div className="community-map-page" style={{ height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden' }}>
      {/* Sidebar Filter and Listings Panel */}
      <div className="map-sidebar" style={{ width: '380px', borderRight: '1px solid var(--color-sand)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', flexShrink: 0 }}>
        
        {/* Search */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-sand)' }}>
          <h2 style={{ fontSize: '1.15rem', margin: '0 0 12px 0', fontFamily: 'var(--font-heading)' }}>Community Map</h2>
          <div className="search-input-wrapper" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--color-sand-dark)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
              placeholder="Search address, ID, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter controls */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-sand)', backgroundColor: 'var(--color-off-white)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            <Filter size={12} />
            <span>Filter Platform Records</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <select
              className="form-control"
              style={{ fontSize: '0.8rem', padding: '6px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Roads & Transport">Roads & Transport</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Electricity">Electricity</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Environment">Environment</option>
              <option value="Other">Other</option>
            </select>

            <select
              className="form-control"
              style={{ fontSize: '0.8rem', padding: '6px' }}
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <select
            className="form-control"
            style={{ fontSize: '0.8rem', padding: '6px' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active Reports</option>
            <option value="resolved">Resolved / Closed</option>
          </select>
        </div>

        {/* Listings Result */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <RefreshCw className="spin-animation" size={24} style={{ margin: '0 auto 8px' }} />
              <span style={{ fontSize: '0.85rem' }}>Loading incidents...</span>
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 8px', color: 'var(--color-sand-dark)' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>No incidents match criteria</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Try clearing filters or adjusting search queries.</p>
            </div>
          ) : (
            <div className="sidebar-list">
              <div style={{ padding: '10px 16px', fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, borderBottom: '1px solid var(--color-sand-light)' }}>
                SHOWING {filteredIncidents.length} INCIDENTS
              </div>
              {filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="sidebar-inc-card"
                  onClick={() => handleFocusIncident(inc)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--color-sand-light)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-sand-dark)' }}>{inc.id}</span>
                    <span className={`status-badge status-${inc.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.65rem' }}>
                      {inc.status}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--color-charcoal)', fontWeight: 600 }}>
                    {inc.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    📍 {inc.address.split(',')[0]}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '8px', color: 'var(--color-text-muted)' }}>
                    <span>Severity: <strong style={{ color: inc.severity === 'High' || inc.severity === 'Critical' ? 'var(--color-terracotta)' : 'inherit' }}>{inc.severity}</strong></span>
                    <span>Category: <b>{inc.category}</b></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Map Container */}
      <div style={{ flex: 1, height: '100%', position: 'relative' }}>
        <LeafletMap
          incidents={filteredIncidents}
          center={mapCenter}
          zoom={mapZoom}
          onSelectIncident={(id) => navigateTo('incident-details', id)}
        />
      </div>
    </div>
  );
};

export default CommunityMapPage;
