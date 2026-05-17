import React, { useState } from 'react';
import { Search, Info, Sliders, ExternalLink, Calendar, CheckSquare, Layers, ShieldCheck, ChevronRight } from 'lucide-react';

const BookingsView = ({ bookings, setBookings }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.brandName.toLowerCase().includes(search.toLowerCase()) || 
                          b.clientName.toLowerCase().includes(search.toLowerCase()) ||
                          b.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stages = ["Received", "Analyzing Requirements", "In Development", "QA Testing", "Deployed"];

  const updateStage = (bookingId, stage) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: stage };
      }
      return b;
    });
    setBookings(updated);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: stage });
    }
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'Received':
        return '#3b82f6'; // blue
      case 'Analyzing Requirements':
        return '#f59e0b'; // amber
      case 'In Development':
        return '#a855f7'; // purple
      case 'QA Testing':
        return '#06b6d4'; // cyan
      case 'Deployed':
        return '#10b981'; // green
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div className="glass-card">
      {/* Header Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div className="search-input-wrapper" style={{ flex: 1 }}>
            <Search size={18} className="search-input-icon" />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search Brand, Customer, or Booking ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className="form-field" 
            style={{ width: '200px', height: '46px', paddingLeft: '12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Development Stages</option>
            {stages.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table List */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Brand Name</th>
              <th>Client Contact</th>
              <th>Project Base</th>
              <th>App Colors</th>
              <th>Current Stage</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id}>
                <td>
                  <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>{b.id}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 800, display: 'block' }}>{b.brandName}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Dated: {b.date}</span>
                </td>
                <td>
                  <div>
                    <span style={{ fontWeight: 700, display: 'block' }}>{b.clientName}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{b.clientPhone}</span>
                  </div>
                </td>
                <td>{b.productName}</td>
                <td>
                  <div className="booking-colors">
                    <div 
                      className="booking-color-blob" 
                      style={{ backgroundColor: b.primaryColor }}
                      title={`Primary: ${b.primaryColor}`} 
                    />
                    <div 
                      className="booking-color-blob" 
                      style={{ backgroundColor: b.secondaryColor }}
                      title={`Secondary: ${b.secondaryColor}`} 
                    />
                  </div>
                </td>
                <td>
                  <span className="badge-status" style={{ backgroundColor: `${getStageColor(b.status)}15`, color: getStageColor(b.status), fontWeight: 700 }}>
                    {b.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBooking(b)}>
                    <Info size={14} /> Open Specs
                  </button>
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No custom app configurations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details View Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Custom Requirement Specs ({selectedBooking.id})</h3>
              <button className="action-btn" onClick={() => setSelectedBooking(null)}>✕</button>
            </div>
            
            <div className="modal-body" style={{ padding: '24px' }}>
              
              {/* Development Pipeline Status Tracker */}
              <div style={{ marginBottom: '24px' }}>
                <span className="form-label" style={{ marginBottom: '12px' }}>Development Pipeline Status</span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {stages.map((stg, i) => {
                    const isCompleted = stages.indexOf(selectedBooking.status) >= i;
                    const isActive = selectedBooking.status === stg;
                    return (
                      <React.Fragment key={stg}>
                        {i > 0 && <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />}
                        <button
                          type="button"
                          className="badge-status"
                          style={{
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: isActive 
                              ? getStageColor(stg) 
                              : isCompleted 
                                ? `${getStageColor(stg)}25` 
                                : 'var(--bg-tertiary)',
                            color: isActive 
                              ? '#FFF' 
                              : isCompleted 
                                ? getStageColor(stg) 
                                : 'var(--text-secondary)',
                            fontWeight: 700,
                            padding: '6px 12px'
                          }}
                          onClick={() => updateStage(selectedBooking.id, stg)}
                        >
                          {stg}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '20px' }}>
                <div>
                  <span className="form-label" style={{ marginBottom: '2px' }}>Brand Name</span>
                  <span style={{ fontWeight: 800, fontSize: '15px' }}>{selectedBooking.brandName}</span>
                </div>
                <div>
                  <span className="form-label" style={{ marginBottom: '2px' }}>Base Product</span>
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>{selectedBooking.productName}</span>
                </div>
                <div>
                  <span className="form-label" style={{ marginBottom: '2px' }}>Client Contact</span>
                  <span style={{ fontWeight: 600, display: 'block' }}>{selectedBooking.clientName}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedBooking.clientEmail}</span>
                </div>
                <div>
                  <span className="form-label" style={{ marginBottom: '2px' }}>Payment Status</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>{selectedBooking.paymentStatus}</span>
                </div>
              </div>

              {/* Requirement Checklists */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Platform requirements */}
                <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', padding: '16px' }}>
                  <span className="form-label" style={{ marginBottom: '8px' }}>Platform Needs</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <CheckSquare size={16} color={selectedBooking.needPlaystore ? 'var(--primary)' : 'var(--text-tertiary)'} />
                      <span style={{ color: selectedBooking.needPlaystore ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Google Playstore</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <CheckSquare size={16} color={selectedBooking.needAppstore ? 'var(--primary)' : 'var(--text-tertiary)'} />
                      <span style={{ color: selectedBooking.needAppstore ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Apple Appstore</span>
                    </div>
                  </div>
                </div>

                {/* Gateway checklists */}
                <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', padding: '16px' }}>
                  <span className="form-label" style={{ marginBottom: '8px' }}>Integrations</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <CheckSquare size={16} color={selectedBooking.needPaymentGateway ? 'var(--primary)' : 'var(--text-tertiary)'} />
                    <span style={{ color: selectedBooking.needPaymentGateway ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Razorpay Payment Gateway</span>
                  </div>
                </div>
              </div>

              {/* App theme colors and logo previews */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Color preview blobs */}
                <div>
                  <span className="form-label" style={{ marginBottom: '10px' }}>App Colors Specified</span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div className="booking-color-blob" style={{ backgroundColor: selectedBooking.primaryColor, width: '36px', height: '36px' }} />
                      <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{selectedBooking.primaryColor}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div className="booking-color-blob" style={{ backgroundColor: selectedBooking.secondaryColor, width: '36px', height: '36px' }} />
                      <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{selectedBooking.secondaryColor}</span>
                    </div>
                  </div>
                </div>

                {/* Document details and Reference links */}
                <div>
                  <span className="form-label" style={{ marginBottom: '6px' }}>Brand Assets</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedBooking.referenceUrl ? (
                      <a href={selectedBooking.referenceUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                        <ExternalLink size={14} /> Open Dribbble Link
                      </a>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No reference links shared</span>
                    )}

                    {selectedBooking.logoUri ? (
                      <a href={selectedBooking.logoUri} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                        <Layers size={14} /> View Logo Asset
                      </a>
                    ) : (
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No logo file uploaded</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsView;
