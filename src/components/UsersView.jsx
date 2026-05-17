import React, { useState } from 'react';
import { Search, UserCheck, UserX, ShieldAlert } from 'lucide-react';

const UsersView = ({ users, setUsers }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleUserStatus = (userId) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsers(updated);
  };

  return (
    <div className="glass-card">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h3 className="card-title">Registered Customer Accounts</h3>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ flex: '1 1 200px', maxWidth: '100%' }}>
            <Search size={18} className="search-input-icon" />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search user by Name, Email, or City..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className="form-field" 
            style={{ minWidth: '120px', maxWidth: '160px', flex: '0 1 auto', height: '46px', paddingLeft: '12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email Address</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary)', fontWeight: 800 }}>
                      {u.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 700 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.city}</td>
                <td>{u.joinDate}</td>
                <td>
                  <span className={`badge-status ${u.status === 'Active' ? 'success' : 'danger'}`}>
                    {u.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className={`btn btn-sm ${u.status === 'Active' ? 'btn-danger' : 'btn-primary'}`}
                    style={{ backgroundColor: u.status === 'Active' ? 'var(--danger-bg)' : 'var(--primary-glow)', color: u.status === 'Active' ? 'var(--danger)' : 'var(--primary)', border: 'none' }}
                    onClick={() => toggleUserStatus(u.id)}
                  >
                    {u.status === 'Active' ? (
                      <>
                        <UserX size={12} /> Suspend Account
                      </>
                    ) : (
                      <>
                        <UserCheck size={12} /> Activate Account
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No customer records matched.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersView;
