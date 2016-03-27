var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    _id: { // automatically created
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        default: ''
    },
    fullName: {
        type: String,
        default: ''
    },
    _organizer: {
        type: String,
        ref: 'Organizer'
    }
}, {
    timestamps: true
});

/*
 * _id validation
 */

PlayerSchema.path('_id').validate(function (_id, respond) {
    respond(!this.isNew || /^[a-zA-Z0-9_]+$/.test(_id));
}, '_id must consist of alpha-numerical characters ans underscore');

PlayerSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

PlayerSchema.path('_id').validate(function (_id, respond) {
    const Organizer = mongoose.model('Organizer');
    if (this.isNew) {
        Organizer.find({_id: _id}).exec(function (error, organizers) {
            respond(error || organizers.length == 0);
        })
    } else {
        respond(true);
    }
}, '_id must be unique');

/*
 * _organizer validation
 */

PlayerSchema.path('_organizer').validate(function (_organizer, respond) {
    respond(this.isNew || !this.isModified('_organizer'));
}, '_organizer cannot be changed');

/*
 * name validation
 */

PlayerSchema.path('name').validate(function (name, respond) {
    respond(!this.isNew || /^[a-zA-Z]+$/.test(name));
}, 'name must consist of alphabetical characters');

PlayerSchema.path('name').validate(function (name, respond) {
    respond(this.isNew || !this.isModified('name'));
}, 'name cannot be changed');

PlayerSchema.path('name').validate(function (name, respond) {
    const Player = mongoose.model('Player');
    if (this.isNew) {
        Player.find({_organizer: this._organizer, name: name}).exec(function (error, players) {
            respond(error || players.length === 0);
        });
    } else {
        respond(true);
    }
}, "name already exists for given organizer");

mongoose.model('Player', PlayerSchema);