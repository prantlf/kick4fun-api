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
        _id: organizer.name,
        longName: organizer.longName,
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
    var organizer = request.body;
    Organizer.findById(id, function(err, updatedOrganizer){
        updatedOrganizer.longName = organizer.longName;
        updatedOrganizer.save(function (error, organizer) {
            if (error) {
                next(new Error(error));
            } else {
                response.send(organizer);
            }
        });
    });
    /*
    var updatedOrganizer = new Organizer({
        _id: organizer.name,
        longName: organizer.longName,
        description: organizer.description || '',
        adminUser: organizer.adminUser || '',
        adminPassword: organizer.adminPassword || ''
    });
    updatedOrganizer.save(function (error, organizer) {
    */
    //Organizer.update({_id: id}, organizer/*, {runValidators: true}*/, function(error) {
    /*Organizer.findOneAndUpdate({'_id': id}, organizer, {upsert: true}, function (error) {
        if (error) {
            next(new Error(error));
        } else {
            response.send(organizer);
        }
    });*/
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
