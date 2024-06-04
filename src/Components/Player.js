import React, { useState } from 'react';

function Player({ index, name, score, updateScore }) {
  const [incrementValue, setIncrementValue] = useState('0');

  const handleInputChange = (e) => {
    setIncrementValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const value = parseInt(incrementValue, 10);
      if (!isNaN(value)) {
        updateScore(index, value);
        setIncrementValue(''); // Optionally clear the input field after increment
      }
    }
  };

  return (
    <div className="player">
      <span className='name'>{name} </span>
      <span>{score}</span>
      <input
        type="text"
        value={incrementValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button onClick={() => {
        const value = parseInt(incrementValue, 10);
        if (!isNaN(value)) {
          updateScore(index, value);
          setIncrementValue(''); // Optionally clear the input field after increment
        }
      }}>+</button>
    </div>
  );
}

export default Player;


