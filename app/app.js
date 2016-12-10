'use strict';

var _ = require('lodash');

var telekomGeoJson = require('./telekom_crm_msc_weekly.json');
console.log(telekomGeoJson.data.features.length);
console.log(telekomGeoJson.data.features[0].properties);

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

map.on('load', function () {
    map.addSource('telekom_crm_msc_weekly', telekomGeoJson);
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

    document.addEventListener('keyup', function (e) {
        var key = parseInt(e.key);
        if (_.includes([1, 2, 3, 4, 5, 6, 7], key)) {
            map.setFilter('telekom', ['==', 'day', key]);
        } else if (key === 0) {
            map.setFilter('telekom', ['all']);
        }
    });
});
