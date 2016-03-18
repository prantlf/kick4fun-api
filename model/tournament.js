var mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    name: {type: String, default: ''},
    fullname: {type: String, default: ''},
    organization: {type: String, default: ''},
    status: {type: String, default: 'planned', enum: ['planned', 'progress', 'completed']},
    participants: [String]
});

TournamentSchema.path('name').validate(function (name, fn) {
    const tournament = mongoose.model('Tournament');
    // Check only when it is a new tournament or when name is modified
    if (this.isNew || this.isModified('name')) {
        tournament.find({ name: name }).exec(function (err, tournaments) {
            fn(!err && tournaments.length === 0);
        });
    } else fn(true);
}, 'Name already exists');

mongoose.model('Tournament', TournamentSchema);