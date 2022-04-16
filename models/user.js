const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        max: 255,
        unique: true 
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    perm: {
        type: Number,
        default:1,
        min: 1,
        max: 3
    },
});

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema);