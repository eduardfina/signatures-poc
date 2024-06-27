const mongoose = require('mongoose');


// define the schema for our user model
const Schema = mongoose.Schema(
    {   
        app: {type: mongoose.Schema.Types.ObjectId, ref: 'App'},
        id: String,
        name: String,
        surname: String,
    }
);


// create the model for users and expose it to our app
module.exports = mongoose.model('User', Schema);