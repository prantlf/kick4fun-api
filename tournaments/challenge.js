const mongoose = require('mongoose');
const Challenge = mongoose.model('Challenge');

exports.create = function (initialData) {
    return new Challenge(initialData);
};

exports.addParticipant = function (challenge, name, options) {
    if (challenge.status != 'build' && challenge.status != 'ready' && challenge.status != 'progress') {
        return 'Challenge is not in build or progress status';
    } else {
        challenge.participants.push(name);
        challenge.lineUp.push({
            player: name,
            score: options.score || 0,
            fineScore: options.fineScore || (1 - challenge.participants.length / 100)
        });
    }
};

exports.removeParticipant = function (challenge, name) {
    if (challenge.status != 'build') {
        return 'Challenge is not in build status';
    } else {
        challenge.participants.remove(name);
        for (var i = 0; i < challenge.lineUp.length; ++i) {
            if (challenge.lineUp[i].player == name) {
                challenge.lineUp.splice(i, 1);
                break;
            }
        }
    }
};

exports.prepare = function (challenge) {
    challenge.lineUp.sort(compare);
    var ctr = 0, levels = 0;
    while (ctr < challenge.participants.length) {
        levels += 1;
        ctr += levels;
    }
    ctr = 1;
    var countDown = 1;
    for (var i = 0; i < challenge.lineUp.length; ++i) {
        if (countDown == 0) {
            ctr += 1;
            countDown = ctr;
            levels -= 1;
        }
        challenge.lineUp[i].level = levels;
        countDown--;
    }
};

exports.start = function (challenge) {
    for (var i = 0; i < challenge.lineUp.length; ++i) {
        challenge.lineUp[i].score += challenge.options.basePoints;
        var clone = {};
        clone.player = challenge.lineUp[i].player;
        clone.score = challenge.lineUp[i].score;
        clone.fineScore = challenge.lineUp[i].fineScore;
        clone.level = challenge.lineUp[i].level;
        clone.numMatches = challenge.lineUp[i].numMatches;
        challenge.standings.push(clone);
    }
};

exports.addMatch = function(challenge, match) {
    if (challenge.status != 'progress') {
        return 'Challenge is not in progress status';
    } else {
        
    }
};

function compare(a, b) {
    if (a.score < b.score) {
        return 1;
    } else if (a.score > b.score) {
        return -1;
    } else if (a.fineScore < b.fineScore) {
        return 1;
    } else if (a.fineScore > b.fineScore) {
        return -1;
    } else if (a.player > b.player) {
        return 1;
    } else {
        return -1;
    }
}