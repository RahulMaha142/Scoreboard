import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function LeaderboardChart() {
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
        label: 'Total Points',
        data: playerStats.map((player) => player.total_points),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Points',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Player',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>Leaderboard</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default LeaderboardChart;