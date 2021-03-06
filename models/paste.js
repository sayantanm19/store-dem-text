var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var pasteSchema = new Schema({
    idx: String,
    paste: String,
    title: String,
    expirationDate: {
        type: Date,
        expires: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('paste', pasteSchema);