const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const Player = mongoose.model('Player');

const MatchSchema = new Schema({
    number: { // assigned automatically
        type: Number,
        min: 1,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    team1: [{
        type: String,
        ref: Player
    }],
    team2: [{
        type: String,
        ref: Player
    }],
    result: [
        Number
    ]
}, {
    _id: false
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

MatchSchema.path('team1').validate(function (result, respond) {
    respond(team1.length >= 0 && team1.length <= 2);
}, 'Team1 is inconsistent');

MatchSchema.path('team2').validate(function (result, respond) {
    respond(team2.length >= 0 && team2.length <= 2);
}, 'Team2 is inconsistent');

MatchSchema.virtual('matches').get(function(){
    return this.result.length / 2;
});

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
        g1 += this.result[i];
        g2 += this.result[i + 1];
    }
    return [g1, g2];
});

MatchSchema.virtual('winners').get(function() {
    var sets = this.sets;
    if (sets[0] > sets[1]) {
        return this.team1;
    } else if (sets[0] < sets[1]) {
        return this.team2;
    } else {
        return [];
    }
});

MatchSchema.virtual('loosers').get(function() {
    var sets = this.sets;
    if (sets[0] < sets[1]) {
        return this.team1;
    } else if (sets[0] > sets[1]) {
        return this.team2;
    } else {
        return [];
    }
});

mongoose.model('Match', MatchSchema);