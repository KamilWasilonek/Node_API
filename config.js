const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.PORT,
  MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD,
  JWT_KEY: process.env.JWT_KEY
};