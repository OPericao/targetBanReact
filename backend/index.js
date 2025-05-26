import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let rooms = {};
let timers = {};

const TURN_DURATION = 45000;

const turnOrder = ['blueban', 'redban', 'blueban', 'redban', 'blueban', 'redban', 'blue', 'red',
                    'red', 'blue', 'blue', 'red', 'redban', 'blueban', 'redban', 'blueban', 'red', 'blue', 'blue', 'red'];

const pickOrder = ['red0', 'red1', 'blue1', 'blue2', 'red2', 'red3', 'blue3', 'blue4', 'red4', 'control'];

function startTurnTimer(roomId) {
  if (timers[roomId]) {
    clearTimeout(timers[roomId].timeout);
    clearInterval(timers[roomId].interval);
  }

  const startTime = Date.now();
  const endTime = startTime + TURN_DURATION;

  const timeout = setTimeout(() => {
    const room = rooms[roomId];
    if (!room) return;

    const currentTurn = room.turnOrder[room.pickIndex];
    let user;
    if(currentTurn.includes('blue')){
      user = 'blue';
    }
    else{
      user = 'red';
    }
    
    io.to(room[user].player[0]).emit('turnTimeout', { turn: currentTurn, user });

    if (room.pickIndex >= room.turnOrder.length) {
      io.to(roomId).emit('draftFinished');
      delete rooms[roomId];
      clearInterval(timers[roomId].interval);
      delete timers[roomId];
    }
  }, TURN_DURATION);

  const interval = setInterval(() => {
    const remaining = Math.max(0, endTime - Date.now());
    io.to(roomId).emit('remainingTime', Math.floor(remaining / 1000));
  }, 1000);

  timers[roomId] = { timeout, interval };
}

io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);

  socket.on('pickChampion', async ({ user, champion, roomId }) => {
    const room = rooms[roomId];

    room.pickIndex++;

    io.to(roomId).emit('championPicked', { user, champion, pickingIndex: pickOrder[room.pickOrderIndex] });

    room.pickOrderIndex++;

    if (room.pickIndex < room.turnOrder.length) {
        io.to(roomId).emit('turnChanged', room.turnOrder[room.pickIndex]);
        startTurnTimer(roomId);
    } else {
        io.to(roomId).emit('draftFinished');
        clearTimeout(timers[roomId]);
        delete rooms[roomId];
        delete timers[roomId];
    }
  });

  socket.on('banChampion', ({ user, champion, roomId }) => {
    const room = rooms[roomId];

    room.pickIndex++;

    io.to(roomId).emit('championBanned', { user, champion });

    if (room.pickIndex < room.turnOrder.length) {
      io.to(roomId).emit('turnChanged', room.turnOrder[room.pickIndex]);
      startTurnTimer(roomId);
    } else {
      io.to(roomId).emit('draftFinished');
    }
  });

  socket.on('hoverChampion', async ({ champion, roomId }) => {
    io.to(roomId).emit('championHovered', champion );
  });

  socket.on('joinRoom', ({ roomId, team }) => {
    let room = rooms[roomId];

    if (!room) {
      rooms[roomId] = room = {
        blue: { player: [], ready: false }, 
        red: { player: [], ready: false }, 
        pickIndex: 0,
        pickOrderIndex: 0,
        turnOrder
      };
    }

    if (team == 'blue') {
      room.blue.player[0] = socket.id;
    } else if (team == 'red') {
      room.red.player[0] = socket.id;
    }

    socket.join(roomId);
    room[team].player.push(socket.id);

    const draftStarted = room.blue.ready && room.red.ready;
    socket.emit('renewInfo', { draftStarted, side: room.turnOrder[room.pickIndex]});
  });

  socket.on('playerReady', ({ roomId, team }) => {
    const room = rooms[roomId];
    room[team].ready = true;

    if (room.blue.ready && room.red.ready) {
      io.to(roomId).emit('startDraft');
      startTurnTimer(roomId);
    }
  });

  socket.on('updateStatus', (roomId) => {
    const room = rooms[roomId];
    let blueFull;
    let redFull;

    if(!room){
      blueFull = false;
      redFull = false;
    }
    else {
      blueFull = room.blue.player.length >= 1;
      redFull = room.red.player.length >= 1;
    }

    socket.emit('updatedStatus', ({ blue: blueFull, red: redFull }))
  });

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Servidor Socket.IO funcionando.');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Servidor escoitando en http://localhost:${PORT}`);
});
