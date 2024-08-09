const mongoose = require('mongoose')
async function connectMongoDb(url) {
    const options = {
        connectTimeoutMS: 10 * 60 * 1000,
      };
      return mongoose.connect(url, options);
}

module.exports = {
    connectMongoDb,
}

