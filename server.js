const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 5001; // Make sure this matches the port you're using

// Enable CORS to allow cross-origin requests from your frontend
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER, // Database username
  host: process.env.DB_HOST, // Database host (e.g., localhost)
  database: process.env.DB_NAME, // Database name
  password: process.env.DB_PASSWORD, // Database password
  port: process.env.DB_PORT, // Database port (e.g., 5432)
});

// Endpoint to get a name by ID FOR TESTING PURPOSES
app.post('/get-name', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const result = await pool.query('SELECT name FROM test_table WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json({ name: result.rows[0].name });
    } else {
      res.status(404).json({ error: 'ID not found' });
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Endpoint to add a new player
app.post('/add-player', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Check if the player already exists
    const existingPlayer = await pool.query(
      'SELECT * FROM players WHERE name = $1',
      [name]
    );

    if (existingPlayer.rows.length > 0) {
      // Player exists, return the existing player
      return res.json(existingPlayer.rows[0]);
    }

    // Player does not exist, insert a new player
    const result = await pool.query(
      'INSERT INTO players (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Endpoint to add a game
app.post('/add-game', async (req, res) => {
  const {game_name, winner} = req.body;

  try {
    // get the id of the winner name
    const winner_id = await pool.query(
      'SELECT player_id FROM players WHERE name = $1',
      [winner]
    );

    // insert the game into the database
    const result = await pool.query(
      'INSERT INTO games(game_name, winner) VALUES($1, $2) RETURNING *',
      [game_name, winner_id.rows[0].player_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Endpoint to add a score
app.post('/add-score', async (req, res) => {
  const { game_name, playername, score } = req.body;

  if (!game_name || !playername || !score) {
    return res.status(400).json({ error: 'Game name, player name, and score are required' });
  }

  try {
    // Get the game ID based on the game name
    const gameResult = await pool.query(
      'SELECT game_id FROM games WHERE game_name = $1',
      [game_name]
    );
    if (gameResult.rows.length === 0) {
      console.log('Game not found', game_name);
      return res.status(404).json({ error: 'Game not found' });
    }
    const game_id = gameResult.rows[0].game_id;

    // Get the player ID based on the player name
    const playerResult = await pool.query(
      'SELECT player_id FROM players WHERE name = $1',
      [playername]
    );
    if (playerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    const player_id = playerResult.rows[0].player_id;

    // Insert the score
    const result = await pool.query(
      'INSERT INTO scores (game_id, player_id, score) VALUES ($1, $2, $3) RETURNING *',
      [game_id, player_id, score]
    );
    res.status(201).json({ success: true, score: result.rows[0] });
  } catch (err) {
    console.error('Error adding score:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint to get games
// Returns a list of all games with details (game ID, game name, winner, timestamp)
app.get('/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint to get splayer stats (specific to a player)
app.get('/player-stats/:player_id', async (req, res) => {
  const { player_id } = req.params;
  try {
    const totalWins = await pool.query(
      'SELECT COUNT(*) FROM games WHERE winner = $1',
      [player_id]
    );
    const totalPoints = await pool.query(
      'SELECT SUM(score) FROM scores WHERE player_id = $1',
      [player_id]
    );
    const gamesPlayed = await pool.query(
      'SELECT COUNT(DISTINCT game_id) FROM scores WHERE player_id = $1',
      [player_id]
    );
    res.json({
      totalWins: totalWins.rows[0].count,
      totalPoints: totalPoints.rows[0].sum,
      averagePoints: totalPoints.rows[0].sum / gamesPlayed.rows[0].count,
    });
  } catch (err) {
    console.error('Error fetching player stats:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// endpoint to get all player stats
app.get('/all-player-stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT players.player_id, players.name,
        COUNT(games.winner) AS total_wins,
        SUM(scores.score) AS total_points,
        COUNT(DISTINCT scores.game_id) AS games_played
      FROM players
      LEFT JOIN games ON players.player_id = games.winner
      LEFT JOIN scores ON players.player_id = scores.player_id
      GROUP BY players.player_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all player stats:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
