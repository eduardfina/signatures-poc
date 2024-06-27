const mongoose = require('mongoose');


// define the schema for our user model
const Schema = mongoose.Schema(
    {   
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        hash: {type: String, unique: true},
        blockchain: String,
        contractAddress: String,
        senderAddress: String,
        codifier: String,
        decodifier: String
    }
);


// create the model for signatures and expose it to our app
module.exports = mongoose.model('Signature', Schema);