import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, ShieldCheck, Mail, Phone, FileText } from 'lucide-react';

const VendorsView = ({ vendors, setVendors }) => {
  const [activeSubTab, setActiveSubTab] = useState('pending'); // 'pending' | 'verified'
  const [search, setSearch] = useState('');

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.handle.toLowerCase().includes(search.toLowerCase()) ||
                          v.specialty.toLowerCase().includes(search.toLowerCase());
    
    if (activeSubTab === 'pending') {
      return matchesSearch && v.pendingVerification;
    } else {
      return matchesSearch && v.verified;
    }
  });

  const handleApprove = (id) => {
    const updated = vendors.map(v => {
      if (v.id === id) {
        return { ...v, verified: true, pendingVerification: false };
      }
      return v;
    });
    setVendors(updated);
  };

  const handleReject = (id) => {
    if (window.confirm('Reject this vendor registration?')) {
      const updated = vendors.map(v => {
        if (v.id === id) {
          return { ...v, pendingVerification: false, verified: false };
        }
        return v;
      });
      setVendors(updated);
    }
  };

  return (
    <div>
      {/* Sub Tabs */}
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activeSubTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('pending')}
        >
          Pending Verifications ({vendors.filter(v => v.pendingVerification).length})
        </button>
        <button 
          className={`tab-btn ${activeSubTab === 'verified' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('verified')}
        >
          Verified Creators ({vendors.filter(v => v.verified).length})
        </button>
      </div>

      <div className="glass-card">
        {/* Controls */}
        <div style={{ marginBottom: '24px' }}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-input-icon" />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search creator by name or specialty..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Vendors Table */}
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Creator Profile</th>
                <th>Specialty Area</th>
                <th>Contact Details</th>
                <th>Join Date</th>
                {activeSubTab === 'pending' && <th>Verification Docs</th>}
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map(v => (
                <tr key={v.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={v.avatar} 
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                        alt="" 
                      />
                      <div>
                        <span style={{ fontWeight: 800, display: 'block', fontSize: '15px' }}>
                          {v.name}
                          {v.verified && <ShieldCheck size={16} color="var(--primary)" style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'middle' }} />}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{v.handle}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-status info">{v.specialty}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Mail size={12} /> {v.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        <Phone size={12} /> {v.phone}
                      </div>
                    </div>
                  </td>
                  <td>{v.joinDate}</td>
                  {activeSubTab === 'pending' && (
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {v.docsUploaded.map((doc, idx) => (
                          <span key={idx} style={{ fontSize: '12px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FileText size={12} /> {doc}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  <td style={{ textAlign: 'right' }}>
                    {activeSubTab === 'pending' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: 'var(--success)' }}
                          onClick={() => handleApprove(v.id)}
                        >
                          <CheckCircle size={14} /> Approve Verified Badge
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(v.id)}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="badge-status success" style={{ fontWeight: 800 }}>
                        <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> ACTIVE CREATOR
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={activeSubTab === 'pending' ? '6' : '5'} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No creators found in this list.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorsView;
