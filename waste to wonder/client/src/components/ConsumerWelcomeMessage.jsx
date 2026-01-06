import React from "react";
import { useUser } from '@clerk/clerk-react';

function ConsumerWelcomeMessage() {
  const { user } = useUser();
  const displayName = user?.username || user?.firstName || 'Collector';

  return (
    <div className='consumer-welcome-message'>
      <h1 style={{color:'#264ab7'}}>Welcome back, {displayName}!</h1>
      <p>Find and collect waste materials for your start-up</p>
    </div>
  )
}

export default ConsumerWelcomeMessage;
