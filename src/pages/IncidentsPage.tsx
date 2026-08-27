import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import { db } from '../db/mockDb';
import type { Incident } from '../db/schema';
import { Search, ArrowUpDown, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const { navigateTo, refreshTrigger } = useApp();
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');

  // Sorting State
  const [sortField, setSortField] = useState<'id' | 'reports' | 'created_at' | 'severity'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Severity Weight helper for sorting
  const getSeverityWeight = (sev: Incident['severity']) => {
    switch (sev) {
      case 'Critical': return 4;
      case 'High': return 3;
      case 'Medium': return 2;
      default: return 1;
    }
  };

  // Filtered incidents
  const filteredList = incidents.filter((inc) => {
    const matchesSearch = 
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.description.toLowerCase().includes(search.toLowerCase()) ||
      inc.address.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category ? inc.category === category : true;
    const matchesSeverity = severity ? inc.severity === severity : true;
    const matchesStatus = status ? inc.status === status : true;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  // Sorted incidents
  const sortedList = [...filteredList].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'created_at') {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortField === 'id') {
      comparison = a.id.localeCompare(b.id);
    } else if (sortField === 'reports') {
      const aReports = db.getReports().filter(r => r.incident_id === a.id).length;
      const bReports = db.getReports().filter(r => r.incident_id === b.id).length;
      comparison = aReports - bReports;
    } else if (sortField === 'severity') {
      comparison = getSeverityWeight(a.severity) - getSeverityWeight(b.severity);
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return (
    <div className="incidents-page-container container" style={{ padding: '40px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Incident Registry</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            Browse and search community incident reports logged in the municipal grid.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '16px', border: '1px solid var(--color-sand)', borderRadius: '6px', backgroundColor: 'var(--color-white)', marginBottom: '24px', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
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

        {/* Category */}
        <select
          className="form-control"
          style={{ width: '160px', fontSize: '0.85rem' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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

        {/* Severity */}
        <select
          className="form-control"
          style={{ width: '140px', fontSize: '0.85rem' }}
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="">All Severities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        {/* Status */}
        <select
          className="form-control"
          style={{ width: '150px', fontSize: '0.85rem' }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Reported">Reported</option>
          <option value="AI Verified">AI Verified</option>
          <option value="Assigned">Assigned</option>
          <option value="Investigating">Investigating</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Incident Table */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <RefreshCw className="spin-animation" size={28} style={{ margin: '0 auto 12px' }} />
          <span style={{ fontSize: '0.9rem' }}>Fetching records...</span>
        </div>
      ) : sortedList.length === 0 ? (
        <div style={{ padding: '60px 20px', border: '1px solid var(--color-sand)', borderRadius: '6px', backgroundColor: 'var(--color-white)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <AlertCircle size={36} style={{ margin: '0 auto 12px', color: 'var(--color-sand-dark)' }} />
          <p style={{ margin: 0, fontWeight: 600 }}>No incidents found</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>No records matched your search filters.</p>
        </div>
      ) : (
        <div className="table-responsive" style={{ border: '1px solid var(--color-sand)', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--color-white)' }}>
          <table className="incidents-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-off-white)', borderBottom: '1px solid var(--color-sand)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Incident ID</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('severity')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Severity</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('reports')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Reports</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Date Reported</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>Assigned Team</th>
                <th style={{ padding: '12px 16px' }}></th>
              </tr>
            </thead>
            <tbody>
              {sortedList.map((inc) => {
                const reportsCount = db.getReports().filter(r => r.incident_id === inc.id).length;
                const formattedDate = new Date(inc.created_at).toLocaleDateString('en-ZA', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <tr
                    key={inc.id}
                    onClick={() => navigateTo('incident-details', inc.id)}
                    className="table-row-hover"
                    style={{ borderBottom: '1px solid var(--color-sand-light)', cursor: 'pointer', transition: 'background-color 0.15s' }}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-charcoal)' }}>{inc.id}</td>
                    <td style={{ padding: '14px 16px' }}>{inc.category}</td>
                    <td style={{ padding: '14px 16px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={inc.address}>
                      {inc.address.split(',')[0]}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span 
                        style={{ 
                          fontWeight: 600,
                          color: inc.severity === 'High' || inc.severity === 'Critical' ? 'var(--color-terracotta)' : 'inherit'
                        }}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{reportsCount}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`status-badge status-${inc.status.toLowerCase().replace(' ', '-')}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{formattedDate}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                      {inc.assigned_team || 'Unassigned'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <ChevronRight size={16} style={{ color: 'var(--color-sand-dark)' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncidentsPage;
