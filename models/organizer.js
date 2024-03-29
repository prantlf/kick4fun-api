const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const OrganizerSchema = new Schema({
    _id: { // unique, to be set by user
        type: String,
        required: true
    },
    longName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

/*
 * _id validation 
 */

OrganizerSchema.path('_id').validate(function (_id, respond) {
    respond(!this.isNew || /^[a-zA-Z0-9]+$/.test(_id));
}, '_id must consist of alpha-numerical characters');

OrganizerSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

OrganizerSchema.path('_id').validate(function (_id, respond) {
    const Organizer = mongoose.model('Organizer');
    if (this.isNew) {
        Organizer.find({_id: _id}).exec(function (error, organizers) {
            respond(!error && organizers.length == 0);
        })
    } else {
        respond(true);
    }
}, '_id must be unique');

/*
 * longName validation
 */

OrganizerSchema.path('longName').validate(function (longName, respond) {
    const Organizer = mongoose.model('Organizer');
    if (this.isNew || this.isModified('longName')) {
        Organizer.find({longName: longName}).exec(function (err, organizers) {
            respond(!err && organizers.length == 0);
        });
    } else {
        respond(true);
    }
}, 'longName already exists');

mongoose.model('Organizer', OrganizerSchema);