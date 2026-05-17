import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Layers, 
  CheckSquare, 
  ArrowUpRight, 
  PlusCircle, 
  Clock 
} from 'lucide-react';

const DashboardView = ({ 
  products, 
  vendors, 
  bookings, 
  orders, 
  users, 
  setActiveTab 
}) => {
  // Compute Stats
  const totalMarketplaceRevenue = orders
    .filter(o => o.status === 'Paid' || o.status === 'Delivered')
    .reduce((sum, o) => sum + o.productPrice, 0);

  const totalAdvanceRevenue = bookings
    .reduce((sum, b) => {
      const isAdvance = b.paymentType === 'initial';
      const advancePaid = isAdvance ? (b.price / 2) : b.price;
      return sum + advancePaid;
    }, 0);

  const totalRevenue = totalMarketplaceRevenue + totalAdvanceRevenue;
  const activeProducts = products.filter(p => p.status === 'Approved').length;
  const pendingUploads = products.filter(p => p.status === 'Pending').length;
  const pendingBookings = bookings.filter(b => b.status !== 'Deployed').length;
  const verifiedVendors = vendors.filter(v => v.verified).length;

  // Pure SVG Area Chart Data
  const weeklyData = [
    { day: 'Mon', sales: 12000, requests: 1 },
    { day: 'Tue', sales: 24000, requests: 3 },
    { day: 'Wed', sales: 18000, requests: 2 },
    { day: 'Thu', sales: 38000, requests: 5 },
    { day: 'Fri', sales: 30000, requests: 4 },
    { day: 'Sat', sales: 48000, requests: 8 },
    { day: 'Sun', sales: 42000, requests: 6 }
  ];

  // SVG drawing configuration
  const chartHeight = 160;
  const chartWidth = 500;
  const maxVal = 60000;
  
  const getX = (index) => (index / (weeklyData.length - 1)) * chartWidth;
  const getY = (val) => chartHeight - (val / maxVal) * chartHeight;

  // Build SVG Path points
  const points = weeklyData.map((d, i) => `${getX(i)},${getY(d.sales)}`).join(' ');
  const areaPath = `M0,${chartHeight} L${points} L${chartWidth},${chartHeight} Z`;
  const linePath = `M${points}`;

  return (
    <div>
      {/* Metrics Row */}
      <div className="grid-stats">
        <div className="card-stat" style={{ '--accent-gradient': 'linear-gradient(135deg, #10b981, #059669)' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
            <span className="stat-label">Total Revenue</span>
            <span className="stat-trend up">
              <ArrowUpRight size={14} /> +12.5% this week
            </span>
          </div>
        </div>

        <div className="card-stat" style={{ '--accent-gradient': 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <ShoppingBag size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{orders.length}</span>
            <span className="stat-label">Direct Orders</span>
            <span className="stat-trend up">
              <ArrowUpRight size={14} /> +4 today
            </span>
          </div>
        </div>

        <div className="card-stat" style={{ '--accent-gradient': 'linear-gradient(135deg, #a855f7, #9333ea)' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{pendingBookings}</span>
            <span className="stat-label">Active Custom Projects</span>
            <span className="stat-trend warning" style={{ color: '#f59e0b' }}>
              Requires developer attention
            </span>
          </div>
        </div>

        <div className="card-stat" style={{ '--accent-gradient': 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Layers size={28} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{pendingUploads}</span>
            <span className="stat-label">Pending Creator Uploads</span>
            <span className="stat-trend" style={{ color: '#ef4444' }}>
              {pendingUploads > 0 ? `${pendingUploads} await validation` : 'Catalog clean'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts & Feeds Layout */}
      <div className="dashboard-grid">
        {/* Weekly Revenue Performance */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} color="var(--primary)" />
              Marketplace Performance
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Last 7 Days (Sales Target Max ₹60K)
            </span>
          </div>
          <div className="chart-container">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="chart-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Horizontal Grid lines */}
              <line x1="0" y1={getY(15000)} x2={chartWidth} y2={getY(15000)} className="chart-grid-line" />
              <line x1="0" y1={getY(30000)} x2={chartWidth} y2={getY(30000)} className="chart-grid-line" />
              <line x1="0" y1={getY(45000)} x2={chartWidth} y2={getY(45000)} className="chart-grid-line" />
              
              {/* Area path */}
              <path d={areaPath} className="chart-path-area" />
              
              {/* Line path */}
              <path d={linePath} className="chart-path-line" />

              {/* Data points */}
              {weeklyData.map((d, i) => (
                <circle 
                  key={i} 
                  cx={getX(i)} 
                  cy={getY(d.sales)} 
                  r="5" 
                  fill="var(--bg-secondary)" 
                  stroke="var(--primary)" 
                  strokeWidth="3" 
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </svg>
            
            {/* Days Label Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 8px' }}>
              {weeklyData.map((d, i) => (
                <span key={i} style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Activity Tracker */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">
              <CheckSquare size={20} color="var(--primary)" />
              Recent Actions Required
            </h3>
          </div>
          <div className="activity-feed">
            {/* Pending Creator Uploads */}
            {products.filter(p => p.status === 'Pending').map(p => (
              <div key={p.id} className="activity-item">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)' }}>
                  <ShoppingBag size={20} color="var(--primary)" />
                </div>
                <div className="activity-body">
                  <span className="activity-text">
                    <strong>{p.sellerName}</strong> submitted <strong>{p.name}</strong>
                  </span>
                  <span className="activity-meta">Product verification pending</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('products')}>
                  Review
                </button>
              </div>
            ))}

            {/* Pending Custom Bookings */}
            {bookings.filter(b => b.status === 'Received').map(b => (
              <div key={b.id} className="activity-item">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)' }}>
                  <Clock size={20} color="var(--secondary)" />
                </div>
                <div className="activity-body">
                  <span className="activity-text">
                    New project request for <strong>{b.brandName}</strong>
                  </span>
                  <span className="activity-meta">Advance: {b.paymentStatus}</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('bookings')}>
                  Setup
                </button>
              </div>
            ))}

            {/* Unverified Vendors */}
            {vendors.filter(v => v.pendingVerification).map(v => (
              <div key={v.id} className="activity-item">
                <img src={v.avatar} className="activity-avatar" alt="" />
                <div className="activity-body">
                  <span className="activity-text">
                    Vendor Verification: <strong>{v.name}</strong>
                  </span>
                  <span className="activity-meta">Uploaded docs: {v.docsUploaded.join(', ')}</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('vendors')}>
                  Verify
                </button>
              </div>
            ))}

            {/* Fallback if no pending items */}
            {products.filter(p => p.status === 'Pending').length === 0 &&
             bookings.filter(b => b.status === 'Received').length === 0 &&
             vendors.filter(v => v.pendingVerification).length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <CheckSquare size={36} color="var(--primary)" style={{ opacity: 0.4, marginBottom: '10px' }} />
                <p style={{ fontSize: '13px', fontWeight: 600 }}>All queues are clear!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
