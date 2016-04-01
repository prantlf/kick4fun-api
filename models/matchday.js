const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const MatchDaySchema = new Schema({
    number: {
        type: Number,
        min: 1,
        required: true
    },
    _tournament: {
        type: String,
        ref: 'Tournament',
        required: true
    },
    _matches: [{
        type: Schema.Types.ObjectId,
        ref: ['Match'],
        required: true
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