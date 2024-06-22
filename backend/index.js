const express = require('express');
const { Pool, Client } = require('pg');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const app = express();
app.use(cors());

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'speedometer_data',
  password: 'password',
  port: 5432,
});

const pgClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'speedometer_data',
  password: 'password',
  port: 5432,
});


pgClient.connect();
pgClient.query('LISTEN speed_channel');

pgClient.on('notification', (msg) => {
  const payload = JSON.parse(msg.payload);
  webSocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
});

app.get('/speed', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM speed_data ORDER BY timestamp DESC LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching speed data');
  }
});

webSocketServer.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});
