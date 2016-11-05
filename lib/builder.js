const d3 = require('d3');
const fs = require('fs');
const jsdom = require('jsdom');

module.exports = Builder;

/**
 * Start the JS DOM emulator
 * @param config
 *  path to d3 library [ './node_modules/d3/d3.js' ]
 *  done callback from SVG generation [ display to scrren ]
 *  data parsed data [ empty array ]
 * @constructor
 */
function Builder(config) {
    config = config || {};
    config.path = config.path || './node_modules/d3/d3.js';
    config.done = config.done || console.log;
    config.data = config.data || [];
    
    jsdom.env({
        html: "<html><body></body></html>", // blank page
        scripts: [ config.path ], // d3 resource
        done: function (err, window) {
            var ret = null,
                root = window.d3.select('body');
            
            if (err) console.err(err);
            else {
                Builder.draw(config.data, root);
                
                root.selectAll('script').remove();
                
                // meta
                ret  = '<?xml version="1.0" encoding="utf-8"?>';
                ret += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
                
                // inside body
                ret += root.html(); //.select("svg").node().outerHTML;
                
                // close window
                window.close();
            }
            
            config.done(err, ret);
        }
    });
}

/**
 * Do stuff in D3 using data to modify the root
 * @param data
 * @param root
 */
Builder.draw = function (data, root) {

    const
        xTerm = 'step',
        yTerm = 'loss',
        
        WIDTH = 1000,
        HEIGHT = 900,
        MARGIN = {
            top: 5,
            right: 0,
            bottom: 20,
            left: 50,
        };

    // chart
    var vis = root.append('svg')
            .attr('version', '1.1')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            // .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
            .attr('xml:space', 'preserve')
    
            .attr('width', WIDTH + MARGIN.left + MARGIN.right)
            .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom),
        
        x = d3.scale.linear()
            .range([0, WIDTH])
            .domain([
                d3.min(data, function (d) { return d[xTerm]; }),
                d3.max(data, function (d) { return d[xTerm]; })
            ]),
    
        y = d3.scale.linear()
            .range([HEIGHT, 0])
            .domain([
                0, //d3.min(data, function (d) { return d[yTerm]; }),
                1, //d3.max(data, function (d) { return d[yTerm]; })
            ]);

    // axes
    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate('+ MARGIN.left +','+ (MARGIN.top + HEIGHT) +')')
        .call(
            d3.svg.axis()
            .scale(x)
            .tickSize(1)
            .tickSubdivide(true)
        );

    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate('+ MARGIN.left +','+ MARGIN.top +')')
        .call(
            d3.svg.axis()
            .scale(y)
            .tickSize(1)
            .orient('left')
            .tickSubdivide(true)
        );


    // data to point
    var line = d3.svg.line()
        .x(function (d) {
            return x(d[xTerm]);
        })
        .y(function (d) {
            return y(d[yTerm]);
        })
        .interpolate('logistic');

    vis.append('svg:g')
        .attr('transform', 'translate('+ MARGIN.left +','+ MARGIN.top +')')
        .append('svg:path')
            .attr('d', line(data))
            .attr('stroke', 'blue')
            .attr('stroke-width', 1)
            .attr('fill', 'none');
};