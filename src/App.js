import React, { useState } from 'react';
import AddPlayer from './Components/AddPlayer';
import ScoreBoard from './Components/ScoreBoard';
import ScoreChart from './Components/ScoreChart';
import SetThreshold from './Components/SetLimit';
import AnalyticsDashboard from './Components/Analytics/AnalyticsDashboard';
import './App.css';

const playerColors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'];

function App() {
  const [players, setPlayers] = useState([]);
  const [limit, setLimit] = useState();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [game_name, setGameName] = useState('');
  const [winner, setWinner] = useState('');
  // const [player_name, setPlayer_Name] = useState('');
  // const [winner_id, setWinnerId] = useState('');
  

  const handleSubmit = async () => {
    setError(''); // Clear previous error
    setName('');  // Clear previous name

    try {
      const response = await fetch('http://localhost:5001/get-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      console.log(response);

      const data = await response.json();

      if (response.ok) {
        setName(data.name); // Set the name on success
      } else {
        setError(data.error); // Set the error message on failure
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  // =======  Backend functions  =======
  
  const addPlayer = async (name) => {
    try {
      const response = await fetch('http://localhost:5001/add-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setPlayers([
          ...players,
          {
            player_id: data.player_id, // Use the ID returned from the backend
            name,
            score: 0,
            history: [0],
            color: playerColors[players.length % playerColors.length],
          },
        ]);
      } else {
        setError(data.error || 'Failed to add player');
      }
    } catch (err) {
      console.error('Error adding player:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const addGame = async (game_name, winner) => {
    try {
      const response = await fetch('http://localhost:5001/add-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game_name, winner }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Game added:', data);
      } else {
        setError(data.error || 'Failed to add game');
      }
    } catch (err) {
      console.error('Error adding game:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const addScore = async (playername, score) => {
    // const game_name = 'Game 1'; // Replace with the actual game name or pass it as a parameter
    try {
      const response = await fetch('http://localhost:5001/add-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game_name, playername, score }),
      });
      const data = await response.json();
  
      if (response.ok) {
        console.log('Score added to game successfully:', data);
      } else {
        console.error('Failed to add score:', data.error);
      }
    } catch (err) {
      console.error('Error adding score:', err);
    }
  };

  // =======  Frontend functions  =======
  const removePlayer = (index) => {
    const confirmRemoval = window.confirm('Are you sure you want to remove this player?');
    if (confirmRemoval) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  const updateScore = (index, delta) => {
    const newPlayers = [...players];
    newPlayers[index].score += delta;
    newPlayers[index].history.push(newPlayers[index].score);

    // Check if the player has reached the threshold
    if (newPlayers[index].score > limit) {
      newPlayers[index].color = 'grey';
    }
    setPlayers(newPlayers);
  };

  const undoLastScore = (index) => {
    const newPlayers = [...players];
    if (newPlayers[index].history.length > 1) {
      newPlayers[index].history.pop();
      newPlayers[index].score = newPlayers[index].history[newPlayers[index].history.length - 1];
      setPlayers(newPlayers);
    }
  };

  return (
    <div className="App">
      <h1>Score Counter</h1>
      <AddPlayer addPlayer={addPlayer} />
      <SetThreshold setLimit={setLimit} />
      <div>{limit}</div>
      <ScoreBoard
        players={players}
        updateScore={updateScore}
        removePlayer={removePlayer}
        undoLastScore={undoLastScore}
        addScore={addScore}
      />
      <ScoreChart players={players} />
      <div> 
        {/* Experimental query */}
        <h1>Find Name by ID</h1>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter ID"
        />
        <button onClick={handleSubmit}>Search</button>

        {name && <p>Result: {name}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        <h1>Add Game</h1>
        <input
          type="text"
          value={game_name}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Enter Game Name"
        />
        <input
          type="text"
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
          placeholder="Enter Winner"
        />
        
        <button onClick={() => addGame(game_name, winner)}>Add Game</button>
      </div>
      <div>
        <AnalyticsDashboard />
      </div>
        

    </div>
  );
}

export default App;
