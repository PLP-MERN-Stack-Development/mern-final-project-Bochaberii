import React from "react";
import { useUser } from '@clerk/clerk-react';

function ProducerWelcomeMessage() {
  const { user } = useUser();
  const displayName = user?.username || user?.firstName || 'Producer';

  return (
    <div className='producer-welcome-message'>
      <h1 style={{color:'#009966'}}>Welcome back, {displayName}!</h1>
      <p>Manage your waste listings and track their status</p>
    </div>
  )
}

export default ProducerWelcomeMessage;
