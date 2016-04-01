const FILE_IN = __dirname + '/assets/MachineLearning.txt'; // raw input

const fs = require('fs');
const parser = require('./lib/parser');
const builder = require('./lib/builder');

fs.readFile(FILE_IN, 'utf8', function (err, data) {
    if(err) console.error(err);
    else builder({
            path: __dirname + '/node_modules/d3/d3.js',
            data: parser(data),
            done: function(err, data) {
                if(err) console.error('Can not build svg', err);
                else console.log(data);
            }
        });
});