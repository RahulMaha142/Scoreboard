import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function PlayerScoreTrends({ playerId }) {
  const [scoreTrends, setScoreTrends] = useState([]);

  useEffect(() => {
    // Fetch score trends for a specific player
    fetch(`http://localhost:5001/score-trends/${playerId}`)
      .then((response) => response.json())
      .then((data) => setScoreTrends(data))
      .catch((error) => console.error('Error fetching score trends:', error));
  }, [playerId]);

  const data = {
    labels: scoreTrends.map((trend) => `Game ${trend.game_id}`),
    datasets: [
      {
        label: 'Score',
        data: scoreTrends.map((trend) => trend.score),
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Game',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>Player Score Trends</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export default PlayerScoreTrends;