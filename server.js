const express = require('express');
const path = require('path');

const sequelize = require('./config/connection');

const PORT = process.env.PORT || 3001;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const secret = process.env.SECRET

const app = express();

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

io.sockets.on('connection', (socket) => {
	console.log('Client connected: ' + socket.id)
	socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))
	socket.on('disconnect', () => console.log('Client has disconnected'))
})

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {console.log('sequelize now listening.')});
})

