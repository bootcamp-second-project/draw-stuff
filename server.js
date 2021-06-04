const express = require('express');
const path = require('path');

const controllers = require('./controllers/index');

const sequelize = require('./config/connection');
const routes = require('./controllers/');
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

// turn on routing from the controllers index
app.use(routes);


sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {console.log('sequelize now listening.')});
})