const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

var Schema = mongoose.Schema;

var user = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, min: 5 }
})

user.methods.hashPassword = (password) => {
    var salt = bcrypt.genSaltSync(10);

    this.password = bcrypt.hashSync(password, salt);
}

user.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('Users', user)