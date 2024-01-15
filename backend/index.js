
const cors = require('cors');
const express = require("express");
const http = require('http');

const app = express();
app.use(cors());
// app.use(require('./router/route'));

const PORT_ClIENT = 3001;
const PORT_SOCKET = 4000;

const socket = require('./server');

const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {origin: 'http://localhost:5173', methods: ['GET', 'POST']},
});

socket(io);

server.listen(PORT_SOCKET, () => { console.log('listening on: 4000');});

exports.app;