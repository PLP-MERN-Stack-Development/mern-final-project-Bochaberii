import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import NavBar from '../components/NavBar';
import ConsumerWelcomeMessage from '../components/ConsumerWelcomeMessage';
import Chat from '../components/Chat';
import HummingbirdHelper from '../components/HummingbirdHelper';
import api from '../services/api';

function ConsumerDashboard() {
  const { user } = useUser();
  const [activeView, setActiveView] = useState('map');
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showListingDetails, setShowListingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [priceFilter, setPriceFilter] = useState('All Prices');
  const [stats, setStats] = useState({
    available: 0,
    claimed: 0,
    pending: 0,
    completed: 0
  });
  const [showHelper, setShowHelper] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  // Sample listing images for display
  const listingImages = {
    'Organic': 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=400',
    'Plastic': 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
    'Paper': 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=400',
    'Glass': 'https://images.unsplash.com/photo-1572297794292-1acb4ae41392?w=400',
    'E-Waste': 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400',
    'Textiles': 'https://images.unsplash.com/photo-1558769132-cb1aea41f843?w=400'
  };

  useEffect(() => {
    fetchAllListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchQuery, categoryFilter, priceFilter]);

  const fetchAllListings = async () => {
    try {
      const response = await api.get('/listings/all');
      setListings(response.data);
      setFilteredListings(response.data);
      
      // Calculate stats (for now showing all available)
      setStats({
        available: response.data.filter(l => l.status === 'available').length,
        claimed: 0,
        pending: 0,
        completed: 0
      });
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All Categories') {
      filtered = filtered.filter(listing => listing.category === categoryFilter);
    }

    // Price filter
    if (priceFilter === 'Negotiable') {
      filtered = filtered.filter(listing => listing.pricing === 'negotiable');
    } else if (priceFilter === 'Fixed Price') {
      filtered = filtered.filter(listing => listing.pricing === 'fixed');
    }

    setFilteredListings(filtered);
  };

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
    setShowListingDetails(true);
  };

  const handleClaimListing = async () => {
    if (!selectedListing || !user) return;
    
    try {
      // Create transaction
      await api.post('/transactions', {
        listingId: selectedListing._id,
        producerId: selectedListing.userId,
        producerName: 'Producer', // You might want to fetch this
        consumerName: user.firstName || user.username || 'Consumer'
      });
      
      alert('✅ Listing claimed successfully! \n\nYou can now:\n• Chat with the producer via the Messages button\n• Coordinate pickup details\n• Discuss pricing');
      setShowListingDetails(false);
      fetchListings(); // Refresh listings
    } catch (error) {
      console.error('Error claiming listing:', error);
      if (error.response?.status === 500) {
        alert('❌ Backend server is not running. Please contact the administrator.');
      } else if (error.message.includes('Network Error')) {
        alert('❌ Cannot connect to server. Make sure the backend is deployed and VITE_API_URL is set correctly.');
      } else {
        alert('Failed to claim listing. It may already be claimed or the listing no longer exists.');
      }
    }
  };

  return (
    <main className="consumer-dashboard">
      <NavBar />
      <div className="consumer-dashboard-content">
        <ConsumerWelcomeMessage />
        
        {/* Stats Cards */}
        <div className='consumer-stats-grid'>
          <div className='consumer-stat-card'>
            <div className='consumer-stat-icon available-icon'>
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className='consumer-stat-info'>
              <p className='consumer-stat-label'>Available</p>
              <p className='consumer-stat-value'>{stats.available}</p>
            </div>
          </div>

          <div className='consumer-stat-card'>
            <div className='consumer-stat-icon claimed-icon'>
              <i className="fa-solid fa-box"></i>
            </div>
            <div className='consumer-stat-info'>
              <p className='consumer-stat-label'>Claimed</p>
              <p className='consumer-stat-value'>{stats.claimed}</p>
            </div>
          </div>

          <div className='consumer-stat-card'>
            <div className='consumer-stat-icon pending-icon'>
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className='consumer-stat-info'>
              <p className='consumer-stat-label'>Pending</p>
              <p className='consumer-stat-value'>{stats.pending}</p>
            </div>
          </div>

          <div className='consumer-stat-card'>
            <div className='consumer-stat-icon completed-icon'>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className='consumer-stat-info'>
              <p className='consumer-stat-label'>Completed</p>
              <p className='consumer-stat-value'>{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button 
            className={`view-btn ${activeView === 'map' ? 'active' : ''}`}
            onClick={() => setActiveView('map')}
          >
            Map View
          </button>
          <button 
            className={`view-btn ${activeView === 'pickups' ? 'active' : ''}`}
            onClick={() => setActiveView('pickups')}
          >
            My Pickups
          </button>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search waste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdowns">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option>All Categories</option>
              <option>Organic</option>
              <option>Plastic</option>
              <option>Paper</option>
              <option>Glass</option>
              <option>E-Waste</option>
              <option>Textiles</option>
            </select>

            <select 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
              className="filter-select"
            >
              <option>All Prices</option>
              <option>Negotiable</option>
              <option>Fixed Price</option>
            </select>
          </div>
        </div>

        {activeView === 'map' && (
          <>
            {/* Map View */}
            <div className="map-container">
              <div className="real-map-wrapper">
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '12px' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Nairobi,Kenya&zoom=12">
                </iframe>
                <div className="map-overlay-info">
                  <i className="fas fa-map-marked-alt map-overlay-icon"></i>
                  <p className="map-overlay-title">Interactive Map View</p>
                  <p className="map-overlay-subtitle">Showing {filteredListings.length} waste listings near you</p>
                </div>
              </div>
            </div>

            {/* Available Listings */}
            <div className="available-listings-section">
              <h2 className="listings-title">Available Listings</h2>
              
              {loading ? (
                <div className="loading-state">Loading listings...</div>
              ) : filteredListings.length === 0 ? (
                <div className="empty-listings-consumer">
                  <i className="fas fa-box-open empty-icon"></i>
                  <p className="empty-text">No listings available</p>
                  <p className="empty-subtext">Check back later for new waste materials</p>
                </div>
              ) : (
                <div className="consumer-listings-grid">
                  {filteredListings.map((listing) => (
                    <div 
                      key={listing._id} 
                      className="consumer-listing-card"
                      onClick={() => handleListingClick(listing)}
                    >
                      <img 
                        src={listingImages[listing.category] || listingImages['Organic']} 
                        alt={listing.category} 
                        className="consumer-listing-image" 
                      />
                      <div className="consumer-listing-content">
                        <div className="consumer-listing-header">
                          <span className="consumer-listing-badge">{listing.category}</span>
                          {listing.location && (
                            <span className="consumer-listing-distance">
                              <i className="fas fa-location-dot"></i> {listing.location.city}
                            </span>
                          )}
                        </div>
                        <p className="consumer-listing-description">{listing.description}</p>
                        <div className="consumer-listing-footer">
                          <span className="consumer-listing-quantity">
                            {listing.quantity} {listing.unit}
                          </span>
                          <span className="consumer-listing-price">
                            {listing.pricing === 'negotiable' ? (
                              <span className="negotiable-badge">Negotiable</span>
                            ) : (
                              <span className="price-badge">KES {listing.fixedPrice}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeView === 'pickups' && (
          <div className="my-pickups-section">
            <div className="empty-pickups">
              <i className="fas fa-truck empty-icon"></i>
              <p className="empty-text">No pickups scheduled yet</p>
              <p className="empty-subtext">Claim listings to schedule pickups</p>
            </div>
          </div>
        )}
      </div>

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

      {/* Listing Details Modal */}
      {showListingDetails && selectedListing && (
        <div className="listing-details-modal-overlay" onClick={() => setShowListingDetails(false)}>
          <div className="listing-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="listing-details-header">
              <h2>Listing Details</h2>
              <button className="modal-close" onClick={() => setShowListingDetails(false)}>×</button>
            </div>

            <div className="listing-details-content">
              <img 
                src={listingImages[selectedListing.category] || listingImages['Organic']} 
                alt={selectedListing.category} 
                className="listing-details-image" 
              />

              <div className="listing-details-info">
                <div className="detail-badges">
                  <span className="detail-category-badge">{selectedListing.category}</span>
                  <span className="detail-status-badge">available</span>
                </div>

                <p className="detail-description">{selectedListing.description}</p>

                <div className="detail-grid">
                  <div className="detail-item">
                    <i className="fas fa-weight"></i>
                    <div>
                      <p className="detail-label">Quantity</p>
                      <p className="detail-value">{selectedListing.quantity} {selectedListing.unit}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <i className="fas fa-tag"></i>
                    <div>
                      <p className="detail-label">Price</p>
                      <p className="detail-value">
                        {selectedListing.pricing === 'negotiable' ? 'Negotiable' : `KES ${selectedListing.fixedPrice}`}
                      </p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <i className="far fa-calendar"></i>
                    <div>
                      <p className="detail-label">Listed Date</p>
                      <p className="detail-value">{new Date(selectedListing.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <i className="fas fa-user"></i>
                    <div>
                      <p className="detail-label">Producer</p>
                      <p className="detail-value">John Producer</p>
                    </div>
                  </div>
                </div>

                <div className="location-preview">
                  <div className="location-map-container">
                    <iframe
                      width="100%"
                      height="250"
                      style={{ border: 0, borderRadius: '12px 12px 0 0' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                        `${selectedListing.location?.city || 'Nairobi'}${selectedListing.location?.area ? ', ' + selectedListing.location.area : ''}, Kenya`
                      )}&zoom=13`}>
                    </iframe>
                  </div>
                  <div className="location-info-text">
                    <p className="location-address">
                      {selectedListing.location?.city || 'Location not specified'}
                      {selectedListing.location?.area && `, ${selectedListing.location.area}`}
                    </p>
                    <p className="location-country">Kenya</p>
                  </div>
                </div>

                <button className="claim-button" onClick={handleClaimListing}>
                  <i className="fas fa-plus"></i>
                  Claim Pickup & Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ConsumerDashboard;
