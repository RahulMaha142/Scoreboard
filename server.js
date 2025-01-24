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

// Endpoint to remove a player

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
  const { game_id, player_id, score } = req.body;
  // get the game id based on game name
  game_id = await pool.query(
    'SELECT game_id FROM games WHERE game_name = $1',
    [game_id]
  );
  // get the player id based on player name
  player_id = await pool.query(
    'SELECT player_id FROM players WHERE name = $1',
    [player_id]
  );

  if (!game_id || !player_id || !score) {
    return res.status(400).json({ error: 'Game ID, player ID, and score are required' });
  }

  try {
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


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
