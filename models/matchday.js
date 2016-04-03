const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const MatchSchema = require('./match');

const MatchDaySchema = new Schema({
    number: { // assigned automatically
        type: Number,
        min: 1,
        required: true
    },
    matches: [
        MatchSchema
    ],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    _id: false
});
