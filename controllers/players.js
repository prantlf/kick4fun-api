const mongoose = require('mongoose');

const Organizer = mongoose.model('Organizer');
const Player = mongoose.model('Player');

exports.listAll = function (request, response, next) {
    Player.find(function (error, players) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(players);
        }
    });
};

exports.list = function (request, response, next) {
    var organizerId = request.params.id;
    Player.find({_organizer: organizerId}, function (error, players) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(players);
        }
    });
};

exports.create = function (request, response, next) {
    var data = request.body;
    var organizerId = request.params.id;
    Organizer.findOne({_id: organizerId}, function (error, organizer) {
        if (error) {
            next(error);
        } else if (organizer == null) {
            next({message: "Organizer does not exist", status: 400});
        } else {
            var player = new Player({
                _id: organizerId + '_' + data.name,
                name: data.name,
                fullName: data.fullName || '',
                nickName: data.nickName || '',
                _organizer: organizerId
            });
            player.save(function (error, player) {
                if (error) {
                    next(new Error(error));
                } else {
                    response.send(player);
                }
            });
        }
    });
};

exports.update = function (request, response, next) {
    var organizerId = request.params.id;
    var playerName = request.params.name;
    var data = request.body;
    Player.findOne({'_organizer': organizerId, 'name': playerName}, function (error, player) {
        player.name = data.name || player.name;
        player.nickName = data.nickName || player.nickName;
        player.fullName = data.fullName || player.fullName;
        player.save(function (error, player) {
            if (error) {
                next(new Error(error));
            } else {
                response.send(player);
            }
        });
    });
};

exports.delete = function (request, response, next) {
    var organizerId = request.params.id;
    var playerName = request.params.name;
    Player.findOneAndRemove({'_organizer': organizerId, 'name': playerName}, function (error, model) {
        if (error) {
            next(new Error(error));
        } else if (!model) {
            next({message: 'Player does not exist', status: 400});
        } else {
            response.sendStatus(204);
        }
    })
};