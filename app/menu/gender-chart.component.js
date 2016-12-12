'use strict';
var _ = require('lodash');
var Highcharts = require('highcharts');

module.exports = {
    initComponent: initComponent
};

function initComponent(app) {
    app.component('genderChart', {
        controller: GenderChartController,
        template: '<div id="gender"></div>',
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

GenderChartController.$inject = ['$timeout'];

function GenderChartController($timeout) {
    this.$onInit = function () {
        this.chartOption.title.text = this.titleChar;
        this.chartOption.series[0].data = this.data;
        this.chartOption.chart.events = {
            click: () => {
                $timeout(() => {
                    this.parent.selectChart('gender');
                });
            }
        };
        Highcharts.chart('gender', this.chartOption);
    };
}
