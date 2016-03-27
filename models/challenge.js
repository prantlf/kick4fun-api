var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const Tournament = mongoose.model('Tournament');

const ChallengeStandingSchema = new Schema({
    player: {
        type: String,
        ref: 'Player'
    },
    score: {
        type: Number,
        required: true
    },
    fineScore: {
        type: Number,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    numMatches: {
        type: Number,
        required: true
    }
});

var ChallengeSchema = new Schema({
    _id: { // automatically created
        type: String,
        required: true
    },
    options: {
        matchPoints: {
            type: Number,
            required: true,
            default: 1
        },
        winPoints: {
            type: String,
            enum: ['opponent', 'difference'],
            default: 'opponent'
        },
        lossPoints: {
            type: String,
            enum: ['own', 'difference'],
            default: 'own'
        }
    },
    lineUp: [
        ChallengeStandingSchema
    ],
    /*matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }],*/
    standings: [
        ChallengeStandingSchema
    ]
}, {
    discriminatorKey: 'kind'
});

/*
 * _id validation
 */

ChallengeSchema.path('_id').validate(function (_id, respond) {
    respond(!this.isNew || /^[a-zA-Z0-9_]+$/.test(_id));
}, '_id must consist of alpha-numerical characters and _');

ChallengeSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

ChallengeSchema.path('_id').validate(function (_id, respond) {
    const Organizer = mongoose.model('Organizer');
    if (this.isNew) {
        Organizer.find({_id: _id}).exec(function (error, organizers) {
            respond(!error && organizers.length == 0);
        })
    } else {
        respond(true);
    }
}, '_id must be unique');

Tournament.discriminator('Challenge', ChallengeSchema);