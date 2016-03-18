var mongoose = require('mongoose');
var utils = require('../utils/utils');

const TournamentSchema = new mongoose.Schema({
    type: {type: String, default:'league', enum:['league', 'challenge']},
    id: {type: String, default: ''},
    description: {type: String, default: ''},
    organization: {type: String, default: ''},
    status: {type: String, default: 'planned', enum: ['planned', 'progress', 'completed']},
    participants: [String]
});

TournamentSchema
    .path('description').required(true, 'Description must be set.')

    .pre('save', function (next) {
        this.id = utils.guid();
    })
;

mongoose.model('Tournament', TournamentSchema);