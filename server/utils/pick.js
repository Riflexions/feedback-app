/**
 * Created by Chirag on 28-04-2016.
 */
module.exports = function (src, keys) {
    return keys.reduce(function (o, k) {
        o[k] = src[k];
        return o;
    }, {});
};