'use strict';

var telekomGeoJson = require('telekomCombined.json');

var token = require('../mapboxtoken');
mapboxgl.accessToken = token;

var mapStyle = 'mapbox://styles/seprus/ciwidpb5n00i52pmqxht7cad0';

var map = new mapboxgl.Map({
    container: 'mapbox',
    style: mapStyle,
    interactive: true,
    center: [19.0374, 47.4941],
    zoom: 8,
    hash: true
});

map.on('load', function () {
    map.addSource('telekom', telekomGeoJson);
    map.addLayer({
        'id': 'telekom',
        'type': 'circle',
        'source': 'telekom',
        'paint': {
            'circle-radius': {
                'base': 1.75,
                'stops': [[7, 2], [12, 7], [22, 180]]
            },
            'circle-color': {
                property: 'PROPERTY_NAME',
                type: 'categorical',
                stops: [
                    ['PROPERTY_TYPE', '#000000']
                ]
            },
            'circle-blur': 1
        }
    });
});
