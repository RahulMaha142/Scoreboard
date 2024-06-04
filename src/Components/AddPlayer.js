import React, { useState } from 'react';

function AddPlayer({ addPlayer }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      addPlayer(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className='add-player-input'
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Player Name"
      />
      <button type="submit">Add Player</button>
    </form>
  );
}

export default AddPlayer;
