var gulp = require('gulp');
var Converter = require("csvtojson").Converter;
var fs = require('fs');
var _ = require('lodash');

var converterCrm = new Converter({});
var converterMsc = new Converter({});

gulp.task('generate-geo.json', function (done) {
    getGeoJSON().then(geoJson => {
        fs.writeFileSync('app/telekom_crm_msc_weekly.json', JSON.stringify(geoJson));
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
            properties: {
                timestamp: element.timestamp,
                dataset: element.dataset,
                zip: element.zip,
                person: {
                    age: element.age,
                    id: element.subscriber,
                    sex: element.sex
                },
                others: {
                    arpu: element.arpu,
                    magan: element.magan,
                    magenta_1: element.magenta_1,
                    sim_4g: element.sim_4g,
                    type: element.type,
                    uzleti: element.uzleti
                }
            }
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