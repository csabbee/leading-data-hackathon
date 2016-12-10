'use strict';
var Highcharts = require('highcharts');
var _ = require('lodash');

module.exports = {
    initComponent: initComponent
};

function initComponent(appModule) {
    var chartOption = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            width: 100,
            height: 100
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'G',
            verticalAlign: 'middle',
            y: 6
        },
        tooltip: { enabled: false },
        plotOptions: {
            allowPointSelect: false,
            dataLabels: { enabled: false },
            series: {
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
            dataLabels: {
                enabled: false
            }, 
            data: []
        }]
    };


    appModule.component('genderChart', {
        controller: GenderChartController,
        template: '<div id="gender"></div>',
        require: {
            parent: '^menu'
        },
        bindings: {
            data: '<'
        }
    });

    GenderChartController.$inject = ['$timeout']

    function GenderChartController($timeout) {
        this.$onInit = function () {
            chartOption.series[0].data = this.data;
            chartOption.chart.events = {
                click: () => {
                    $timeout(() => {
                        this.parent.selectChart('gender');
                    });
                }
            }
            Highcharts.chart('gender', chartOption);
        }
    }
}
