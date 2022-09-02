const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Seth:MongoAtlas69@cluster0.le8hgg9.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
})
    .then(db => console.log('Db is connected'))
    .catch(err => console.log(err));