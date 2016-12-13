'use strict';
var Highcharts = require('highcharts');
var _ = require('lodash');

module.exports = {
    initComponent: initComponent
};

function initComponent(appModule) {
    appModule.component('ageChart', {
        template: '<div id="age"></div>',
        controller: AgeChartController,
        require: {
            parent: '^menu'
        },
        bindings: {
            data: '<'
        }
    });

    var chartOption = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            width: 180,
            height: 100
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'A',
            verticalAlign: 'middle',
            y: 6
        },
        tooltip: { enabled: false },
        plotOptions: {
            allowPointSelect: false,
            series: {
                dataLabels: { enabled: false },
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        series: [{
            showInLegend: false,
            size: '88%',
            innerSize: '75%', 
            data: []
        }]
    };

    AgeChartController.$inject = ['$timeout'];

    function AgeChartController($timeout) {
        this.$onInit = function () {
            chartOption.series[0].data = this.data;
            chartOption.chart.events = {
                click: () => {
                    $timeout(() => {
                        this.parent.selectChart('age');
                    });
                }
            }
            Highcharts.chart('age', chartOption);
        }
    }
}
