const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const events = new Schema({
    eventName: {
        type: Array
    }, 
    eventType:{
        type: Array
    },
    eventDescription:{
        type: Array
    },
    eventDetails: {
        type: Array
    },
    eventCoordinators: {
        type: Array
    },
    eventRules: {
        type: Array
    }
});

module.exports = mongoose.model('Events', events);