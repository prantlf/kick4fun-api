var express = require('express');
var mongoose = require('mongoose');

const Organizer = mongoose.model('Organizer');

var router = express.Router();

router.get('/api/organizers', function (request, response, next) {
    Organizer.find(function (err, organizers) {
        if (!err) {
            response.send(organizers);
        } else {
            next(new Error(err));
        }
    });
});

router.post('/api/organizers', function (request, response, next) {
    var organizer = request.body;
    var newOrganizer = new Organizer({
        _id: organizer.id,
        name: organizer.name,
        description: organizer.description || '',
        adminUser: organizer.adminUser || '',
        adminPassword: organizer.adminPassword || ''
    });
    newOrganizer.save(function (err, organizer) {
        if (err) {
            response.send(err);
        } else {
            response.send(organizer);
        }
    });
});

router.put('/api/organizers/:id', function (request, response, next) {
    var id = request.params.id;
    Organizer.findOneAndUpdate({'_id': id}, request.body, {upsert: true}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send('ok');
        }
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
