import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';

function ConsumerLogin() {
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Delay showing auth component for smoother transition
    const timer = setTimeout(() => {
      setShowAuth(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <div className="main-page">
        <div className='home-block'>
          <div className="logo-div">
            <i className="fa-solid fa-recycle"></i>
            <p className="logo">Taka Bora</p>
          </div>

          <p className="catch-phrase">
            Transform waste into opportunity. Join our sustainable marketplace today.
          </p>

          <div className='consumer-signup'>
            <i className="fa-solid fa-recycle"></i>
          </div>
            
          <p className='consumer-welcome-phrase'>Welcome Collector! Login to your account below!</p>

          <div className={`clerk-container ${showAuth ? 'fade-in' : ''}`}>
            <SignIn 
              afterSignInUrl="/consumer-dashboard"
              redirectUrl="/consumer-dashboard"
            />
          </div>

          <div className="buttons" style={{marginTop: '20px'}}>
            <Link to="/" className='back-button'>Back to Home</Link>
          </div>

          <p>Don't have an account? <Link to="/consumer-signup" style={{color:'#009966', textDecoration:'underline'}}>Sign up</Link></p>
        </div>
      </div>
    </main>
  )
}

export default ConsumerLogin;
