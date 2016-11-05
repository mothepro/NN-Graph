/**
 * Gets the raw input and converts
 * it to an array of nice objects
 * 
 * @param data
 * @returns {Array}
 */
module.exports = function Parser(data) {
    if(typeof data !== 'string')
        throw Error('Unable to parse malformed data');

    // const regex = /Step:\s\[\s*(\d+)\/(\d+)\]\stime:\s([\.\d]+),\sloss:\s([\d\.]+)/;
    //const regex = /Epoch:\s\[\s*(\d+)\/\s*(\d+)\]\stime:\s([\.\d]+),\sloss:\s([\d\.]+)/; // Epoch: [ 1/ 450000] time: 2.3983, loss: 4744.54833984
    // const regex = /\((\d+), array\(\[\s*([-+]?(?:\d*\.)?\d+)\], dtype=float32\), array\(\[\s*([-+]?(?:\d*\.)?\d+)\], dtype=float32\)\)/; // (59, array([ 0.08221585], dtype=float32), array([ 0.31021258], dtype=float32))
    // const regex = /Loop:\s(\d+)\s+Batch:\s(\d+)\s+Accuracy:\s([-+]?(?:\d*\.)?\d+)/;
    
    // const regex = /Test>>\s+Iteration:\s+(\d+)\s+Accuracy:\s+([-+]?(?:\d*\.)?\d+)/;
    const regex = /Test>>\sIteration:\s+(\d+)\s+Batch:\s+(\d+)\s+Step:\s+(\d+)\s+Accuracy:\s([-+]?(?:\d*\.)?\d+)\s+Accuracy Aggregate:\s([-+]?(?:\d*\.)?\d+)\s+FScore:\s([-+]?(?:\d*\.)?\d+)\s+FScore Aggregate:\s([-+]?(?:\d*\.)?\d+)/;
    var ret = [],
        match, lapse = 0;
var i =0;
    data.split('\n').forEach(function(line, num) {
        if(regex.test(line)) {
            match = regex.exec(line);
            
            // tmp = parseFloat(match[3]);
            
            ret.push({
                step: parseInt(match[3]),
                // time: tmp,
                // lapse: tmp - lapse,
                loss: parseFloat(match[4]),
            });
            
            // lapse = tmp;
        }
    });

    return ret;
};