var gulp = require('gulp');
var Converter = require("csvtojson").Converter;
var fs = require('fs');
var _ = require('lodash');

var converterCrm = new Converter({});
var converterMsc = new Converter({});

gulp.task('generate-geo.json', function (done) {
    getGeoJSON().then(geoJson => {
        fs.writeFileSync('app/telekom_crm_msc_weekly.json', JSON.stringify(geoJson, null, '    '));
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
        var dt = new Date(element.timestamp);
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [element.longitude, element.latitude]
            },
            properties: {
                day: parseInt(dt.getDay() + 1),
                hm: getHHMM(dt),
                age: element.age,
                sex: element.sex/*,
                unstable: {
                    timestamp: element.timestamp,
                    id: element.subscriber,
                    dataset: element.dataset,
                    zip: element.zip,
                    arpu: element.arpu,
                    magan: element.magan,
                    magenta_1: element.magenta_1,
                    sim_4g: element.sim_4g,
                    type: element.type,
                    uzleti: element.uzleti
                }*/
            }
        };
    });

    return geoJson;

    function getHHMM(dt) {
        return ('0' + dt.getHours()).slice(-2) + ':' + ('0' + dt.getMinutes()).slice(-2);
    }
}

function connectJsons(crmJson, mscJson) {
    return mscJson.map(msc => {
        var userData = _.find(crmJson, { subscriber: msc.subscriber });

        return _.merge({}, msc, userData);
    });
}