const d3 = require('d3');
const fs = require('fs');
const jsdom = require('jsdom');

module.exports = Builder;

const
    WIDTH = 1000,
    HEIGHT = 500;

function Builder(data) {

    // var path = Builder.saveData(data);

    return Builder.output(data, Builder.draw);
}

// save to file
Builder.saveData = function (data) {
    const FILE_OUT = __dirname + '/../assets/data.json';

    fs.writeFileSync(FILE_OUT, JSON.stringify(data), 'utf8');

    return FILE_OUT;
};

// do d3 stuff
Builder.draw = function (window, data) {

    // chart
    var vis = window.d3.select("body")
        .append("svg")
        .attr('version', '1.1')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        // .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('xml:space', 'preserve')

        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    // spacing
    vis.append('svg:g')
        .attr('class', 'x-axis');

    vis.append('svg:g')
        .attr('class', 'y-axis');

    const
        x = 'step',
        y = 'loss';

    var
        xRange = d3.scale.linear()
            .range([0, WIDTH])
            .domain([
                d3.min(data, function (d) {
                    return d[x];
                }),
                d3.max(data, function (d) {
                    return d[x];
                })
            ]),

        yRange = d3.scale.linear()
            .range([HEIGHT, 0])
            .domain([
                d3.min(data, function (d) {
                    return d[y];
                }),
                d3.max(data, function (d) {
                    return d[y];
                })
            ]),

        xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickSubdivide(true),

        yAxis = d3.svg.axis()
            .scale(yRange)
            .tickSize(5)
            .orient('left')
            .tickSubdivide(true);

    // data to point
    var lineFunc = d3.svg.line()
        .x(function (d) {
            return xRange(d[x]);
        })
        .y(function (d) {
            return yRange(d[y]);
        })
        .interpolate('linear');

    vis.append('svg:path')
        .attr('d', lineFunc(data))
        .attr('stroke', 'blue')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
    
    return vis;
};

// draw from file
Builder.output = function(data, draw) {
    jsdom.env(
        "<html><body></body></html>", // blank page
        [ fs.readFileSync('../node_modules/d3/d3.min.js') ],
        function (err, window) {
            if(err) console.err(err);
            else {
                draw(window, data);

                // meta
                console.log('<?xml version="1.0" encoding="utf-8"?>');
                console.log('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');

                console.log(window.d3.select("svg").node().outerHTML);
            }
        }
    );
};