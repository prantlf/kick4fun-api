var express = require('express');
var mongoose = require('mongoose');

const Tournament = mongoose.model('Tournament');

var router = express.Router();

router.get('/api/tournaments/:id/participants', function (request, response, next) {
    var id = request.params.id;
    Tournament.findById(id, function (error, tournament) {
        if (error) {
            next(error);
        } else if (tournament == null) {
            next(new Error('Tournament does not exist'));
        } else {
            response.send(tournament.participants);
        }
    });
});

//router.get('api/organizers/:id/tournaments/:name/participants')

//router.put('/api/tournaments/:id/participants')

//router.put('api/organizers/:id/tournaments/:name/participants')

//router.delete('api/tournaments/:id/participants/:name')

//router.delete('api/organizers/:id/tournaments/:tname/participants/:pname')

module.exports = router;
