module.exports = {

    // Normalize a port into a number, string, or false.
    normalizePort: function (val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            return val; // named pipe
        } else if (port >= 0) {
            return port; // port number
        }
        return false;
    }

};