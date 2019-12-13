require('dotenv').config();
const express = require('express');
const server = require('./server.js');

server.use(express.json());


const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});