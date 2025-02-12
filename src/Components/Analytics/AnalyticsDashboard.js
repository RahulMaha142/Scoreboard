import React from 'react';
import WinsPerPlayerChart from './WinsPerPlayerChart';
import PlayerScoreTrends from './PlayerScoreTrends';
import LeaderboardChart from './LeaderboardChart';

function AnalyticsDashboard() {
  return (
    <div className="analytics-dashboard">
      <h1>Game Analytics</h1>
      <div className="chart-row">
        <WinsPerPlayerChart />
        <LeaderboardChart />
      </div>
      <div className="chart-row">
        <PlayerScoreTrends playerId={1} /> {/* Replace with dynamic player ID */}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;