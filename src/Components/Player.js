import React, { useState, useEffect } from 'react';
import './Player.css';

                  // the related functions and variables are passed as props
function Player({ index, name, score, updateScore, removePlayer, undoLastScore, color, isFirstPlace, addScore }) {
  const [incrementValue, setIncrementValue] = useState('');
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    if (displayScore !== score) {
      const increment = score > displayScore ? 1 : -1;
      const interval = setInterval(() => {
        setDisplayScore((prev) => {
          const newScore = prev + increment;
          if ((increment > 0 && newScore >= score) || (increment < 0 && newScore <= score)) {
            clearInterval(interval);
            return score;
          }
          return newScore;
        });
      }, 100); // Adjust the interval duration for a smoother or faster animation
      return () => clearInterval(interval);
    }
  }, [score, displayScore]);

  const handleInputChange = (e) => {
    setIncrementValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const value = parseInt(incrementValue, 10);
      if (!isNaN(value)) {
        updateScore(index, value);
        setIncrementValue('');
      }
    } else if (e.key === 'u') {
      undoLastScore(index);
    } else if (e.key === 'r') {
      removePlayer(index);
    } else if (e.key === 'a') {
      console.log('Adding score to database');
      addScore(name, score); 
    }
  };

  return (
    <div
      className={`player ${isFirstPlace ? 'leading-player' : ''}`}
      style={{
        borderColor: color,
        borderWidth: '2px',
        boxShadow: isFirstPlace ? `0 0 20px ${color}, 0 0 40px ${color}` : 'none',
      }}
    >
      <span className="name">{name}</span>
      <span className="score">{displayScore}</span>
      <input
        className="increment-input"
        type="text"
        value={incrementValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Input"
        style={{
          borderColor: color,
          height: '30px',
          backgroundColor: 'black',
          color: 'white',
        }}
      />
    </div>
  );
}

export default Player;
