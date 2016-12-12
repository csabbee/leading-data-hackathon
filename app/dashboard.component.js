'use strict';
var _ = require('lodash');

module.exports = {
    initComponent: initComponent
};

function initComponent(app) {
    app.component('dashboard', {
        templateUrl: 'dashboard.html',
        controller: DashboardController
    });
}

function DashboardController() {
    mapboxgl.accessToken = require('../mapboxtoken');

    this.mapboxConfig = {
        style: 'mapbox://styles/seprus/ciwidozzc00fr2ps5tlkf3g5j',
        circleRadius: {
            'base': 3,
            'stops': [[8, 3.5], [10, 4.2], [12, 5.1], [14, 6.2], [16, 7.5]]
        },
        circleRadiusPoi: {
            'base': 4,
            'stops': [[8, 4.5], [10, 5.2], [12, 6.1], [14, 7.2], [16, 8.5]]
        }
    };

    this.sourceData = [
        {
            name: 'telekom',
            data: require('./telekom_crm_msc_weekly.json')
        },
        {
            name: 'poi',
            data: reverseCoordinates(require('./poi-geo-data.json'))
        }
    ];

    this.filter = ['any'];
    this.updateFilter = function (newFilter) {
        this.filter = newFilter;
    };
}

function reverseCoordinates(geoJson) {
    geoJson.data.features = _.forEach(geoJson.data.features, (feature, index) => {
        geoJson.data.features[index].geometry.coordinates = feature.geometry.coordinates.reverse();
    });
    return geoJson;
}
