import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../services/api';

function Chat({ onClose }) {
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      // Set user role for this conversation
      const role = selectedConversation.producerId === user?.id ? 'producer' : 'consumer';
      setUserRole(role);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await api.get('/transactions');
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      alert('Unable to load conversations. Please make sure the backend server is running.');
      setLoading(false);
    }
  };

  const fetchMessages = async (transactionId) => {
    try {
      const response = await api.get(`/transactions/${transactionId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (text = null, type = 'text', quickAction = null) => {
    const messageToSend = text || messageText.trim();
    
    if (!messageToSend || !selectedConversation || sending) return;

    setSending(true);
    try {
      const response = await api.post(`/transactions/${selectedConversation._id}/messages`, {
        messageText: messageToSend,
        messageType: type,
        quickActionType: quickAction,
        senderName: user?.firstName || user?.username || 'User'
      });

      setMessages([...messages, response.data]);
      setMessageText('');
      
      // Update conversation's last message time
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const sendQuickAction = (actionType, actionText) => {
    sendMessage(actionText, 'quick-action', actionType);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherPartyName = (conversation) => {
    if (!user) return 'Unknown';
    return conversation.producerId === user.id 
      ? conversation.consumerName 
      : conversation.producerName;
  };

  const getListingInfo = (conversation) => {
    if (!conversation.listingId) return 'Listing';
    return `${conversation.listingId.category} - ${conversation.listingId.quantity}${conversation.listingId.unit}`;
  };

  const formatTime = (date) => {
    const msgDate = new Date(date);
    const now = new Date();
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return msgDate.toLocaleDateString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-container" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <div className="chat-header-content">
            <i className="fas fa-comments"></i>
            <h2>Messages</h2>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="chat-body">
          {/* Conversations List */}
          <div className="conversations-list">
            <div className="conversations-header">
              <h3>Conversations</h3>
              <span className="conversation-count">{conversations.length}</span>
            </div>
            
            {loading ? (
              <div className="loading-conversations">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="empty-conversations">
                <i className="fas fa-comments"></i>
                <p>No conversations yet</p>
                <span>
                  {user ? 
                    "Claim a listing (as consumer) or wait for someone to claim your listing (as producer) to start chatting" 
                    : "Loading user info..."
                  }
                </span>
              </div>
            ) : (
              <div className="conversation-items">
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`conversation-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="conversation-avatar">
                      <i className={`fas ${conv.producerId === user?.id ? 'fa-recycle' : 'fa-user'}`}></i>
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-name">{getOtherPartyName(conv)}</div>
                      <div className="conversation-listing">{getListingInfo(conv)}</div>
                    </div>
                    <div className="conversation-meta">
                      <span className="conversation-time">{formatTime(conv.lastMessageAt)}</span>
                      {((conv.producerId === user?.id && conv.unreadCountProducer > 0) ||
                        (conv.consumerId === user?.id && conv.unreadCountConsumer > 0)) && (
                        <span className="unread-badge">
                          {conv.producerId === user?.id ? conv.unreadCountProducer : conv.unreadCountConsumer}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="messages-area">
            {!selectedConversation ? (
              <div className="no-conversation-selected">
                <i className="fas fa-comments"></i>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the left to view messages</p>
              </div>
            ) : (
              <>
                {/* Conversation Header */}
                <div className="conversation-header-bar">
                  <div className="conv-header-left">
                    <div className="conv-avatar">
                      <i className={`fas ${userRole === 'producer' ? 'fa-user' : 'fa-recycle'}`}></i>
                    </div>
                    <div className="conv-header-info">
                      <h4>{getOtherPartyName(selectedConversation)}</h4>
                      <p>{getListingInfo(selectedConversation)}</p>
                    </div>
                  </div>
                  <div className="conv-status">
                    <span className={`status-badge status-${selectedConversation.status}`}>
                      {selectedConversation.status}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                {userRole && (
                  <div className="quick-actions-bar">
                    <button 
                      className="quick-action-btn"
                      onClick={() => sendQuickAction('confirm-pickup', 'Can we confirm the pickup time?')}
                    >
                      <i className="fas fa-clock"></i> Confirm Pickup
                    </button>
                    <button 
                      className="quick-action-btn"
                      onClick={() => sendQuickAction('review-price', 'Let\'s review the pricing')}
                    >
                      <i className="fas fa-dollar-sign"></i> Review Price
                    </button>
                  </div>
                )}

                {/* Messages List */}
                <div className="messages-list">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message-bubble ${msg.senderId === user?.id ? 'sent' : 'received'} ${msg.senderId === 'system' ? 'system-message' : ''}`}
                    >
                      {msg.senderId !== user?.id && msg.senderId !== 'system' && (
                        <div className="message-sender">{msg.senderName}</div>
                      )}
                      <div className="message-content">
                        {msg.messageType === 'quick-action' && (
                          <div className="quick-action-indicator">
                            <i className={`fas ${
                              msg.quickActionType === 'confirm-pickup' ? 'fa-clock' :
                              msg.quickActionType === 'review-price' ? 'fa-dollar-sign' :
                              'fa-comment'
                            }`}></i>
                          </div>
                        )}
                        <p>{msg.messageText}</p>
                      </div>
                      <div className="message-time">{formatTime(msg.createdAt)}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="message-input-area">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                  />
                  <button 
                    className="send-message-btn"
                    onClick={() => sendMessage()}
                    disabled={sending || !messageText.trim()}
                  >
                    {sending ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
