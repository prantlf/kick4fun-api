var S = require('underscore.string');

module.exports = {

    getFragment: function (str, chr, pos) {
        var fragments = S.words(S.trim(str, '/'), '/');
        return pos < 0 ? fragments[fragments.length + pos] : fragments[pos];
    }
};