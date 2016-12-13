'use strict';
var _ = require('lodash');

module.exports = {
    initComponent: initComponent
};

function initComponent(app) {
    app.component('menu', {
        templateUrl: 'menu/menu.html',
        controller: MenuController,
        require: {
            parent: '^dashboard'
        },
        bindings: {
            sourceData: '<'
        }
    });
}

function MenuController() {
    this.$onInit = function () {
        this.selectedChart = '';

        // init data sets

        var genderChartData = [
            { y: 0, color: '#F47936' },
            { y: 0, color: '#023E5A' },
            { y: 0, color: '#0165A6' },
        ];

        var ageChartData = [
            { y: 0, color: '#10282E', name: '18-24'},
            { y: 0, color: '#3F89E7', name: '25-45'},
            { y: 0, color: '#0165A6', name: '46-60'},
            { y: 0, color: '#023E5A', name: '61-74'},
            { y: 0, color: '#F47936', name: '75-'}
        ];

        // build data sets
        _.forEach(this.sourceData[0].data.data.features, function (feature) {

            if (feature.properties.crm_sex === 'F') {
                genderChartData[0].y += 1;
            } else if (feature.properties.crm_sex === 'M') {
                genderChartData[1].y += 1;
            } else {
                genderChartData[2].y += 1;
            }

            if (feature.properties.crm_age >= 18 && feature.properties.crm_age < 25) {
                ageChartData[0].y += 1;
            } else if (feature.properties.crm_age >= 25 && feature.properties.crm_age < 46) {
                ageChartData[1].y += 1;
            } else if (feature.properties.crm_age >= 46 && feature.properties.crm_age < 61) {
                ageChartData[2].y += 1;
            } else if (feature.properties.crm_age >= 61 && feature.properties.crm_age < 75) {
                ageChartData[3].y += 1;
            } else if (feature.properties.crm_age >= 75) {
                ageChartData[4].y += 1;
            }

        });

        this.genderChartData = genderChartData;
        this.ageChartData = ageChartData;

        this.selectChart = function (chart) {
            if (chart === this.selectedChart) {
                this.selectedChart = '';
            } else {
                this.selectedChart = chart;
            }
        };

        this.updateFilter = function (newFilter) {
            this.parent.updateFilter(newFilter);
        };
       
    };
}

