'use strict';

var d3 = require('d3');

var height = 500,
    width = 500,
    margin = 25,
    xAxis, yAxis, xAxisLength, yAxisLength;

var svg = d3.select('body').append('svg')
            .attr('class', 'axis')
            .attr('width', width)
            .attr('height', height);

function renderXAxis() {
    xAxisLength = width * 2 - margin;

    var scale = d3.scale.linear()
                    .domain([0, 100])
                    .range([0, xAxisLength]);
    
    xAxis = d3.svg.axis()
                .scale(scale)
                .orient('bottom');

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', function () {
            var heightMinusMargin = height - margin;
            return `translate(${margin},${heightMinusMargin})`;
        })
        .call(xAxis);
}

function renderYAxis() {
    yAxisLength = height * 2 - margin;

    var scale = d3.scale.linear()
                    .domain([100, 0])
                    .range([0, yAxisLength]);
    
    xAxis = d3.svg.axis()
                .scale(scale)
                .orient('left');

    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', function () {
            console.log(arguments);
            return `translate(${margin},${margin})`;
        })
        .call(yAxis);
}

function rescale() {
    var max = Math.round(Math.random() * 100);

    xAxis.scale().domain([0, max]);

    svg.select('g.x-axis')
        .transition()
        .call(xAxis);
    
    yAxis.scale().domain([max, 0]);
    svg.select("g.y-axis")
        .transition()
        .call(yAxis);
    
    renderXGridlines();
    renderYGridlines();
}

function renderXGridLines() {
    var lines = d3.selectAll('g.x-axis g.tick')
                    .select('line.grid-line')
                    .remove();
    
    lines = d3.selectAll('g.x-axis g.tick')
                .append('line')
                .classed('grid-line', true);

    lines.attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', -yAxisLength);
}

function renderYGridlines(){
    var lines = d3.selectAll("g.y-axis g.tick")
            .select("line.grid-line").remove(); 
    
    lines = d3.selectAll("g.y-axis g.tick")
            .append("line") 
            .classed("grid-line", true)
            
    lines.attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", xAxisLength)
        .attr("y2", 0);
}
    
renderXAxis();
renderYAxis();
renderXGridlines();
renderYGridlines();
