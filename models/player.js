var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const PlayerSchema = new Schema({
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

PlayerSchema.path('name').validate(function (name, respond) {
    respond(this.isNew || !this.isModified('name'));
}, 'name cannot be changed');

PlayerSchema.path('name').validate(function (name, respond) {
    const Player = mongoose.model('Player');
    Player.find({_organizer: this._organizer}).exec(function (error, players) {
        if (error) {
            respond(false);
        } else {
            for (var i = 0; i < players.length; i++) {
                if (players[i].name === name) {
                    respond(false);
                }
            }
            respond(true);
        }
    })
}, "name must be unique within the organization");

mongoose.model('Player', PlayerSchema);