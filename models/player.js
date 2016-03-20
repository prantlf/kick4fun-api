var mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        default: ''
    },
    nickName: {
        type: String,
        default: ''
    },
    organizer: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

PlayerSchema.path('name').validate(function (name, respond) {
    const Player = mongoose.model('Player');
    if (this.isNew || this.isModified('name')) {
        Player.find({name: name}).exec(function (err, players) {
            respond(!err && players.length == 0);
        });
    } else {
        respond(true);
    }
}, 'Name already exists');

mongoose.model('Player', PlayerSchema);