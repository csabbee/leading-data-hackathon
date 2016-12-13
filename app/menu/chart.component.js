'use strict';
var _ = require('lodash');
var Highcharts = require('highcharts');

module.exports = {
    initComponent: initComponent
};

function initComponent(app) {
    app.component('chart', {
        bindings: {
            chartTitle: '@',
            chartOption: '<',
            chartData: '<'
        },
        require: {
            parent: '^menu'
        },
        template: '<div id="{{ $ctrl.chartTitle }}"></div>',
        controller: ChartController
    });
}

ChartController.$inject = ['$element', '$timeout'];

function ChartController($element, $timeout) {
    this.$onInit = function () {
        var char = this.chartTitle[0].toUpperCase();
        this.chartOption.title.text = char;
        this.chartOption.series[0].data = this.chartData;
        this.chartOption.chart.events = {
            click: () => {
                $timeout(() => {
                    this.parent.selectChart(this.chartTitle);
                });
            }
        };
    };
    this.$postLink = function () {
        Highcharts.chart($element[0], this.chartOption);
    };
}
