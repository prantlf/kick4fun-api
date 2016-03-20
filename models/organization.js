var mongoose = require('mongoose');
var utils = require('../utils/utils');

const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    adminUser: {
        type: String,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

OrganizationSchema.path('name').validate(function (name, respond) {
    const Organization = mongoose.model('Organization');
    if (this.isNew || this.isModified('name')) {
        Organization.find({name: name}).exec(function (err, organizations) {
            respond(!err && organizations.length == 0);
        });
    } else {
        respond(true);
    }
}, 'Name already exists');

mongoose.model('Organization', OrganizationSchema);