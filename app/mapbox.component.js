'use strict';

module.exports = {
    initComponent: initComponent
}

function initComponent(appModule) {
    appModule.component('mapbox', {
        templateUrl: 'mapbox.html',
        controller: MapboxController,
        require: {
            parent: '^telekomApp'
        },
        bindings: {
            geojson: '<',
            filter: '<'
        }
    });

    MapboxController.$inject = [];

    function MapboxController() {
        var token = require('../mapboxtoken');
        mapboxgl.accessToken = token;

        var mapStyle = 'mapbox://styles/seprus/ciwidozzc00fr2ps5tlkf3g5j';

        var map = new mapboxgl.Map({
            container: 'mapbox',
            style: mapStyle,
            interactive: true,
            center: [19.0374, 47.4941],
            zoom: 8,
            minZoom: 6,
            hash: true
        });

        map.on('load', () => {
            var circleRadius = {
                'base': 3,
                'stops': [[8, 3.5], [10, 4.2], [12, 5.1], [14, 6.2], [16, 7.5]]
            };

            map.addSource('telekom_crm_msc_weekly', this.geojson);

            map.addLayer({
                'id': 'telekom-all',
                'type': 'circle',
                'source': 'telekom_crm_msc_weekly',
                'paint': {
                    'circle-radius': circleRadius,
                    'circle-color': '#3b558f'//'#C3C5C4'//
                }
            });

            map.addLayer({
                'id': 'telekom-filtered',
                'type': 'circle',
                'source': 'telekom_crm_msc_weekly',
                'paint': {
                    'circle-radius': circleRadius,
                    'circle-color': '#16a3e8'//'#C41B00'//
                },
                'filter': this.filter
            });

            this.$onChanges = function (changes) {
                if (changes.filter.previousValue !== 'UNINITIALIZED_VALUE') {
                    console.log(changes.filter.currentValue);
                    try {
                        map.setFilter('telekom-filtered', changes.filter.currentValue);
                    } catch (err) {
                        console.log(err);
                    }
                }
            };
        });
    }

}

