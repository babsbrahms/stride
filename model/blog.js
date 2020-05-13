const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var blog = new Schema({
    title: { type: String },
    poster: { type: String },
    author: { type: String },
    category: { type: String, index: true },
    date: {  type: Date },
    body: { type: String },
    tags: { type: Array }
}, { timestamps: true })
blog.index({ title: 'text', tags: 'text'})

module.exports = mongoose.model('Blog', blog)

