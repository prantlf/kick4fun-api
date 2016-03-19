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
});

PlayerSchema

    .path('name')
    .validate(function (name, fn) {
        const player = mongoose.model('Player');
        // Check only when it is a new player or when name is modified
        if (this.isNew || this.isModified('name')) {
            player.find({name: name}).exec(function (err, players) {
                fn(!err && players.length === 0);
            });
        } else fn(true);
    }, 'Name already exists')

    .pre('save', function (next) {
        this.fullName = this.fullName || this.name;
        this.nickName = this.nickName || this.name;
        next();
    })

;

mongoose.model('Player', PlayerSchema);