import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import NavBar from '../components/NavBar';
import ProducerWelcomeMessage from '../components/ProducerWelcomeMessage';
import ListingModal from '../components/ListingModal';
import Chat from '../components/Chat';
import HummingbirdHelper from '../components/HummingbirdHelper';
import api from '../services/api';

function ProducerDashboard() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    pending: 0,
    completed: 0
  });
  const [showHelper, setShowHelper] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const fetchListings = async () => {
    try {
      const response = await api.get('/listings');
      setListings(response.data);
      
      // Calculate stats
      const stats = {
        total: response.data.length,
        available: response.data.filter(l => l.status === 'available').length,
        pending: response.data.filter(l => l.status === 'pending').length,
        completed: response.data.filter(l => l.status === 'completed').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditListing = (listing) => {
    setEditingListing(listing);
    setIsModalOpen(true);
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await api.delete(`/listings/${listingId}`);
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const handleCreateListing = async (formData) => {
    try {
      const listingData = {
        category: formData.category,
        description: formData.description,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        pricing: formData.pricing,
        location: {
          city: formData.city,
          area: formData.area || ''
        }
      };
      
      if (formData.pricing === 'fixed' && formData.fixedPrice) {
        listingData.fixedPrice = parseFloat(formData.fixedPrice);
      }

      if (editingListing) {
        await api.put(`/listings/${editingListing._id}`, listingData);
        console.log('Listing updated');
      } else {
        await api.post('/listings', listingData);
        console.log('Listing created');
      }

      // Refresh listings and reset edit state
      await fetchListings();
      setEditingListing(null);
    } catch (error) {
      console.error('Error saving listing:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save listing';
      alert(`Failed to save listing: ${errorMessage}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingListing(null);
  };

  return (
    <main className="dashboard-main">
      <NavBar />
      <div className="dashboard-content">
        <ProducerWelcomeMessage />
        
        <div className='stats-grid'>
          <div className='stat-card'>
            <div className='stat-icon total'>
              <i className="fa-solid fa-cube"></i>
            </div>
            <div className='stat-info'>
              <p className='stat-label'>Total Listings</p>
              <p className='stat-value'>{stats.total}</p>
            </div>
          </div>

          <div className='stat-card'>
            <div className='stat-icon available'>
              <i className="fa-regular fa-circle-check"></i>
            </div>
            <div className='stat-info'>
              <p className='stat-label'>Available</p>
              <p className='stat-value'>{stats.available}</p>
            </div>
          </div>

          <div className='stat-card'>
            <div className='stat-icon pending'>
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className='stat-info'>
              <p className='stat-label'>Pending Pickup</p>
              <p className='stat-value'>{stats.pending}</p>
            </div>
          </div>

          <div className='stat-card'>
            <div className='stat-icon completed'>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className='stat-info'>
              <p className='stat-label'>Completed</p>
              <p className='stat-value'>{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className='list-button-container'>
          <button className='list-new-waste-btn' onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-plus"></i>
            List New Waste
          </button>
        </div>

        <div className='my-listings-section'>
          <h2 className='section-title'>My Listings</h2>
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : listings.length === 0 ? (
            <div className='empty-listings'>
              <div className='empty-icon'>
                <i className="fa-solid fa-cube"></i>
              </div>
              <p className='empty-text'>No listings yet</p>
              <p className='empty-subtext'>Start listing your waste materials to connect with collectors</p>
              <button className='create-listing-btn' onClick={() => setIsModalOpen(true)}>
                <i className="fa-solid fa-plus"></i>
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <div key={listing._id} className="listing-card">
                  {listing.photoUrl && (
                    <img src={listing.photoUrl} alt={listing.category} className="listing-image" />
                  )}
                  <div className="listing-content">
                    <div className="listing-header">
                      <span className="listing-category">{listing.category}</span>
                      <div className="listing-actions">
                        <button className="action-btn edit-btn" onClick={() => handleEditListing(listing)} title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDeleteListing(listing._id)} title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                        <span className={`listing-status status-${listing.status}`}>
                          {listing.status}
                        </span>
                      </div>
                    </div>
                    <p className="listing-description">{listing.description}</p>
                    <div className="listing-details">
                      <span className="listing-quantity">
                        <i className="fas fa-weight"></i> {listing.quantity} {listing.unit}
                      </span>
                      {listing.location && (
                        <span className="listing-location">
                          <i className="fas fa-map-marker-alt"></i> {listing.location.city}{listing.location.area ? `, ${listing.location.area}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="listing-footer">
                      <span className="listing-price">
                        {listing.pricing === 'negotiable' ? (
                          <span className="negotiable-tag">Negotiable</span>
                        ) : (
                          <span className="price-tag">KES {listing.fixedPrice}</span>
                        )}
                      </span>
                      <div className="listing-date">
                        <i className="far fa-clock"></i> {new Date(listing.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <ListingModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          onSubmit={handleCreateListing}
          editingListing={editingListing}
        />

        {/* Floating Action Buttons */}
        <div className="floating-actions">
          <button className="fab-button fab-helper" title="Hummingbird Helper" onClick={() => setShowHelper(true)}>
            <i className="fas fa-dove"></i>
          </button>
          <button className="fab-button fab-messages" title="Messages" onClick={() => setShowMessages(true)}>
            <i className="fas fa-comments"></i>
          </button>
        </div>

        {/* Helper */}
        {showHelper && <HummingbirdHelper onClose={() => setShowHelper(false)} />}

        {/* Messages */}
        {showMessages && <Chat onClose={() => setShowMessages(false)} />}
      </div>
    </main>
  )
}export default ProducerDashboard;
