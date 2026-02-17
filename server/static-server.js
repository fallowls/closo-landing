const express = require('express');
const path = require('path');
const app = express();

// Serve the static xtract folder
app.use('/xtract', express.static(path.join(__dirname, 'xtract')));

// Fallback for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
