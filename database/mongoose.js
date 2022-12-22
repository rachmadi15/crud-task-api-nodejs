const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.set("strictQuery", true);

mongoose.connect('mongodb://127.0.0.1:27017/taskmanager').then(() => {
    console.log('DB Connected Succesfully');
}).catch((err) => {
    console.log(err);
});

module.exports = mongoose;