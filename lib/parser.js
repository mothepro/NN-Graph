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

    const regex = /Step:\s\[(\d+)\/(\d+)\]\stime:\s([\.\d]+),\sloss:\s([\d\.]+)/;
    var ret = [],
        match, lapse = 0;

    data.split('\n').forEach(function(line, num) {
        if(regex.test(line)) {
            match = line.match(regex);
            
            tmp = parseFloat(match[3]);
            
            ret.push({
                step: parseInt(match[1]),
                // time: tmp,
                lapse: tmp - lapse,
                loss: parseFloat(match[4]),
            });
            
            lapse = tmp;
        }
    });

    return ret;
};