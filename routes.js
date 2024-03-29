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

router.get('/api/v1/organizers', organizers.list);
router.get('/api/v1/organizers/:id', organizers.listOne);
router.post('/api/v1/organizers', organizers.create);
router.put('/api/v1/organizers/:id', organizers.update);
router.delete('/api/v1/organizers/:id', organizers.delete);

router.get('/api/v1/players', players.listAll);
router.get('/api/v1/organizers/:id/players', players.list);
router.get('/api/v1/organizers/:id/players/:name', players.listOne);
router.post('/api/v1/organizers/:id/players', players.create);
router.put('/api/v1/organizers/:id/players/:name', players.update);
router.delete('/api/v1/organizers/:id/players/:name', players.delete);

router.get('/api/v1/tournaments', tournaments.listAll);
router.get('/api/v1/organizers/:id/tournaments', tournaments.list);
router.get('/api/v1/organizers/:id/tournaments/:name', tournaments.listOne);
router.post('/api/v1/organizers/:id/tournaments', tournaments.create);
router.put('/api/v1/organizers/:id/tournaments/:name', tournaments.update);
router.delete('/api/v1/organizers/:id/tournaments/:name', tournaments.delete);

router.put('/api/v1/organizers/:id/tournaments/:name/prepare', tournaments.prepare);
router.put('/api/v1/organizers/:id/tournaments/:name/start', tournaments.start);
router.put('/api/v1/organizers/:id/tournaments/:name/finish', tournaments.finish);
router.put('/api/v1/organizers/:id/tournaments/:name/archive', tournaments.archive);

router.get('/api/v1/organizers/:id/tournaments/:name/participants', participants.list);
router.post('/api/v1/organizers/:id/tournaments/:name/participants', participants.add);
router.delete('/api/v1/organizers/:id/tournaments/:tname/participants/:pname', participants.remove);

router.get('/api/v1/organizers/:id/tournaments/:name/matches', matches.list);
//router.get('/api/v1/organizers/:id/tournaments/:name/matches/:num', matches.listOne);
router.post('/api/v1/organizers/:id/tournaments/:name/matches', matches.add);
router.put('/api/v1/organizers/:id/tournaments/:name/matches/:num', matches.update);
router.delete('/api/v1/organizers/:id/tournaments/:name/matches/:num', matches.delete);

module.exports = router;
