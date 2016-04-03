const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'kick4fun'});
});

const organizers = require('./controllers/organizers');
const players = require('./controllers/players');
const tournaments = require('./controllers/tournaments');
const participants = require('./controllers/participants');
const matches = require('./controllers/matches');

router.get('/api/organizers', organizers.list);
router.post('/api/organizers', organizers.create);
router.put('/api/organizers/:id', organizers.update);
router.delete('/api/organizers/:id', organizers.delete);

router.get('/api/players', players.listAll);
router.get('/api/organizers/:id/players', players.list);
router.post('/api/organizers/:id/players', players.create);
router.put('/api/organizers/:id/players/:name', players.update);
router.delete('/api/organizers/:id/players/:name', players.delete);

router.get('/api/tournaments', tournaments.listAll);
router.get('/api/organizers/:id/tournaments', tournaments.list);
router.post('/api/organizers/:id/tournaments', tournaments.create);
router.put('/api/organizers/:id/tournaments/:name', tournaments.update);
router.delete('/api/organizers/:id/tournaments/:name', tournaments.delete);

router.put('/api/organizers/:id/tournaments/:name/prepare', tournaments.prepare);
router.put('/api/organizers/:id/tournaments/:name/start', tournaments.start);

router.get('/api/organizers/:id/tournaments/:name/participants', participants.list);
router.post('/api/organizers/:id/tournaments/:name/participants', participants.add);
router.delete('/api/organizers/:id/tournaments/:tname/participants/:pname', participants.remove);

router.get('/api/organizers/:id/tournaments/:name/matches', matches.list);
router.post('/api/organizers/:id/tournaments/:name/matches', matches.add);
router.put('/api/organizers/:id/tournaments/:name/matches/:num', matches.update);
router.delete('/api/organizers/:id/tournaments/:name/matches/:num', matches.delete);

module.exports = router;
