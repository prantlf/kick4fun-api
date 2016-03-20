var mongoose = require('mongoose');

const MatchDaySchema = new mongoose.Schema({
    number: {
        type: Number,
        min: 1
    },
    tournament: {
        type: String,
        required: true
    },
    matches: [{
        type: Number
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

mongoose.model('MatchDay', MatchDaySchema);