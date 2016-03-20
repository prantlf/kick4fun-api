// Module dependencies
var express = require('express');
var http = require('http');
var path = require('path');
const join = require('path').join;
const fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var utils = require('./utils');
var debug = require('debug')('kick4fun-api:server');

// init express app
var app = express();
var port = utils.normalizePort(process.env.PORT || '3000');
app.set('port', port);

// load mongoose models
var modelPath = join(__dirname, 'models');
fs.readdirSync(modelPath).forEach(function (file) {
    require(join(modelPath, file));
});

// express routes
var routes = require('./routes/index');
var organizers = require('./routes/organizer');
var players = require('./routes/players');
var tournaments = require('./routes/tournaments');
var participants = require('./routes/participants');
var matches = require('./routes/matches');
var matchDays = require('./routes/matchDays');

app.use('/', routes);
app.use('/', players);
app.use('/', organizers);
app.use('', tournaments);
//app.use('/api/tournaments', tournaments);
app.use('/', participants);
app.use('/', matches);
//app.use('/api/tournaments/:tournamentId/matches', matches);
app.use('/', matchDays);


// connect to Mongo DB
var mongoUrl = 'localhost:27017';
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + mongoUrl);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
    console.log('Connected to MongoDB at ' + mongoUrl);
});

// init HTTP server
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app dependencies
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// utilities

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;
