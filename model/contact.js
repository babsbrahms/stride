const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contact = new Schema({
    sender_name: { type: String, required: true },
    sender_email: { type: String },
    subject: { type: String },
    message: { type: String }
})

module.exports = mongoose.model('Contact', contact)