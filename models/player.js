var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
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
    },
    _tournaments: [{
        type: String,
        ref: 'Tournament'
    }]
}, {
    timestamps: true
});

PlayerSchema.path('_id').validate(function (_id, respond) {
    respond(this.isNew || !this.isModified('_id'));
}, '_id cannot be changed');

mongoose.model('Player', PlayerSchema);