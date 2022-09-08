const express = require('express');
const http = require('http'); //provide by node
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketio(server); //it enable socket for server as well as for client

app.use('/', express.static(__dirname + '/public'));

let users = [];

io.on('connection', (socket) => {
  console.log('connection= ', socket.id);
  socket.on('mouse', (data) => {
    // console.log('data= ', data);
    // io.to(data.id).emit('draw', { data }); to same socket id
    socket.broadcast.emit('mouse', data);
  });
  socket.on('draw', (data) => {
    // console.log('data= ', data);
    // io.to(data.id).emit('draw', { data }); to same socket id
    socket.broadcast.emit('draw', data);
  });

  socket.on('user-details', (data) => {
    users.push(data);
    io.sockets.emit('user-details', users);
    // socket.broadcast.emit('user-details', users);
    console.log('users= ', users);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    users = users.filter((user) => user.socketId !== socket.id);
    console.log('users= ', users);
  });
});

server.listen(4444, () => {
  console.log('server started on http://localhost:4444');
});
