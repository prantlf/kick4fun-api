var mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    fullName: {
        type: String,
        default: ''
    },
    nickName: {
        type: String,
        default: ''
    },
    organization: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

PlayerSchema
    .path('name')
    .validate(function (name) {
        const player = mongoose.model('Player');
        if (this.isNew || this.isModified('name')) {
            player.find({name: name}).exec(function (err, players) {
                return !err && players.length == 0;
            });
        } else {
            return true;
        }
    }, 'Name already exists');

PlayerSchema
    .pre('save', function (next) {
        if (this.isNew) {
            this.fullName = this.fullName || this.name;
            this.nickName = this.nickName || this.name;
        }
        next();
    });

mongoose.model('Player', PlayerSchema);