var mongoose = require('mongoose');
var utils = require('../utils/utils');

const OrganizationSchema = new mongoose.Schema({
    uniqueId: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    adminUser: {
        type: String,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    }
});

OrganizationSchema

    .path('uniqueId')
    .validate(function (uniqueId) {
        return this.uniqueId != uniqueId;
    })

    .pre('save', function (next) {
        if (this.isNew) {
            this.uniqueId = utils.guid();
        }
        next();
    })
;

mongoose.model('Organization', OrganizationSchema);