import React, { useState } from 'react';
import { Plus, Trash2, Edit, Check } from 'lucide-react';

const BannersView = ({ banners, setBanners }) => {
  const [showModal, setShowModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [tag, setTag] = useState('');

  const openAddModal = () => {
    setEditBanner(null);
    setTitle('');
    setSubtitle('');
    setImage('');
    setTag('NEW');
    setShowModal(true);
  };

  const openEditModal = (b) => {
    setEditBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setImage(b.image);
    setTag(b.tag);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !image) {
      alert('Title and Image URL are required!');
      return;
    }

    if (editBanner) {
      const updated = banners.map(b => {
        if (b.id === editBanner.id) {
          return { ...b, title, subtitle, image, tag };
        }
        return b;
      });
      setBanners(updated);
    } else {
      const newBanner = {
        id: `banner_${Date.now()}`,
        title,
        subtitle,
        image,
        tag
      };
      setBanners([...banners, newBanner]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this banner slide?')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  return (
    <div className="glass-card">
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h3 className="card-title">Homepage Promotional Sliders</h3>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add Promo Banner
        </button>
      </div>

      {/* Grid of Banners */}
      <div className="banner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {banners.map(b => (
          <div 
            key={b.id} 
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '16px', 
              border: '1px solid var(--border)', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            <div style={{ position: 'relative', height: '140px' }}>
              <img 
                src={b.image} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="" 
              />
              <span 
                className="badge-status success" 
                style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5, textTransform: 'uppercase', fontWeight: 800 }}
              >
                {b.tag}
              </span>
            </div>
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>{b.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{b.subtitle}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ flex: 1 }}
                  onClick={() => openEditModal(b)}
                >
                  <Edit size={12} /> Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  style={{ width: '36px', height: '34px', padding: 0 }}
                  onClick={() => handleDelete(b.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Banner Modal overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h3 className="modal-title">{editBanner ? 'Edit Promo Banner' : 'Create Promo Banner'}</h3>
                <button type="button" className="action-btn" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Banner Title *</label>
                  <input 
                    type="text" 
                    className="form-field" 
                    placeholder="e.g. Ready-Made Apps" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Banner Subtitle</label>
                  <input 
                    type="text" 
                    className="form-field" 
                    placeholder="e.g. Build your dream business today" 
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Banner Promo Tag</label>
                    <input 
                      type="text" 
                      className="form-field" 
                      placeholder="e.g. OFFER, NEW" 
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slider Image URL *</label>
                    <input 
                      type="url" 
                      className="form-field" 
                      placeholder="https://unsplash.com/..." 
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Slide</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersView;
