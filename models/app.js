const mongoose = require('mongoose');


// define the schema for our user model
const Schema = mongoose.Schema(
    {   
        name: {type: String, unique: true},
    }
);


// create the model for applications and expose it to our app
module.exports = mongoose.model('App', Schema);