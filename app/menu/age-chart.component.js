'use strict';
var _ = require('lodash');
var Highcharts = require('highcharts');

module.exports = {
    initComponent: initComponent
};

function initComponent(app) {
    app.component('ageChart', {
        controller: AgeChartController,
        template: '<div id="age"></div>',
        require: {
            parent: '^menu'
        },
        bindings: {
            chartOption: '<',
            titleChar: '<',
            data: '<'
        }
    });
}

AgeChartController.$inject = ['$timeout'];

function AgeChartController($timeout) {
    this.$onInit = function () {
        this.chartOption.title.text = this.titleChar;
        this.chartOption.series[0].data = this.data;
        this.chartOption.chart.events = {
            click: () => {
                $timeout(() => {
                    this.parent.selectChart('age');
                });
            }
        };
        Highcharts.chart('age', this.chartOption);
    };
}
