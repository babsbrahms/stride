const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var category = new Schema({
    name: { type: String, required: true },
    blogs: { type: Number, default: 0}
})

module.exports = mongoose.model('Category', category)