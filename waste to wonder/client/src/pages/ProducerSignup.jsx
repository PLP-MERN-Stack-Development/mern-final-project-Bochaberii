import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';

function ProducerSignup() {
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

          <div className='producer-signup'>
            <i className="fa-solid fa-recycle"></i>
          </div>
            
          <p className='producer-welcome-phrase'>Welcome Producer! Sign-up to start your sustainable journey below!</p>

          <div className={`clerk-container ${showAuth ? 'fade-in' : 'hidden'}`}>
            {showAuth && (
              <SignUp 
                afterSignUpUrl="/producer-dashboard"
                redirectUrl="/producer-dashboard"
                unsafeMetadata={{ userType: 'producer' }}
              />
            )}
          </div>

          <div className="buttons" style={{marginTop: '20px'}}>
            <Link to="/" className='back-button'>Back to Home</Link>
          </div>

          <p>Already have an account? <Link to="/producer-login" style={{color:'#009966', textDecoration:'underline'}}>Login</Link></p>
        </div>
      </div>
    </main>
  )
}

export default ProducerSignup;
