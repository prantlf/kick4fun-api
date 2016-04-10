const _ = require('underscore');
const mongoose = require('mongoose');

const Challenge = mongoose.model('Challenge');
const Match = mongoose.model('Match');
const Standing = mongoose.model('Standing');

exports.create = function (initialData) {
    return new Challenge(initialData);
};

exports.prepare = function (challenge) {
    if (challenge.participants.length < 4) {
        return 'Not enough participants';
    }
};

exports.start = function (challenge) {
    challenge.lineUp.sort(compare);
    setLevels(challenge.lineUp);
    for (var i = 0; i < challenge.lineUp.length; ++i) {
        challenge.lineUp[i].score += challenge.options.basePoints;
        var clone = new Standing({
            player: challenge.lineUp[i].player,
            score: challenge.lineUp[i].score,
            fineScore: challenge.lineUp[i].fineScore,
            level: challenge.lineUp[i].level
        });
        challenge.standings.push(clone);
    }
};

exports.finish = function (challenge) {
    return 'Finish not yet implemented';
};

exports.archive = function (challenge) {
    return 'Archive not yet implemented';
};

exports.addParticipant = function (challenge, name, options) {
    if (challenge.status != 'build' && challenge.status != 'ready' && challenge.status != 'progress') {
        return 'Challenge is not in build or progress status';
    } else {
        challenge.participants.push(name);
        challenge.lineUp.push(new Standing({
            player: name,
            score: options.score || 0,
            fineScore: options.fineScore || (1 - challenge.participants.length / 100)
        }));
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

exports.addMatch = function (challenge, data) {
    if (challenge.status != 'progress') {
        return 'Challenge is not in progress status';
    } else {
        var num = challenge.matches.length + 1;
        var match = new Match({
            number: num,
            date: data.date || Date.Now,
            team1: data.team1,
            team2: data.team2,
            result: data.result
        });
        var error = verify(match);
        if (error) {
            return error;
        }
        challenge.matches.push(match);
        calculateStandings(challenge.standings, match, challenge.options);
        challenge.standings.sort(compare);
        setLevels(challenge.standings);
    }
};

exports.updateMatch = function (challenge, num, data) {
    return 'Updating match not supported by Challenge';
};

exports.deleteMatch = function (challenge, num) {
    if (challenge.status != 'progress') {
        return 'Challenge is not in progress status';
    } else {
        return ('not implemented');
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

function setLevels(standings) {
    var ctr = 0, level = 0;
    while (ctr < standings.length) {
        level += 1;
        ctr += level;
    }
    ctr = 1;
    var countDown = 1;
    for (var i = 0; i < standings.length; ++i) {
        if (countDown == 0) {
            ctr += 1;
            countDown = ctr;
            level -= 1;
        }
        standings[i].level = level;
        countDown--;
    }
}

function calculateStandings(standings, match, options) {
    var winnerLevels = [];
    winnerLevels.push(_.findWhere(standings, {player: match.winners[0]}).level);
    winnerLevels.push(_.findWhere(standings, {player: match.winners[1]}).level);
    var looserLevels = [];
    looserLevels.push(_.findWhere(standings, {player: match.loosers[0]}).level);
    looserLevels.push(_.findWhere(standings, {player: match.loosers[1]}).level);
    var looserLevelAverage = (looserLevels[0] + looserLevels[1]) / 2;
    var winnerSets = _.max(match.sets) || match.sets[0];
    var looserSets = _.min(match.sets) || match.sets[0];
    var winnerGoals = _.max(match.goals) || match.goals[0];
    var looserGoals = _.min(match.goals) || match.goals[0];
    var scoreFraction = 1 - (looserSets / winnerSets);
    for (var i = 0; i < standings.length; i++) {
        if (_.contains(match.winners, standings[i].player)) {
            standings[i].wins += 1;
            standings[i].goalsScored += winnerGoals;
            standings[i].goalsShipped += looserGoals;
            standings[i].score += (looserLevelAverage * scoreFraction + options.matchPoints);
        } else if (_.contains(match.loosers, standings[i].player)) {
            standings[i].losses += 1;
            standings[i].goalsScored += looserGoals;
            standings[i].goalsShipped += winnerGoals;
            standings[i].score -= (standings[i].level * scoreFraction - options.matchPoints);
        }
    }
}

function verify(match) {
    if (match.team1.length != 2 || match.team2.length != 2) {
        return 'Teams must have 2 participants';
    }
}

