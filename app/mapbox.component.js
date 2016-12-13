'use strict';
var _ = require('lodash');

module.exports = {
    initComponent: initComponent
};

function initComponent(app) {
    app.component('mapbox', {
        require: {
            parent: '^dashboard'
        },
        bindings: {
            mapboxConfig: '<',
            sourceData: '<',
            filter: '<'
        },
        templateUrl: 'mapbox.html',
        controller: MapboxController
    });
}

function MapboxController() {
    this.$onInit = () => {
        var map = new mapboxgl.Map({
            container: 'mapbox',
            style: this.mapboxConfig.style,
            interactive: true,
            center: [19, 47.5],
            zoom: 8,
            minZoom: 6,
            hash: true
        });

        map.on('load', () => {
            _.forEach(this.sourceData, source => {
                map.addSource(source.name, source.data);
            });

            map.addLayer({
                'id': 'poi',
                'type': 'circle',
                'source': 'poi',
                'paint': {
                    'circle-radius': this.mapboxConfig.circleRadiusPoi,
                    'circle-color': '#ff0000'
                }
            });

            map.addLayer({
                'id': 'telekom-all',
                'type': 'circle',
                'source': 'telekom',
                'paint': {
                    'circle-radius': this.mapboxConfig.circleRadius,
                    'circle-color': '#10282E'
                }
            });

            map.addLayer({
                'id': 'telekom-filtered',
                'type': 'circle',
                'source': 'telekom',
                'paint': {
                    'circle-radius': this.mapboxConfig.circleRadius,
                    'circle-color': '#16a3e8'
                },
                'filter': this.filter
            });

            this.$onChanges = function (changes) {
                if (changes.filter.previousValue !== 'UNINITIALIZED_VALUE') {
                    map.setFilter('telekom-filtered', changes.filter.currentValue);
                }
            };

        });
    };
}
