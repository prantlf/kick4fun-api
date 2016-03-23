var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const OrganizerSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    adminUser: {
        type: String
        //required: true
    },
    adminPassword: {
        type: String
        //required: true
    }
}, {
    timestamps: true
});

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

OrganizerSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

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