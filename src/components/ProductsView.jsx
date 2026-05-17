import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';

const ProductsView = ({ products, setProducts, categories }) => {
  const [activeSubTab, setActiveSubTab] = useState('catalog'); // 'catalog' | 'queue'
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('cat_1');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [platform, setPlatform] = useState('');
  const [image, setImage] = useState('');
  const [sellerName, setSellerName] = useState('Admin');
  const [tag, setTag] = useState('');
  const [trending, setTrending] = useState(false);
  const [featured, setFeatured] = useState(false);

  // Filters
  const filteredCatalog = products.filter(p => {
    if (p.status !== 'Approved') return false;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sellerName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const pendingQueue = products.filter(p => p.status === 'Pending');

  const openAddModal = () => {
    setEditProduct(null);
    setName('');
    setShortDesc('');
    setDescription('');
    setCategoryId('cat_1');
    setPrice('');
    setOriginalPrice('');
    setPlatform('');
    setImage('');
    setSellerName('Admin');
    setTag('NEW');
    setTrending(false);
    setFeatured(false);
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditProduct(p);
    setName(p.name);
    setShortDesc(p.shortDesc);
    setDescription(p.description);
    setCategoryId(p.categoryId);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setPlatform(p.platform);
    setImage(p.image);
    setSellerName(p.sellerName);
    setTag(p.tag);
    setTrending(p.trending);
    setFeatured(p.featured);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !platform) {
      alert('Please fill out Name, Price, and Platform!');
      return;
    }

    const calculatedDiscount = originalPrice 
      ? Math.round(((originalPrice - price) / originalPrice) * 100) 
      : 0;

    if (editProduct) {
      // Edit
      const updated = products.map(p => {
        if (p.id === editProduct.id) {
          return {
            ...p,
            name,
            shortDesc,
            description,
            categoryId,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            discount: calculatedDiscount,
            platform,
            image: image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
            sellerName,
            tag,
            trending,
            featured
          };
        }
        return p;
      });
      setProducts(updated);
    } else {
      // Add
      const newProd = {
        id: `prod_${Date.now()}`,
        name,
        shortDesc,
        description,
        categoryId,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        discount: calculatedDiscount,
        rating: 5,
        reviewCount: 1,
        image: image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
        platform,
        sellerName,
        tag,
        trending,
        featured,
        status: 'Approved',
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setProducts([newProd, ...products]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Creator Queue Actions
  const handleApprove = (id) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, status: 'Approved', tag: 'NEW UPLOAD' };
      }
      return p;
    });
    setProducts(updated);
  };

  const handleReject = (id) => {
    if (window.confirm('Reject and delete this creator upload?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      {/* Sub Tabs Selection */}
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activeSubTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('catalog')}
        >
          Marketplace Catalog ({filteredCatalog.length})
        </button>
        <button 
          className={`tab-btn ${activeSubTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('queue')}
        >
          Creator Upload Queue ({pendingQueue.length})
          {pendingQueue.length > 0 && <span className="menu-badge">{pendingQueue.length}</span>}
        </button>
      </div>

      {activeSubTab === 'catalog' ? (
        <div className="glass-card">
          {/* Header Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
              {/* Search */}
              <div className="search-input-wrapper" style={{ flex: 1 }}>
                <Search size={18} className="search-input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search products or creators..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <select 
                className="form-field" 
                style={{ width: '160px', height: '46px', paddingLeft: '12px' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} /> Add New Asset
            </button>
          </div>

          {/* Table list */}
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Pricing</th>
                  <th>Platform</th>
                  <th>Creator</th>
                  <th>Badges</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCatalog.map(p => {
                  const cat = categories.find(c => c.id === p.categoryId);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={p.image} 
                            style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} 
                            alt="" 
                          />
                          <div>
                            <span style={{ fontWeight: 700, display: 'block' }}>{p.name}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }} numberOfLines={1}>{p.shortDesc}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge-status info">{cat ? cat.name : 'Digital'}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</span>
                        {p.originalPrice && (
                          <span style={{ fontSize: '11px', textDecoration: 'line-through', color: 'var(--text-tertiary)', marginLeft: '6px' }}>
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        {p.discount > 0 && (
                          <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700, marginLeft: '6px' }}>
                            ({p.discount}% Off)
                          </span>
                        )}
                      </td>
                      <td>{p.platform}</td>
                      <td>{p.sellerName}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {p.trending && <span className="badge-status warning">Trending</span>}
                          {p.featured && <span className="badge-status success">Featured</span>}
                          {p.tag && <span className="badge-status info" style={{ textTransform: 'uppercase' }}>{p.tag}</span>}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button className="action-btn" style={{ width: '36px', height: '36px' }} onClick={() => openEditModal(p)}>
                            <Edit size={16} />
                          </button>
                          <button className="action-btn" style={{ width: '36px', height: '36px', color: 'var(--danger)' }} onClick={() => handleDelete(p.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredCatalog.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      No matching marketplace assets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Creator Upload Queue Tab */
        <div className="glass-card">
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Submitted Asset</th>
                  <th>Platform</th>
                  <th>Target Price</th>
                  <th>Creator</th>
                  <th>Date Submitted</th>
                  <th style={{ textAlign: 'right' }}>Review Decision</th>
                </tr>
              </thead>
              <tbody>
                {pendingQueue.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={p.image} 
                          style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} 
                          alt="" 
                        />
                        <div>
                          <span style={{ fontWeight: 800, display: 'block', fontSize: '15px' }}>{p.name}</span>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '300px', margin: '4px 0 0' }}>
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge-status info">{p.platform}</span></td>
                    <td style={{ fontWeight: 800 }}>₹{p.price.toLocaleString('en-IN')}</td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{p.sellerName}</span>
                    </td>
                    <td>{p.dateAdded}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: 'var(--success)' }}
                          onClick={() => handleApprove(p.id)}
                        >
                          <CheckCircle size={14} /> Approve & Publish
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(p.id)}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingQueue.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={36} color="var(--success)" style={{ opacity: 0.4, marginBottom: '10px' }} />
                      <p style={{ fontWeight: 600 }}>The product review queue is currently empty!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Product overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h3 className="modal-title">{editProduct ? 'Edit Digital Product' : 'Add New Digital Product'}</h3>
                <button type="button" className="action-btn" onClick={() => setShowModal(false)}>
                  ✕
                </button>
              </div>
              <div className="modal-body">
                {/* Form fields */}
                <div className="form-group">
                  <label className="form-label">Asset Name *</label>
                  <input 
                    type="text" 
                    className="form-field" 
                    placeholder="e.g. Music App UI Kit" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-field" 
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Platform Stack *</label>
                    <input 
                      type="text" 
                      className="form-field" 
                      placeholder="e.g. React Native / Figma" 
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹) *</label>
                    <input 
                      type="number" 
                      className="form-field" 
                      placeholder="e.g. 14999" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Price (₹) (Optional)</label>
                    <input 
                      type="number" 
                      className="form-field" 
                      placeholder="e.g. 19999" 
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Seller/Creator Name</label>
                    <input 
                      type="text" 
                      className="form-field" 
                      placeholder="e.g. InkPen Admin" 
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asset Tag/Promo Badges</label>
                    <input 
                      type="text" 
                      className="form-field" 
                      placeholder="e.g. BESTSELLER" 
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL (Optional)</label>
                  <input 
                    type="url" 
                    className="form-field" 
                    placeholder="https://unsplash.com/..." 
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Tagline Description</label>
                  <input 
                    type="text" 
                    className="form-field" 
                    placeholder="e.g. Stunning dark-mode music templates for IOS." 
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea 
                    className="form-field" 
                    placeholder="Explain full file specs, compatibility, and key modules..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    <input 
                      type="checkbox" 
                      checked={trending} 
                      onChange={(e) => setTrending(e.target.checked)} 
                    />
                    Mark as Trending
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    <input 
                      type="checkbox" 
                      checked={featured} 
                      onChange={(e) => setFeatured(e.target.checked)} 
                    />
                    Mark as Featured
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editProduct ? 'Save Changes' : 'Publish Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
