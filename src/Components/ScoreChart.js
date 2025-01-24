import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function ScoreChart({ players }) {
  // Determine the maximum number of turns based on the longest history array
  const maxTurns = Math.max(...players.map(player => player.history.length));

  // Generate an array of turn numbers (1, 2, 3, ...)
  const labels = Array.from({ length: maxTurns }, (_, i) => i + 1);

  const data = {
    labels: labels,
    datasets: players.map((player, index) => ({
      label: player.name,
      data: player.history,
      borderColor: `hsl(${index * 60}, 100%, 50%)`,
      fill: false,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Turn Number'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score'
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
}

export default ScoreChart;
