import { useState, useEffect } from 'react';
import '../styles/ListingModal.css';

const ListingModal = ({ isOpen, onClose, onSubmit, editingListing }) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    quantity: '',
    unit: 'Kilograms (kg)',
    pricing: 'negotiable',
    fixedPrice: '',
    city: '',
    area: ''
  });

  // Populate form when editing
  useEffect(() => {
    if (editingListing) {
      setFormData({
        category: editingListing.category || '',
        description: editingListing.description || '',
        quantity: editingListing.quantity?.toString() || '',
        unit: editingListing.unit || 'Kilograms (kg)',
        pricing: editingListing.pricing || 'negotiable',
        fixedPrice: editingListing.fixedPrice?.toString() || '',
        city: editingListing.location?.city || '',
        area: editingListing.location?.area || ''
      });
    }
  }, [editingListing]);

  const categories = [
    { name: 'Organic', icon: '🌱', color: '#10b981' },
    { name: 'Plastic', icon: '🗑️', color: '#3b82f6' },
    { name: 'Paper', icon: '📄', color: '#f59e0b' },
    { name: 'Glass', icon: '🍷', color: '#8b5cf6' },
    { name: 'E-Waste', icon: '📱', color: '#8b5cf6' },
    { name: 'Textiles', icon: '👕', color: '#1f2937' }
  ];

  const units = [
    'Kilograms (kg)',
    'Grams (g)',
    'Tons (t)',
    'Liters (l)',
    'Pieces (pcs)',
    'Bags'
  ];

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.category) {
      alert('Please select a waste category');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please provide a description');
      return;
    }
    if (!formData.quantity || formData.quantity < 1 || !Number.isInteger(Number(formData.quantity))) {
      alert('Please enter a valid quantity (whole numbers only, starting from 1)');
      return;
    }
    if (formData.pricing === 'fixed' && (!formData.fixedPrice || formData.fixedPrice <= 0)) {
      alert('Please enter a valid fixed price');
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      category: '',
      description: '',
      quantity: '',
      unit: 'Kilograms (kg)',
      pricing: 'negotiable',
      fixedPrice: '',
      city: '',
      area: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingListing ? 'Edit Listing' : 'List New Waste'}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Waste Category */}
          <div className="form-group">
            <label className="form-label">
              Waste Category <span className="required">*</span>
            </label>
            <div className="category-grid">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`category-card ${formData.category === cat.name ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  <span className="category-icon" style={{ color: cat.color }}>
                    {cat.icon}
                  </span>
                  <span className="category-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe your waste material..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
            />
          </div>

          {/* Quantity and Unit */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                min="1"
                step="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select
                className="form-select"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                City/Location <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Nairobi"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Area/Neighborhood</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Westlands"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="form-group">
            <label className="form-label">Pricing</label>
            <div className="pricing-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="pricing"
                  value="negotiable"
                  checked={formData.pricing === 'negotiable'}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                />
                <span>Negotiable - Discuss price with collector</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="pricing"
                  value="fixed"
                  checked={formData.pricing === 'fixed'}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                />
                <span>Fixed Price</span>
              </label>
            </div>
            {formData.pricing === 'fixed' && (
              <input
                type="number"
                className="form-input price-input"
                placeholder="Enter fixed price (KES)"
                value={formData.fixedPrice}
                onChange={(e) => setFormData({ ...formData, fixedPrice: e.target.value })}
                min="0"
                step="0.01"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editingListing ? 'Update Listing' : 'List Waste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingModal;
