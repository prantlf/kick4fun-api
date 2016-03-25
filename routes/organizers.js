var express = require('express');
var mongoose = require('mongoose');

const Organizer = mongoose.model('Organizer');

var router = express.Router();

router.get('/api/organizers', function (request, response, next) {
    Organizer.find(function (error, organizers) {
        if (!error) {
            response.send(organizers);
        } else {
            next(new Error(error));
        }
    });
});

router.post('/api/organizers', function (request, response, next) {
    var data = request.body;
    var organizer = new Organizer({
        _id: data.name || '',
        longName: data.longName || '',
        description: data.description || '',
        adminUser: data.adminUser || '',
        adminPassword: data.adminPassword || ''
    });
    organizer.save(function (error, organizer) {
        if (error) {
            response.send(error);
        } else {
            response.send(organizer);
        }
    });
});

router.put('/api/organizers/:id', function (request, response, next) {
    var id = request.params.id;
    var data = request.body;
    Organizer.findById(id, function (err, organizer) {
        organizer._id = data.name || organizer.id;
        organizer.longName = data.longName || organizer.longName;
        organizer.description = data.description || organizer.description;
        organizer.adminUser = data.adminUser || organizer.adminUser;
        organizer.adminPassword = data.adminPassword || organizer.adminPassword;
        organizer.save(function (error, organizer) {
            if (error) {
                next(new Error(error));
            } else {
                response.send(organizer);
            }
        });
    });
});

router.delete('/api/organizers/:id', function (request, response, next) {
    var id = request.params.id;
    Organizer.findOneAndRemove({'_id': id}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
    })
});

module.exports = router;
