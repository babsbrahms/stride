const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var newsletter = new Schema({
    email: { type: String, required: true },
    name: { type: String }
})

module.exports = mongoose.model('Newsletter', newsletter)