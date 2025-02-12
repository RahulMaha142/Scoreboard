import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function WinsPerPlayerChart() {
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    // Fetch player stats from your backend
    fetch('http://localhost:5001/all-player-stats')
      .then((response) => response.json())
      .then((data) => setPlayerStats(data))
      .catch((error) => console.error('Error fetching player stats:', error));
  }, []);

  const data = {
    labels: playerStats.map((player) => player.name),
    datasets: [
      {
        label: 'Total Wins',
        data: playerStats.map((player) => player.total_wins),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
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
          text: 'Total Wins',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Player',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>Wins Per Player</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default WinsPerPlayerChart;