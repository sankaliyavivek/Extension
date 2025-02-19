const mongooes = require('mongoose');
require("dotenv").config();

mongooes.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected!'));

module.exports = mongooes.connect;