var S = require('underscore.string');

module.exports = {

    getFragment: function (str, chr, pos) {
        var fragments = S.words(S.trim(str, '/'), '/');
        return pos < 0 ? fragments[fragments.length + pos] : fragments[pos];
    },

    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

};