const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');

const sequelize = require('./config/connection');

const PORT = process.env.PORT || 3001;
const session = require('express-session');
const { response } = require('express');
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

// set up handlebars as the views engine
app.set('view engine', 'handlebars');

// config handlebars to recognize the views folder and other paths
app.engine('handlebars', handlebars({
layoutsDir: __dirname + '/views/layouts',
}));

// set up the body of the page and serve it to index.handlebars
app.get('/', (req, res) => {
  res.render('main', {layout: 'index'});
});

app.use(session(sess));

// middleware for JSON and things
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// takes all static content and serves as assets
app.use(express.static(path.join(__dirname, './public')));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {console.log('sequelize now listening.')});
})