var express = require('express');
var mongoose = require('mongoose');

const Organizer = mongoose.model('Organizer');

var router = express.Router();

router.get('/', function (request, response, next) {
    Organizer.find(function (err, organizers) {
        if (!err) {
            response.send(organizers);
        } else {
            next(new Error(err));
        }
    });
});

router.post('/', function (request, response, next) {
    var organizer = request.body;
    var newOrganizer = new Organizer({
        name: organizer.name,
        description: organizer.description || '',
        adminUser: organizer.adminUser || '',
        adminPassword: organizer.adminPassword
    });
    newOrganizer.save(function (err, organizer) {
        if (err) {
            response.send(err);
        } else {
            response.send(organizer);
        }
    });
});

module.exports = router;
