const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var blog = new Schema({
    title: { type: String },
    poster: { type: String },
    category: { type: String, index: true },
    date: {  type: String },
    content: { type: String },
    tags: { type: Array }
})
blog.index({ title: 'text', tags: 'text'})

module.exports = mongoose.model('Blog', blog)

