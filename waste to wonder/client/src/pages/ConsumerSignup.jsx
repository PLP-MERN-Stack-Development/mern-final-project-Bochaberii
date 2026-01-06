import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';

function ConsumerSignup() {
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
            <i className="fa-solid fa-people-arrows"></i>
          </div>
          
          <p className='consumer-welcome-phrase'>Welcome Collector! Sign-up to start your sustainable journey below!</p>

          <div className={`clerk-container ${showAuth ? 'fade-in' : ''}`}>
            <SignUp 
              afterSignUpUrl="/consumer-dashboard"
              redirectUrl="/consumer-dashboard"
              unsafeMetadata={{ userType: 'consumer' }}
            />
          </div>

          <div className="buttons" style={{marginTop: '20px'}}>
            <Link to="/" className='back-button'>Back to Home</Link>
          </div>
              
          <p>Already have an account? <Link to="/consumer-login" style={{color:'#009966', textDecoration:'underline'}}>Login</Link></p>
        </div>
      </div>
    </main>
  )
}

export default ConsumerSignup;
