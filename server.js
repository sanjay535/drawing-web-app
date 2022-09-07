const express = require('express');
const http = require('http'); //provide by node
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketio(server); //it enable socket for server as well as for client

app.use('/', express.static(__dirname + '/public'));

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
});

server.listen(4444, () => {
  console.log('server started on http://localhost:4444');
});
