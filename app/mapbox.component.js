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
            map.addSource('telekom_crm_msc_weekly', this.geojson);
            map.addLayer({
                'id': 'telekom',
                'type': 'circle',
                'source': 'telekom_crm_msc_weekly',
                'paint': {
                    'circle-radius': {
                        'base': 1.75,
                        'stops': [[7, 2], [12, 7], [22, 180]]
                    },
                    'circle-color': {
                        property: 'age',
                        type: 'exponential',
                        stops: [
                            [18, '#00FF66'],
                            [24, '#00FF99'],
                            [33, '#00FFCC'],
                            [40, '#3399CC'],
                            [65, '#006699']
                        ]
                    }
                }
            });

            this.$onChanges = function (changes) {
                if (changes.filter.previousValue !== 'UNINITIALIZED_VALUE') {
                    map.setFilter('telekom', changes.filter.currentValue);
                }
            };
        });
    }

}
