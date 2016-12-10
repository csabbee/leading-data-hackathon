'use strict';
var Highcharts = require('highcharts');
var _ = require('lodash');

module.exports = {
    initComponent: initComponent
};

function initComponent(appModule) {
    appModule.component('menu', {
        templateUrl: 'menu/menu.html',
        controller: MenuController,
        require: {
            parent: '^telekomApp'
        },
        bindings: {
            geojson: '<'
        }
    })
}

MenuController.$inject = ['filterService'];

function MenuController(filterService) {
    
    this.$onInit = function () {
        var genderChartData = [
            { y: 0, color: 'red' },
            { y: 0, color: 'blue' }
        ];
        var ageChartData = [
            { y: 0, color: 'red', name: '18-24'},
            { y: 0, color: 'green', name: '25-45'},
            { y: 0, color: 'blue', name: '46-60'},
            { y: 0, color: 'grey', name: '61-74'},
            { y: 0, color: 'black', name: '75-'}
        ]
        console.log(this.geojson);
        this.geojson.data.features.forEach(function (data) {
            if (data.properties.sex === 'F') {
                genderChartData[0].y += 1;
            } else {
                genderChartData[1].y += 1;
            }

            if (data.properties.age >= 18 && data.properties.age < 25) {
                ageChartData[0].y += 1;
            } else if (data.properties.age >= 25 && data.properties.age < 46) {
                ageChartData[1].y += 1;
            } else if (data.properties.age >= 46 && data.properties.age < 61) {
                ageChartData[2].y += 1;
            } else if (data.properties.age >= 61 && data.properties.age < 75) {
                ageChartData[3].y += 1;
            } else if (data.properties.age >= 75) {
                ageChartData[4].y += 1;
            }
        });
        this.genderChartData = genderChartData;
        this.ageChartData = ageChartData;

        this.selectChart = function (chart) {
            this.selectedChart = chart;
        };

        this.updateFilter = function (newFilter) {
            this.parent.updateFilter(newFilter);
        }
       
    }
    console.log(filterService);
}

