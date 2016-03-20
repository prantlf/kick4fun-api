var express = require('express');
var mongoose = require('mongoose');

const Organization = mongoose.model('Organization');

var router = express.Router();

router.get('/', function (req, res, next) {
    Organization.find(function (err, organizations) {
        if (!err) {
            res.send(organizations);
        } else {
            next(new Error(err));
        }
    });
});

router.post('/', function (reg, res, next) {
    var organization = reg.body;
    var newOrganization = new Organization({
        name: organization.name,
        description: organization.description || '',
        adminUser: organization.adminUser || '',
        adminPassword: organization.adminPassword
    });
    newOrganization.save(function (err, organization) {
        if (err) {
            res.send(err);
        } else {
            res.send('ok');
        }
    });
});

module.exports = router;
