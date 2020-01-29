const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventRegistrationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type:String
    },
    phone: {
        type: String
    },
    collegeName: {
        type: String
    },
    teamName: {
        type: String
    },
    members:{
        type: Array
    },
    eventName:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);