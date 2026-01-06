const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// GET all listings (public - for consumers to browse)
router.get('/all', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'available' }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error('Error fetching all listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET all listings for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'temp-user';
    console.log('Fetching listings for user:', userId);
    const listings = await Listing.find({ clerkId: userId }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET a single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const listing = await Listing.findOne({ _id: req.params.id, clerkId: userId });
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// POST create a new listing
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'temp-user';
    const { category, description, quantity, unit, pricing, fixedPrice } = req.body;

    console.log('Creating listing for user:', userId);
    console.log('Request body:', req.body);

    // Validate required fields
    if (!category || !description || !quantity || !unit || !pricing) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { location } = req.body;
    if (!location || !location.city) {
      return res.status(400).json({ error: 'Location (city) is required' });
    }

    // Create listing data
    const listingData = {
      userId: userId,
      clerkId: userId,
      category,
      description,
      quantity: parseInt(quantity),
      unit,
      pricing,
      location: {
        city: location.city,
        area: location.area || ''
      },
      status: 'available'
    };

    // Add fixed price if pricing is fixed
    if (pricing === 'fixed') {
      if (!fixedPrice || parseFloat(fixedPrice) <= 0) {
        return res.status(400).json({ error: 'Fixed price is required and must be greater than 0' });
      }
      listingData.fixedPrice = parseFloat(fixedPrice);
    }

    const listing = new Listing(listingData);
    await listing.save();

    console.log('Listing created successfully:', listing._id);
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: error.message || 'Failed to create listing' });
  }
});

// PUT update a listing
router.put('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { category, description, quantity, unit, pricing, fixedPrice, status } = req.body;

    const listing = await Listing.findOne({ _id: req.params.id, clerkId: userId });
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Update fields
    if (category) listing.category = category;
    if (description) listing.description = description;
    if (quantity) listing.quantity = parseInt(quantity);
    if (unit) listing.unit = unit;
    if (pricing) listing.pricing = pricing;
    if (status) listing.status = status;
    
    if (pricing === 'fixed' && fixedPrice) {
      listing.fixedPrice = parseFloat(fixedPrice);
    }

    await listing.save();
    res.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// DELETE a listing
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, clerkId: userId });
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router;
