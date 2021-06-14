const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const sequelize = require('./config/connection');
const routes = require('./controllers/');
const PORT = process.env.PORT || 3001;
const session = require('express-session');
const { response } = require('express');
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

// set up handlebars as the views engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// use sessions
app.use(session(sess));

// middleware for JSON and things
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// takes all static content and serves as assets
app.use(express.static(path.join(__dirname, './public')));

io.of("/").adapter.on("join-room", (room, id) => {
  // console.log(`socket ${id} has joined room ${room}`);
});



io.on('connection', (socket) => {
  // console.log('Client connected on socket: ' + socket.id)
  // after client connects, sends join a room msg :)
  socket.on('join', (id) => {
    socket.join(id);
    console.log('now playing in room: ' + id);
    // socket gets draw datas to emit to other clients
    socket.on('mouse', (data) => {
      socket.to(id).emit('draw', data)
    });
  });


  socket.on('disconnect', () => console.log('Client has disconnected'))
})

// turn on routing from the controllers index
app.use(routes);


sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => { console.log('sequelize now listening.') });
})
