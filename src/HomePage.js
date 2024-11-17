import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import FindWords from './FindWords.js';
import PlayBoggle from './PlayBoggle.js';

function HomePage() {
  const location = useLocation();

  return (
    <div className="container">
      <Link to="/">
        <h1>Boggle Word Finder</h1>
      </Link>
      {location.pathname === '/' && (
        <div className="home-buttons-container">
          <Link to="/find-words">
            <button>Find all the words in your Boggle board</button>
          </Link>
          <Link to="/play-boggle">
            <button>Play regular Boggle</button>
          </Link>
        </div>
      )}

      <Routes>
        <Route path="/find-words" element={<FindWords />} />
        <Route path="/play-boggle" element={<PlayBoggle />} />
      </Routes>
    </div>
  );
}

export default HomePage;