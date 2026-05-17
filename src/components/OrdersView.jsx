import React, { useState } from 'react';
import { Search, ShoppingBag, Eye, Download, CheckCircle, Clock, Ban } from 'lucide-react';

const OrdersView = ({ orders, setOrders }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          o.id.toLowerCase().includes(search.toLowerCase()) ||
                          o.productName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge-status success">Delivered</span>;
      case 'Paid':
        return <span className="badge-status info">Paid</span>;
      case 'Processing':
        return <span className="badge-status warning">Processing</span>;
      case 'Cancelled':
        return <span className="badge-status danger">Cancelled</span>;
      default:
        return <span className="badge-status">{status}</span>;
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
              placeholder="Search by Order ID, Client, or Asset..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className="form-field" 
            style={{ width: '160px', height: '46px', paddingLeft: '12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Asset Purchased</th>
              <th>Paid Price</th>
              <th>Purchase Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id}>
                <td>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{o.id}</span>
                </td>
                <td>
                  <div>
                    <span style={{ fontWeight: 700, display: 'block' }}>{o.customerName}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{o.customerEmail}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                      src={o.productImage} 
                      style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} 
                      alt="" 
                    />
                    <span style={{ fontWeight: 600 }}>{o.productName}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 700 }}>₹{o.productPrice.toLocaleString('en-IN')}</td>
                <td>{o.date}</td>
                <td>{getStatusBadge(o.status)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setSelectedOrder(o)}>
                    <Eye size={14} /> View Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No digital orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details View Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Transaction Receipt</h3>
              <button className="action-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              
              {/* Receipt Visual Header */}
              <div style={{ borderBottom: '1px dashed var(--border)', paddingBottom: '20px', marginBottom: '20px', textAlign: 'center' }}>
                <ShoppingBag size={32} color="var(--primary)" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '20px', fontWeight: 800 }}>₹{selectedOrder.productPrice.toLocaleString('en-IN')}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Payment Successful via {selectedOrder.paymentMethod}</p>
              </div>

              {/* Grid Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <span className="form-label" style={{ marginBottom: '4px' }}>Order ID</span>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{selectedOrder.id}</span>
                </div>
                <div>
                  <span className="form-label" style={{ marginBottom: '4px' }}>Purchase Date</span>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{selectedOrder.date}</span>
                </div>
                <div>
                  <span className="form-label" style={{ marginBottom: '4px' }}>Client Name</span>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="form-label" style={{ marginBottom: '4px' }}>Client Email</span>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{selectedOrder.customerEmail}</span>
                </div>
              </div>

              {/* Product Purchased */}
              <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <img 
                  src={selectedOrder.productImage} 
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
                  alt="" 
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 800, display: 'block', fontSize: '14px' }}>{selectedOrder.productName}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Digital File Download Delivery</span>
                </div>
                <a href={selectedOrder.downloadLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <button className="action-btn" type="button" style={{ color: 'var(--primary)' }} title="Simulate Download Link">
                    <Download size={18} />
                  </button>
                </a>
              </div>

              {/* Status Manager */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <span className="form-label" style={{ marginBottom: '10px' }}>Modify Processing Status</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${selectedOrder.status === 'Processing' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Processing')}
                  >
                    <Clock size={12} /> Processing
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${selectedOrder.status === 'Paid' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Paid')}
                  >
                    <CheckCircle size={12} /> Paid
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${selectedOrder.status === 'Delivered' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Delivered')}
                  >
                    <CheckCircle size={12} style={{ color: 'var(--success)' }} /> Delivered
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${selectedOrder.status === 'Cancelled' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ color: selectedOrder.status === 'Cancelled' ? '#fff' : 'var(--danger)' }}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}
                  >
                    <Ban size={12} /> Cancel
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
