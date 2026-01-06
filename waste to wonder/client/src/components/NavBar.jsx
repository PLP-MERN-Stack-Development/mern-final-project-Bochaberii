import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserButton, useAuth, useUser } from '@clerk/clerk-react';
import Chat from './Chat';

function NavBar() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [showChat, setShowChat] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const handleChat = () => {
    setShowChat(true);
  };

  const handleLeaderboard = () => {
    alert('Leaderboard feature coming soon!');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <i className="fa-solid fa-recycle"></i>
          <p className="nav-logo">Taka Bora</p>
        </div>
        <ul>
          <li><button className="nav-link-btn" onClick={handleChat}><i className="fas fa-comments"></i> Messages</button></li>
          <li><button className="nav-link-btn" onClick={handleLeaderboard}><i className="fas fa-trophy"></i> Leaderboard</button></li>
          <li className="user-info">
            <span className="user-name">{user?.firstName || 'User'}</span>
            <UserButton afterSignOutUrl="/" />
          </li>
        </ul>
      </nav>

      {/* Chat */}
      {showChat && <Chat onClose={() => setShowChat(false)} />}
    </>
  )
}
export default NavBar;
