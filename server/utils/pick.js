/**
 * Created by Chirag on 28-04-2016.
 */
/**
 * Function Module which takes an object[src] and an Array[keys] and returns a new object with the keys specified in the Array[keys]
 * @param src
 * @param keys
 * @returns {*}
 */
module.exports = function (src, keys) {
    return keys.reduce(function (o, k) {
        o[k] = src[k];
        return o;
    }, {});
};