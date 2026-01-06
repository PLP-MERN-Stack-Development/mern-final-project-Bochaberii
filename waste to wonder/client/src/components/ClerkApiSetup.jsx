import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setGetToken } from '../services/api';

function ClerkApiSetup({ children }) {
  const { getToken } = useAuth();

  useEffect(() => {
    // Set the token getter function for API calls
    setGetToken(getToken);
  }, [getToken]);

  return children;
}

export default ClerkApiSetup;
