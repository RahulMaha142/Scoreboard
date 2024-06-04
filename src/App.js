import React, { useState } from 'react';
import AddPlayer from './Components/AddPlayer';
import ScoreBoard from './Components/ScoreBoard';
import './App.css';


function App() {
  const [players, setPlayers] = useState([]);

  const addPlayer = (name) => {
    setPlayers([...players, { name, score: 0 }]);
  };

  const updateScore = (index, delta) => {
    const newPlayers = [...players];
    newPlayers[index].score += delta;
    setPlayers(newPlayers);
  };

  return (
    <div className="App">
      <h1>Score Counter</h1>
      <AddPlayer addPlayer={addPlayer} />
      <ScoreBoard players={players} updateScore={updateScore} />
    </div>
  );
}


export default App;
