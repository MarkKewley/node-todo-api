const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

mongoose.Promise = global.Promise;
mongoose.connect(`${mongoUri}/TodoApp`);

module.exports = mongoose;