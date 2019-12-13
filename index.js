const express = require('express');
const server = require('./server.js');

server.use(express.json());
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`App is listening on port ${port}`));