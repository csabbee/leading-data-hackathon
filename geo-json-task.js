var gulp = require('gulp');
var Converter = require("csvtojson").Converter;
var fs = require('fs');
var _ = require('lodash');

var converterCrm = new Converter({});
var converterMsc = new Converter({});

gulp.task('generate-geo.json', function (done) {
    getGeoJSON().then(geoJson => {
        fs.writeFileSync('geojson.json', JSON.stringify(geoJson));
        done();
    });
});

function getGeoJSON() {
    var crmPromise = new Promise((resolve, reject) => {
        converterCrm.fromFile('./data/crm_weekly.csv', function (err, result) {
            resolve(result);
        });
    });

    var mscPromise = new Promise((resolve, reject) => {
        converterMsc.fromFile('./data/msc_weekly.csv', function (err, result) {
            resolve(result);
        });
    });

    return Promise.all([crmPromise, mscPromise])
        .then(([crm, msc]) => {
            return connectJsons(crm, msc);
        })
        .then(toGeoJson);
}

function toGeoJson(connectedJson) {
    var geoJson = {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
    };

    geoJson.data.features = connectedJson.map(element => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [element.longitude, element.latitude]
            },
            properties: _.omit(element, ['longitude', 'latitude'])
        };
    });

    return geoJson;
}

function connectJsons(crmJson, mscJson) {
    return mscJson.map(msc => {
        var userData = _.find(crmJson, { subscriber: msc.subscriber });

        return _.merge({}, msc, userData);
    });
}