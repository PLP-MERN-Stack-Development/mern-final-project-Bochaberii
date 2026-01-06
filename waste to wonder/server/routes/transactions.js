const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Message = require('../models/Message');
const Listing = require('../models/Listing');

// Get all transactions for a user (both as producer and consumer)
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }

    const transactions = await Transaction.find({
      $or: [{ producerId: userId }, { consumerId: userId }]
    })
    .populate('listingId')
    .sort({ lastMessageAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// Create a new transaction (when consumer claims a listing)
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { listingId, producerId, producerName, consumerName } = req.body;

    if (!userId || !listingId || !producerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if transaction already exists
    const existingTransaction = await Transaction.findOne({
      listingId,
      consumerId: userId
    });

    if (existingTransaction) {
      return res.json(existingTransaction);
    }

    // Update listing status
    await Listing.findByIdAndUpdate(listingId, { status: 'pending' });

    // Create new transaction
    const transaction = new Transaction({
      listingId,
      producerId,
      producerName,
      consumerId: userId,
      consumerName,
      status: 'pending'
    });

    await transaction.save();

    // Create initial system message
    const initialMessage = new Message({
      transactionId: transaction._id,
      senderId: 'system',
      senderName: 'Taka Bora',
      senderRole: 'consumer',
      messageText: `${consumerName} has claimed this listing. Start chatting to coordinate pickup!`,
      messageType: 'text'
    });

    await initialMessage.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
});

// Get messages for a transaction
router.get('/:transactionId/messages', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }

    // Verify user is part of this transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.producerId !== userId && transaction.consumerId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const messages = await Message.find({ transactionId }).sort({ createdAt: 1 });

    // Mark messages as read
    const userRole = transaction.producerId === userId ? 'consumer' : 'producer';
    await Message.updateMany(
      { transactionId, senderRole: userRole, isRead: false },
      { isRead: true }
    );

    // Reset unread count
    if (transaction.producerId === userId) {
      transaction.unreadCountProducer = 0;
    } else {
      transaction.unreadCountConsumer = 0;
    }
    await transaction.save();

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/:transactionId/messages', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.headers['x-user-id'];
    const { messageText, messageType, quickActionType, senderName } = req.body;

    if (!userId || !messageText) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify transaction exists and user is part of it
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const isProducer = transaction.producerId === userId;
    const isConsumer = transaction.consumerId === userId;

    if (!isProducer && !isConsumer) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const message = new Message({
      transactionId,
      senderId: userId,
      senderName: senderName || (isProducer ? transaction.producerName : transaction.consumerName),
      senderRole: isProducer ? 'producer' : 'consumer',
      messageText,
      messageType: messageType || 'text',
      quickActionType: quickActionType || null
    });

    await message.save();

    // Update transaction
    transaction.lastMessageAt = new Date();
    if (isProducer) {
      transaction.unreadCountConsumer += 1;
    } else {
      transaction.unreadCountProducer += 1;
    }
    await transaction.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Update transaction status
router.patch('/:transactionId/status', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.headers['x-user-id'];
    const { status, pickupTime, agreedPrice } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User ID required' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.producerId !== userId && transaction.consumerId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (status) transaction.status = status;
    if (pickupTime) transaction.pickupTime = pickupTime;
    if (agreedPrice) transaction.agreedPrice = agreedPrice;

    await transaction.save();

    // Update listing status if transaction completed
    if (status === 'completed') {
      await Listing.findByIdAndUpdate(transaction.listingId, { status: 'completed' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
});

module.exports = router;
