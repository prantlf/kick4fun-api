var mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    id: {type: Number, min: 1},
    date: {type: Date},
    team1: [{type: String, notEmpty: true, check: {minLength: 1, maxLength: 2}}],
    team2: [{type: String, notEmpty: true, check: {minLength: 1, maxLength: 2}}],
    result: [Number]
});

MatchSchema
    .path('result').validate(function (result) {
        if (result.length % 2 !== 0) {
            return false;
        }
        for (i = 0; i < result.length; i += 2) {
            if (result[i] === result[i + 1]) {
                return false;
            }
        }
        return true;
    }, 'Result is inconsistent')

    .virtual('sets').get(function () {
        var s1 = 0, s2 = 0;
        for (i = 0; i < this.result.length; i += 2) {
            if (this.result[i] > this.result[i + 1]) {
                s1++;
            } else if (this.result[i] < this.result[i + 1]) {
                s2++;
            }
        }
        return [s1, s2];
    })

    .virtual('goals').get(function () {
        var g1 = 0, g2 = 0;
        for (i = 0; i < this.result.length; i += 2) {
            g1 += result[i];
            g2 += result[i + 1];
        }
        return [g1, g2];
    })
;

mongoose.model('Match', MatchSchema);