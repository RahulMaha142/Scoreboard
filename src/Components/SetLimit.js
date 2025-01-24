import React, { useState } from 'react';

function SetThreshold({ setLimit }) {
  const [threshold, setThreshold] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (threshold.trim()) {
      setLimit(threshold);
      setThreshold('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className='set-limit-input'
        type="number"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        placeholder="Limit"
      />
      <button type="submit">Set Limit</button>
    </form>
  );
}

export default SetThreshold;
