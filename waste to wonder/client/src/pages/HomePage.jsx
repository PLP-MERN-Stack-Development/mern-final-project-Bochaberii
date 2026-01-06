import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main>
      <div className="main-page">

        <div className="home-block">
          <div className="logo-div">
            <i className="fa-solid fa-recycle"></i>
            <p className="logo">Taka Bora</p>
          </div>

          <p className="catch-phrase">
            Transform waste into opportunity. Join our sustainable marketplace today.
          </p>

          <div className="client-buttons">
            <Link to="/producer-signup" className="producer">
              <i className="fa-solid fa-recycle"></i>
              <p className="producer-heading">I'm a Waste Producer</p>
              <p>List your waste materials and earn by selling to collectors</p>
            </Link>

            <Link to="/consumer-signup" className="consumer">
              <i className="fa-solid fa-people-arrows"></i>
              <p className="consumer-heading">I'm a Waste Collector</p>
              <p>Find and collect waste materials for recycling and upcycling</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HomePage;
