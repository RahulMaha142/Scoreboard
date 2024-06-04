import React from 'react';
import Player from './Player';

function ScoreBoard({ players, updateScore }) {
  return (
    // Align elements in a cloumn
    <div className="scoreboard">
      {players.map((player, index) => (
        <Player
          key={index}
          index={index}
          name={player.name}
          score={player.score}
          updateScore={updateScore}
        />
      ))}
    </div>
  );
}

export default ScoreBoard;






