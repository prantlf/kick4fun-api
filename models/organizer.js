var mongoose = require('mongoose');
var utils = require('../utils');

const OrganizerSchema = new mongoose.Schema({
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

OrganizerSchema.path('name').validate(function (name, respond) {
    const Organizer = mongoose.model('Organizer');
    if (this.isNew || this.isModified('name')) {
        Organizer.find({name: name}).exec(function (err, organizers) {
            respond(!err && organizers.length == 0);
        });
    } else {
        respond(true);
    }
}, 'Name already exists');

mongoose.model('Organizer', OrganizerSchema);