import React, { useContext } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import WordFinder from './WordFinder.js';
import PlayBoggle from './PlayBoggle.js';
import { BoggleContext } from './BoggleContext.js';

function HomePage() {
  const { setBoardSize, setMinLetters, setGameType, clearBoard } = useContext(BoggleContext);
  const location = useLocation();

  const handleGameTypeChange = (gameType) => {
    clearBoard();
    localStorage.clear();
    setBoardSize(5);
    setMinLetters(4);
    setGameType(gameType);
    localStorage.setItem('gameType', JSON.stringify(gameType));
  }

  return (
    <div className="container">
      <Link to="/">
        <h1 onClick={() => handleGameTypeChange('home-page')}>Boggle Word Finder</h1>
      </Link>
      {location.pathname === '/' && (
        <div className="home-buttons-container">
          <Link to="/word-finder">
            <button onClick={() => handleGameTypeChange('word-finder')}>Find all the words in your Boggle board</button>
          </Link>
          <Link to="/play-boggle">
            <button onClick={() => handleGameTypeChange('regular-boggle')}>Play regular Boggle</button>
          </Link>
        </div>
      )}

      <Routes>
        <Route path="/word-finder" element={<WordFinder />} />
        <Route path="/play-boggle" element={<PlayBoggle />} />
      </Routes>
    </div >
  );
}

export default HomePage;