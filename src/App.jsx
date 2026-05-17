import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  FolderKanban, 
  Users, 
  UserSquare, 
  MessageSquare, 
  Image as ImageIcon, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Bell, 
  ShieldAlert 
} from 'lucide-react';

// Import Mock Data Persistence API
import { 
  getStoredData, 
  saveStoredData, 
  getProducts, 
  getVendors, 
  getBookings, 
  getOrders, 
  getChats, 
  getBanners, 
  getUsers 
} from './mockAdminData';

// Import Views
import DashboardView from './components/DashboardView';
import ProductsView from './components/ProductsView';
import OrdersView from './components/OrdersView';
import BookingsView from './components/BookingsView';
import VendorsView from './components/VendorsView';
import ChatView from './components/ChatView';
import BannersView from './components/BannersView';
import UsersView from './components/UsersView';

const App = () => {
  // Global persistent state
  const [products, setProducts] = useState(() => getProducts());
  const [vendors, setVendors] = useState(() => getVendors());
  const [bookings, setBookings] = useState(() => getBookings());
  const [orders, setOrders] = useState(() => getOrders());
  const [chats, setChats] = useState(() => getChats());
  const [banners, setBanners] = useState(() => getBanners());
  const [users, setUsers] = useState(() => getUsers());

  // App UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLightMode, setIsLightMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sync state variables to LocalStorage when changed
  useEffect(() => { saveStoredData('inkpen_products', products); }, [products]);
  useEffect(() => { saveStoredData('inkpen_vendors', vendors); }, [vendors]);
  useEffect(() => { saveStoredData('inkpen_bookings', bookings); }, [bookings]);
  useEffect(() => { saveStoredData('inkpen_orders', orders); }, [orders]);
  useEffect(() => { saveStoredData('inkpen_chats', chats); }, [chats]);
  useEffect(() => { saveStoredData('inkpen_banners', banners); }, [banners]);
  useEffect(() => { saveStoredData('inkpen_users', users); }, [users]);

  // Dark/Light Mode Theme Coordinator
  useEffect(() => {
    const body = document.body;
    if (isLightMode) {
      body.classList.add('light-mode');
    } else {
      body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  // Dynamic Alerts & Badge calculations
  const pendingCreators = vendors.filter(v => v.pendingVerification).length;
  const pendingUploads = products.filter(p => p.status === 'Pending').length;
  const pendingCustomBookings = bookings.filter(b => b.status === 'Received').length;
  const unreadChats = chats.filter(c => c.unread).length;
  
  const totalBadges = pendingCreators + pendingUploads + pendingCustomBookings + unreadChats;

  const categories = [
    { id: 'cat_1', name: 'Mobile Apps' },
    { id: 'cat_2', name: 'Websites' },
    { id: 'cat_3', name: 'Graphic Designs' },
    { id: 'cat_4', name: 'Automations' }
  ];

  // Render Core Active Tab Content View
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            products={products}
            vendors={vendors}
            bookings={bookings}
            orders={orders}
            users={users}
            setActiveTab={setActiveTab}
          />
        );
      case 'products':
        return (
          <ProductsView 
            products={products}
            setProducts={setProducts}
            categories={categories}
          />
        );
      case 'orders':
        return (
          <OrdersView 
            orders={orders}
            setOrders={setOrders}
          />
        );
      case 'bookings':
        return (
          <BookingsView 
            bookings={bookings}
            setBookings={setBookings}
          />
        );
      case 'vendors':
        return (
          <VendorsView 
            vendors={vendors}
            setVendors={setVendors}
          />
        );
      case 'chats':
        return (
          <ChatView 
            chats={chats}
            setChats={setChats}
          />
        );
      case 'banners':
        return (
          <BannersView 
            banners={banners}
            setBanners={setBanners}
          />
        );
      case 'users':
        return (
          <UsersView 
            users={users}
            setUsers={setUsers}
          />
        );
      default:
        return <div>View not implemented yet!</div>;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Products & Queue', icon: <ShoppingBag size={20} />, badge: pendingUploads },
    { id: 'orders', label: 'Marketplace Orders', icon: <ShoppingCart size={20} /> },
    { id: 'bookings', label: 'Custom Bookings', icon: <FolderKanban size={20} />, badge: pendingCustomBookings },
    { id: 'vendors', label: 'Creator Verification', icon: <UserSquare size={20} />, badge: pendingCreators },
    { id: 'chats', label: 'Support Chats', icon: <MessageSquare size={20} />, badge: unreadChats },
    { id: 'banners', label: 'Promo Banners', icon: <ImageIcon size={20} /> },
    { id: 'users', label: 'User Directory', icon: <Users size={20} /> }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation Drawer */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-circle">
            <FolderKanban size={22} color="#FFF" />
          </div>
          <span className="logo-text">InkPen Panel</span>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.id}>
              <div 
                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge > 0 && <span className="menu-badge">{item.badge}</span>}
              </div>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <span>Database Connected</span>
          </div>
        </div>
      </aside>

      {/* Main View Area Container */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Top Header Navigation bar */}
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              className="action-btn mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="header-title-section">
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
                {menuItems.find(m => m.id === activeTab)?.label}
              </h2>
              <span className="header-subtitle">InkPen Marketplace Management Node</span>
            </div>
          </div>

          <div className="header-actions">
            {/* Theme switcher */}
            <button 
              className="action-btn" 
              onClick={() => setIsLightMode(!isLightMode)}
              title="Toggle Light/Dark Theme"
            >
              {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Notification alert bells */}
            <div style={{ position: 'relative' }}>
              <button 
                className="action-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Active Warnings Feed"
              >
                <Bell size={20} />
                {totalBadges > 0 && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      top: '5px', 
                      right: '5px', 
                      backgroundColor: 'var(--danger)', 
                      color: '#FFF', 
                      fontSize: '9px', 
                      fontWeight: 800, 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    {totalBadges}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div 
                  className="glass-card" 
                  style={{ 
                    position: 'absolute', 
                    top: '55px', 
                    right: 0, 
                    width: '300px', 
                    padding: '20px', 
                    zIndex: 100, 
                    animation: 'modalIn 0.2s ease-out' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                    <ShieldAlert size={16} color="var(--warning)" />
                    <span style={{ fontWeight: 800, fontSize: '14px' }}>Administrative Actions</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                    {pendingUploads > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Pending creator uploads</span>
                        <span className="badge-status warning">{pendingUploads} items</span>
                      </div>
                    )}
                    {pendingCustomBookings > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>New custom project specs</span>
                        <span className="badge-status info">{pendingCustomBookings} bookings</span>
                      </div>
                    )}
                    {pendingCreators > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Creators awaiting verification</span>
                        <span className="badge-status warning">{pendingCreators} users</span>
                      </div>
                    )}
                    {unreadChats > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Unread customer support chats</span>
                        <span className="badge-status danger">{unreadChats} unread</span>
                      </div>
                    )}
                    {totalBadges === 0 && (
                      <span style={{ color: 'var(--text-secondary)', textAlign: 'center', display: 'block', padding: '10px 0' }}>
                        No pending issues require review!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile badge */}
            <div className="admin-profile">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=100&auto=format&fit=crop" 
                className="admin-avatar" 
                alt="" 
              />
              <div className="admin-info">
                <span className="admin-name">Jacob Miller</span>
                <span className="admin-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Core Main content view wrapper */}
        <main className="main-content">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
