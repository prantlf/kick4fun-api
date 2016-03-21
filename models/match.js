var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const TeamSchema = new Schema([{
    type: String,
    ref: 'Player',
    check: {
        minLength: 1,
        maxLength: 2
    }
}]);

const MatchSchema = new Schema({
    number: {
        type: Number,
        min: 1
    },
    _tournament: {
        type: String,
        ref: 'Tournament'
    },
    date: {
        type: Date,
        default: Date.now
    },
    _team1: {
        type: TeamSchema,
        required: true
    },
    _team2: {
        type: TeamSchema,
        required: true
    },
    result: [Number]
});

MatchSchema.path('result').validate(function (result, respond) {
    if (result.length % 2 !== 0) {
        respond(false);
    }
    var i;
    for (i = 0; i < result.length; i += 2) {
        if (result[i] === result[i + 1]) {
            respond(false);
        }
    }
    respond(true);
}, 'Result is inconsistent');

MatchSchema.virtual('sets').get(function () {
    var s1 = 0, s2 = 0, i;
    for (i = 0; i < this.result.length; i += 2) {
        if (this.result[i] > this.result[i + 1]) {
            s1++;
        } else if (this.result[i] < this.result[i + 1]) {
            s2++;
        }
    }
    return [s1, s2];
});

MatchSchema.virtual('goals').get(function () {
    var g1 = 0, g2 = 0, i;
    for (i = 0; i < this.result.length; i += 2) {
        g1 += result[i];
        g2 += result[i + 1];
    }
    return [g1, g2];
});

mongoose.model('Match', MatchSchema);