const express = require('express');
const path = require('path');
const sequelize = require('./config/connection');
const routes = require('./controllers/');
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const secret = process.env.SECRET;

const app = express();
// add websocket connection
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const sess = {
  secret: secret,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// middleware for JSON and things
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// takes all static content and serves as assets
app.use(express.static(path.join(__dirname, './public')));

// play game happens on the socket in a room
app.get('/play/:id', (req, res) => {
  console.log(`game and room id: ${req.params.id}`);
  io.on('connection', (socket) => {

    console.log('Client connected on socket: ' + socket.id)
    // after client connects, join a room 
    console.log(`playing in room: ${req.params.id}`);
    
    socket.join(`room_${req.params.id}`);

    socket.on('mouse', (data) => {
      // console.log(data)
      socket.broadcast.to(`room_${req.params.id}`).emit('draw', data)
    });
    
    socket.on('disconnect', () => console.log('Client has disconnected'))
  })
  res.sendFile(path.join(__dirname + '/public/play.html'));
})

// turn on routing from the controllers index
app.use(routes);

sequelize.sync({ force: true }).then(() => {
  server.listen(PORT, () => {console.log(`server and sequelize listening on ${PORT}`)});
})

// sequelize.sync({ force: true }).then(() => {
//   app.listen(PORT, () => {console.log('sequelize now listening.')});
// })