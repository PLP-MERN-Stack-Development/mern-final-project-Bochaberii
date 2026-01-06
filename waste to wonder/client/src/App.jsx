import './App.css';
import HomePage from './pages/HomePage';
import ProducerSignup from './pages/ProducerSignup';
import ConsumerSignup from './pages/ConsumerSignup';
import ProducerLogin from './pages/ProducerLogin';
import ConsumerLogin from './pages/ConsumerLogin';
import ProducerDashboard from './pages/ProducerDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useClerk } from '@clerk/clerk-react';

function App() {
  const { loaded } = useClerk();

  if (!loaded) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading Taka Bora...</h2>
          <p>Preparing your waste management platform</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="producer-signup" element={<ProducerSignup />} />
          <Route path="consumer-signup" element={<ConsumerSignup />} />
          <Route path="producer-login" element={<ProducerLogin />} />
          <Route path="consumer-login" element={<ConsumerLogin />} />
          
          {/* Protected Routes - Require Sign In */}
          <Route path="producer-dashboard" element={
            <>
              <SignedIn>
                <ProducerDashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
          <Route path="consumer-dashboard" element={
            <>
              <SignedIn>
                <ConsumerDashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
