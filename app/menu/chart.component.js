'use strict';
var _ = require('lodash');
var Highcharts = require('highcharts');

module.exports = {
    initComponent: initComponent
};

function initComponent(app) {
    app.component('chart', {
        require: {
            parent: '^menu'
        },
        bindings: {
            chartTitle: '@',
            chartData: '<'
        },
        template: '<div id="{{ $ctrl.chartTitle }}"></div>',
        controller: ChartController
    });
}

ChartController.$inject = ['$element', '$timeout'];

function ChartController($element, $timeout) {

    var chartOption = {
        chart: {
            plotBackgroundColor: 'transparent',
            plotBorderWidth: 0,
            plotShadow: false,
            type: 'pie',
            width: 100,
            height: 100
        },
        credits: {
            enabled: false
        },
        title: {
            text: '',
            verticalAlign: 'middle',
            y: 6
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        series: [{
            size: '95%',
            innerSize: '80%',
            dataLabels: {
                enabled: false
            }, 
            data: []
        }]
    };

    this.$onInit = function () {
        chartOption.title.text = this.chartTitle[0].toUpperCase();
        chartOption.series[0].data = this.chartData;
        chartOption.chart.events = {
            click: () => {
                $timeout(() => {
                    this.parent.selectChart(this.chartTitle);
                });
            }
        };
    };

    this.$postLink = function () {
        Highcharts.chart($element[0], chartOption);
    };

}
