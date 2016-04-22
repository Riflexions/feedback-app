/**
 * Created by Chirag on 16-04-2016.
 */
function pick(src,keys){
    return keys.reduce(function(o, k) { o[k] = src[k]; return o; }, {});
}
module.exports.pick=pick;