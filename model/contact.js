const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contact = new Schema({
    name: { type: String, required: true },
    email: { type: String },
    subject: { type: String },
    message: { type: String }
})

module.exports = mongoose.model('Contact', contact)