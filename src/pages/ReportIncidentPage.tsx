import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/LeafletMap';
import { MapPin, Image as ImageIcon, Video, User, Phone, AlertCircle, Zap, Info, CheckCircle2 } from 'lucide-react';

// Seed locations for Cape Town to make selection easy
const CAPE_TOWN_NEIGHBORHOODS = [
  { name: 'Cape Town CBD (Darling St)', lat: -33.9228, lng: 18.4278 },
  { name: 'Woodstock (Albert Rd)', lat: -33.9275, lng: 18.4482 },
  { name: 'Observatory (Lower Main Rd)', lat: -33.9358, lng: 18.4715 },
  { name: 'Khayelitsha (Spine Rd)', lat: -34.0209, lng: 18.6657 },
  { name: 'Mitchells Plain (AZ Berman Dr)', lat: -34.0487, lng: 18.6049 },
  { name: 'Bellville (Voortrekker Rd)', lat: -33.8986, lng: 18.6293 },
];

export const ReportIncidentPage: React.FC = () => {
  const { navigateTo, currentUser } = useApp();

  if (!currentUser) return null;

  // Form State
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [contactName, setContactName] = useState(currentUser.name);
  const [contactPhone, setContactPhone] = useState(currentUser.phone);
  const [anonymous, setAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  
  // Validation / UI States
  const [errorMsg, setErrorMsg] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleSelectCoords = (lat: number, lng: number) => {
    setCoords({ lat, lng });
    // Reverse geocode simulation
    const matchedArea = CAPE_TOWN_NEIGHBORHOODS.find(n => {
      const diffLat = Math.abs(n.lat - lat);
      const diffLng = Math.abs(n.lng - lng);
      return diffLat < 0.005 && diffLng < 0.005;
    });
    if (matchedArea) {
      setAddress(`${matchedArea.name}, Cape Town`);
    } else {
      setAddress(`${lat.toFixed(4)}°S, ${lng.toFixed(4)}°E, South Africa`);
    }
  };

  const handleUseCurrentLocation = () => {
    setGpsLoading(true);
    setErrorMsg('');
    
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      setGpsLoading(false);
      // Fallback to CBD
      handleSelectCoords(-33.9228, 18.4278);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleSelectCoords(latitude, longitude);
        setGpsLoading(false);
      },
      (error) => {
        console.error(error);
        setErrorMsg('Unable to retrieve GPS location. Placing marker at City Centre.');
        setGpsLoading(false);
        // Fallback to CBD
        handleSelectCoords(-33.9228, 18.4278);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Mock Photo selector to make it easy to demo pothole photo upload
  const selectMockPhoto = (type: 'pothole' | 'leak' | 'dumping') => {
    let url = '';
    if (type === 'pothole') url = 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600';
    if (type === 'leak') url = 'https://images.unsplash.com/photo-1542013936693-8848e574047e?auto=format&fit=crop&q=80&w=600';
    if (type === 'dumping') url = 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600';
    setImageFile(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!description.trim()) {
      setErrorMsg('Please describe the incident.');
      return;
    }
    if (!coords) {
      setErrorMsg('Please select a location on the map or click GPS location.');
      return;
    }

    // Prepare temp state and navigate to AI page
    const tempReportData = {
      description,
      latitude: coords.lat,
      longitude: coords.lng,
      address: address || 'Cape Town',
      contactName: anonymous ? 'Anonymous' : contactName,
      contactPhone: anonymous ? '' : contactPhone,
      anonymous,
      imageUrl: imageFile,
      videoUrl: videoFile,
    };

    // Stash in sessionStorage to pass to the AI analysis page
    sessionStorage.setItem('civicpulse_temp_report', JSON.stringify(tempReportData));
    navigateTo('ai-analysis');
  };

  // Fill sample data helper for quick hackathon demo
  const fillSampleDemoData = () => {
    setDescription("There's a massive pothole outside the taxi rank in Cape Town CBD. Cars are swerving into traffic to avoid it.");
    setCategory('Roads & Transport');
    handleSelectCoords(-33.9228, 18.4278);
    setImageFile('https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600');
  };

  return (
    <div className="report-incident-page container" style={{ maxWidth: '850px', padding: '40px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Report an Incident</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Submit a community issue. Our AI triages it instantly for municipal action.
          </p>
        </div>
        <button 
          type="button" 
          onClick={fillSampleDemoData}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '6px 12px' }}
        >
          <Zap size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Load Hackathon Demo Scenario
        </button>
      </div>

      {errorMsg && (
        <div className="error-alert" style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#FBEBE6', color: 'var(--color-terracotta)', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(184,92,56,0.2)' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-card">
        {/* Step 1: Description */}
        <div className="form-group">
          <label htmlFor="description">Incident Description <span className="required">*</span></label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened... e.g. There is a large pothole near the taxi rank that is causing traffic and forcing drivers into the opposite lane."
            required
            className="form-control"
          ></textarea>
        </div>

        {/* Step 2: Location Selection */}
        <div className="form-group">
          <label>Location Details <span className="required">*</span></label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Select on map or enter an address..."
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              disabled={gpsLoading}
              onClick={handleUseCurrentLocation}
            >
              <MapPin size={16} />
              <span>{gpsLoading ? 'Pinpointing GPS...' : 'My Location'}</span>
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', height: '320px' }}>
            <div className="preset-neighborhoods" style={{ border: '1px solid var(--color-sand)', borderRadius: '6px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: 'var(--color-white)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                Preset Locations
              </span>
              {CAPE_TOWN_NEIGHBORHOODS.map((n) => (
                <button
                  key={n.name}
                  type="button"
                  onClick={() => handleSelectCoords(n.lat, n.lng)}
                  className={`preset-location-btn ${coords && coords.lat === n.lat ? 'active' : ''}`}
                  style={{
                    textAlign: 'left',
                    padding: '8px',
                    fontSize: '0.82rem',
                    border: '1px solid var(--color-sand)',
                    background: coords && coords.lat === n.lat ? 'var(--color-green-light)' : 'none',
                    color: coords && coords.lat === n.lat ? 'var(--color-green)' : 'var(--color-charcoal)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: coords && coords.lat === n.lat ? 600 : 400
                  }}
                >
                  {n.name}
                </button>
              ))}
            </div>
            
            <LeafletMap
              selectedCoords={coords}
              onSelectCoords={handleSelectCoords}
              center={coords ? [coords.lat, coords.lng] : [-33.9249, 18.4241]}
              zoom={13}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '6px' }}>
            <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: 'var(--color-text-muted)' }} /> Tip: Click on the map to fine-tune the exact incident coordinates or drag the black selection pin.
          </span>
        </div>

        {/* Step 3: Incident Category (Manual select - AI overrides if needed, or matches it) */}
        <div className="form-group">
          <label htmlFor="category">Category (Optional - AI will auto-categorize if left blank)</label>
          <select
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Let AI Analyze & Categorize</option>
            <option value="Roads & Transport">Roads & Transport</option>
            <option value="Water & Sanitation">Water & Sanitation</option>
            <option value="Electricity">Electricity</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Public Safety">Public Safety</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Environment">Environment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Step 4: Optional Fields - Uploads */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div className="form-group">
            <label>Image Evidence</label>
            <div className="mock-upload-area" style={{ border: '2px dashed var(--color-sand)', padding: '16px', borderRadius: '6px', textAlign: 'center', backgroundColor: 'var(--color-white)' }}>
              {imageFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={imageFile} alt="Preview" style={{ height: '70px', borderRadius: '4px', marginBottom: '8px' }} />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setImageFile(null)}>Remove Image</button>
                </div>
              ) : (
                <div>
                  <ImageIcon size={24} style={{ color: 'var(--color-sand-dark)', marginBottom: '8px' }} />
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Choose mock photo:</span>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
                    <button type="button" className="btn btn-secondary btn-sm" style={{ fontSize: '0.65rem', padding: '3px 6px' }} onClick={() => selectMockPhoto('pothole')}>Pothole</button>
                    <button type="button" className="btn btn-secondary btn-sm" style={{ fontSize: '0.65rem', padding: '3px 6px' }} onClick={() => selectMockPhoto('leak')}>Water Leak</button>
                    <button type="button" className="btn btn-secondary btn-sm" style={{ fontSize: '0.65rem', padding: '3px 6px' }} onClick={() => selectMockPhoto('dumping')}>Dumping</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Video Evidence</label>
            <div className="mock-upload-area" style={{ border: '2px dashed var(--color-sand)', padding: '16px', borderRadius: '6px', textAlign: 'center', backgroundColor: 'var(--color-white)' }}>
              {videoFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '80px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Video Attached</span>
                  <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: '8px' }} onClick={() => setVideoFile(null)}>Remove Video</button>
                </div>
              ) : (
                <div style={{ padding: '8px 0' }}>
                  <Video size={24} style={{ color: 'var(--color-sand-dark)', marginBottom: '8px' }} />
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Video logs (max 30MB)</span>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm" 
                    style={{ fontSize: '0.68rem', marginTop: '6px' }}
                    onClick={() => setVideoFile('mock-video-url')}
                  >
                    Simulate Video Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 5: Anonymous Toggle & Contact details */}
        <div style={{ border: '1px solid var(--color-sand)', borderRadius: '6px', padding: '16px', backgroundColor: 'var(--color-white)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: anonymous ? '0px' : '16px' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>Submit Anonymously</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>We will not link your name or phone number to this report.</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>

          {!anonymous && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="contactName" style={{ fontSize: '0.8rem' }}>Reporter Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--color-sand-dark)' }} />
                  <input
                    type="text"
                    id="contactName"
                    className="form-control"
                    style={{ paddingLeft: '32px' }}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="contactPhone" style={{ fontSize: '0.8rem' }}>Reporter Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--color-sand-dark)' }} />
                  <input
                    type="text"
                    id="contactPhone"
                    className="form-control"
                    style={{ paddingLeft: '32px' }}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigateTo('home')}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg">Submit Report to AI</button>
        </div>
      </form>
    </div>
  );
};

export default ReportIncidentPage;
