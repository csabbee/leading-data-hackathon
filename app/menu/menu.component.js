'use strict';
var _ = require('lodash');

module.exports = {
    initComponent: initComponent
};

function initComponent(app) {
    app.component('menu', {
        require: {
            parent: '^dashboard'
        },
        bindings: {
            sourceData: '<',
            selections: '<'
        },
        templateUrl: 'menu/menu.html',
        controller: MenuController
    });
}

function MenuController() {
    var colorPalette = [
        '#F47936',
        '#3F89E7',
        '#0165A6',
        '#023E5A',
        '#10282E'
    ];

    this.$onInit = function () {
        this.selectedChart = '';

        var properties = _.map(this.selections, selection => {
            return {
                name: selection[0],
                title: selection[1],
                data: []
            }
        });

        _.map(this.sourceData[0].data.data.features, function (feature) {
            _.map(properties, function (property, index) {

                if (!_.find(property.data, {value: feature.properties[property.name]})) {
                    property.data.push({
                        y: 1,
                        value: feature.properties[property.name]
                    });
                } else {
                    _.map(property.data, data => {
                        if (data.value === feature.properties[property.name]) {
                            data.y++;
                        }
                    });
                }

            });
        });

        _.map(properties, function (property) {
            _.sortBy(property.data, 'y');
            _.map(property.data, (data, index) => {
                data.color = colorPalette[index] || '#000000';
            });
        });

        this.properties = properties;

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

