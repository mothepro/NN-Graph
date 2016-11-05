// const FILE_IN = __dirname + '/assets/train1.log'; // raw input

const fs = require('fs');
const parser = require('./lib/parser');
const builder = require('./lib/builder');

/*
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
});*/
const path = 'C:\\Users\\Mo\\Desktop\\logs\\';
fs.readdir(path, function(err, files) {
    if(err) throw err;
    files.forEach(function (file) {
        fs.readFile(path + file, 'utf8', function (err, data) {
            if(err) console.error(err);
            else builder({
                path: __dirname + '/node_modules/d3/d3.js',
                data: parser(data),
                done: function(err, data) {
                    if(err) console.error('Can not build svg', err);
                    else fs.writeFileSync(path +'svg\\'+ file + '.svg', data)
                }
            });
        });
    })
});