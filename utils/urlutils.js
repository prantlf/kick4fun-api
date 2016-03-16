module.exports = {

    getInnerId: function (url) {
        var fragments = url.split('/');
        return fragments[fragments.length - 2];
    }
};