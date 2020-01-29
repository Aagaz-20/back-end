const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String
    },
    firstName : {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    accomodation: {
        type: String,
        default: 'no'
    },
    payment: {
        type: Boolean,
        default: false
    },
    gender:{
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    collegeName: {
        type: String,
        default: 'HBTU'
    },
    clientSecret: {
        type: String,
        default: null
    }

})

module.exports = mongoose.model('User', userSchema);