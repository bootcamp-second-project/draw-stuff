// import sequelize for use with promises with db
const Sequelize = require('sequelize');

// dotenv file for the secret and credentials
require('dotenv').config();

// declare sequelize for later use
let sequelize;

// if JawsDB is used, use it with sequelize. JawsDB is a MySQL addon to add compatibility with Heroku.
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
  // otherwise, if JawsDB is not used, use the variables defined in .env for sequelize.
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

// export sequelize for connection with the database.
module.exports = sequelize;
