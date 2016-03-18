var mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: {type: String, default: ''},
    fullname: {type: String, default: ''},
    nickname: {type: String, default: ''},
    organization: {type: String, default: ''}
});

PlayerSchema.path('name').validate(function (name, fn) {
    const player = mongoose.model('Player');
    // Check only when it is a new player or when name is modified
    if (this.isNew || this.isModified('name')) {
        player.find({ name: name }).exec(function (err, players) {
            fn(!err && players.length === 0);
        });
    } else fn(true);
}, 'Name already exists');

mongoose.model('Player', PlayerSchema);