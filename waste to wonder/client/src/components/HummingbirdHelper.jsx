import React, { useState } from 'react';

function HummingbirdHelper({ onClose }) {
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');

  const faqs = [
    {
      id: 1,
      question: 'How do I list waste?',
      answer: 'To list waste as a producer:\n\n1. Click the "List New Waste" button on your dashboard\n2. Select the waste category (Organic, Plastic, Paper, Glass, E-Waste, or Textiles)\n3. Add a detailed description of the waste\n4. Enter the quantity and select the unit of measurement\n5. Specify your location (city and area)\n6. Choose pricing: negotiable or set a fixed price\n7. Click "List Waste" to publish\n\nYour listing will be visible to collectors immediately!'
    },
    {
      id: 2,
      question: 'How does payment work?',
      answer: 'Payment on Taka Bora works through:\n\n1. **Pricing Options**: Producers can set a fixed price or mark it as negotiable\n2. **Negotiation**: Collectors and producers chat to agree on a fair price\n3. **Payment Methods**: Currently cash on pickup, with mobile money integration coming soon\n4. **Price Agreement**: Once agreed in chat, the price is confirmed before pickup\n5. **Completion**: After successful pickup, both parties confirm the transaction\n\nGreen Points are earned for completed transactions!'
    },
    {
      id: 3,
      question: 'What types of waste can I list?',
      answer: 'Taka Bora accepts 6 main categories of recyclable waste:\n\n🌿 **Organic Waste**: Food scraps, garden waste, compostable materials\n♻️ **Plastic**: Bottles, containers, packaging (PET, HDPE, etc.)\n📄 **Paper**: Newspapers, cardboard, office paper, magazines\n🪟 **Glass**: Bottles, jars, broken glass items\n💻 **E-Waste**: Electronics, cables, batteries, old devices\n👕 **Textiles**: Old clothes, fabric scraps, linens\n\nAll waste should be reasonably clean and sorted by type for easier collection.'
    },
    {
      id: 4,
      question: 'How do Green Points work?',
      answer: 'Green Points is our gamification and rewards system:\n\n⭐ **Earn Points For**:\n- Listing waste (+10 points)\n- Completing transactions (+50 points)\n- Quick response times (+5 points)\n- Quality listings with good descriptions (+15 points)\n- Large quantity recycling (bonus points)\n\n🏆 **Benefits**:\n- Climb the leaderboard\n- Unlock achievement badges\n- Get featured as a top contributor\n- Future rewards and perks\n\n📊 **Track your progress** on the Leaderboard to see how you compare with other Taka Bora users!'
    }
  ];

  const handleQuickQuestion = (faq) => {
    setSelectedFAQ(faq);
  };

  const handleCustomSubmit = () => {
    if (customQuestion.trim()) {
      alert(`Thank you for your question! Our team will respond soon. For now, please check the quick questions above for immediate answers.`);
      setCustomQuestion('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="helper-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="helper-header">
            <i className="fas fa-dove helper-icon"></i>
            <div>
              <h3>Hummingbird Helper</h3>
              <p className="helper-subtitle">Your friendly FAQ assistant</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="helper-content">
          {selectedFAQ ? (
            <div className="faq-answer-view">
              <button className="back-btn" onClick={() => setSelectedFAQ(null)}>
                <i className="fas fa-arrow-left"></i> Back to questions
              </button>
              <div className="faq-answer">
                <h4>{selectedFAQ.question}</h4>
                <div className="answer-text">{selectedFAQ.answer}</div>
              </div>
            </div>
          ) : (
            <>
              <div className="helper-greeting">
                <i className="fas fa-dove"></i>
                <p>Hi! I'm Hummingbird Helper 🦜. How can I assist you today? Click on a question below for detailed answers!</p>
              </div>
              <div className="quick-questions">
                <p className="section-label">Quick questions:</p>
                {faqs.map((faq) => (
                  <button 
                    key={faq.id}
                    className="quick-question-btn"
                    onClick={() => handleQuickQuestion(faq)}
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
              <div className="helper-input">
                <input 
                  type="text" 
                  placeholder="Ask me anything..." 
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
                />
                <button className="send-btn" onClick={handleCustomSubmit}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HummingbirdHelper;
