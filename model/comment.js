const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var comment = new Schema({
    comment: { type: String },
    name: { type: String },
    email: { type: String },
    website: { type: String },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' }
}, { timestamps: true })

module.exports = mongoose.model('Comment', comment)