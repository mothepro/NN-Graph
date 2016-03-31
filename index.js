const FILE_IN = __dirname + '/assets/MachineLearning.txt'; // raw input
const FILE_OUT = __dirname + '/assets/data.json'; // parsed output

const fs = require('fs');
const parser = require('./lib/parser');
const builder = require('./lib/builder');

fs.readFile(FILE_IN, 'utf8', function (err, data) {
    if(err)
        console.error(err);

    try {
        ret = parser(data);
        chart = builder(ret);
    } catch(err) {
        console.error('Unable to parse data');
    }
});