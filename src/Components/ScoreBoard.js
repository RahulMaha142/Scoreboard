import React from 'react';
import Player from './Player';

function ScoreBoard({ players, updateScore, removePlayer, undoLastScore, addScore }) {
  // Determine the player(s) with the lowest score
  const lowestScore = Math.min(...players.map(player => player.score));
  const leadingPlayers = players
    .map((player, index) => ({ ...player, index }))
    .filter(player => player.score === lowestScore)
    .map(player => player.index);

  return (
    <div className="scoreboard">
      {players.map((player, index) => (
        <Player
          key={index}
          index={index}
          name={player.name}
          score={player.score}
          color={player.color}
          updateScore={updateScore}
          removePlayer={removePlayer}
          undoLastScore={undoLastScore}
          addScore={addScore} // Add score to database
          isFirstPlace={leadingPlayers.includes(index)} // Pass the prop to highlight the leading player(s)
        />
      ))}
    </div>
  );
}

export default ScoreBoard;
