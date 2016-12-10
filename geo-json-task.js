var gulp = require('gulp');
var Converter = require('csvtojson').Converter;
var fs = require('fs');
var _ = require('lodash');

gulp.task('generate-geo.json', function (done) {
    getGeoJSON().then(geoJson => {
        fs.writeFileSync('app/telekom_crm_msc_weekly.json', JSON.stringify(geoJson));
        done();
    });
});

function getGeoJSON() {
    var filesToMerge = [
        './data/crm_weekly.csv',
        './data/msc_weekly.csv',
        './data/tac_weekly.csv'
    ];

    var promises = [];
    _.forEach(filesToMerge, file => {
        var converter = new Converter({});
        promises.push(new Promise((resolve, reject) => {
            converter.fromFile(file, function (err, result) {
                resolve(result);
            });
        }));
    });

    var distanceJson = require('./app/towerDistance.json');
    return Promise.all(promises)
        .then(([crm, msc, tac]) => {
            return connectJsons(crm, msc, tac, distanceJson);
        })
        .then(toGeoJson);
}

function connectJsons(crmJson, mscJson, tacJson, distanceJson) {
    var combined = mscJson.map(msc => {
        var crmMatch = _.find(crmJson, { subscriber: msc.subscriber });
        var tacMatch = _.find(tacJson, { TAC: msc.TAC });
        return _.merge({}, msc, crmMatch, tacMatch);
    });
    return combined.map(element => {
        var towerMatch = _.find(distanceJson, {
            id: element.subscriber,
            timestamp: element.timestamp
        });
        return _.merge({}, combined, towerMatch);
    });
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
                // MSC data
                msc_timestamp: element.timestamp,
                msc_mmdd: element.dataset,
                msc_hhmm: getHHMM(dt),
                msc_day: parseInt(dt.getDay() + 1),
                msc_type: element.type,
                // CRM data
                crm_id: element.subscriber,
                crm_sex: element.sex,
                crm_age: element.age,
                crm_zip: element.zip,
                crm_city: element.city,
                crm_category: element.category,
                crm_isPrivate: element.magan,
                crm_isBusiness: element.uzleti,
                crm_arpu: element.arpu,
                // TAC data
                tac_id: element.TAC,
                tac_manufacturer: element.manufacturer,
                tac_model: element.model,
                tac_aka: element.aka,
                tac_os: element.os,
                tac_year: element.year,
                tac_isLte: element.lte,
                // Tower data
                twr_id: element.TowerId,
                twr_nn_distance: element.distance,
                // others
                magenta_1: element.magenta_1,
                sim_4g: element.sim_4g
            }
        };
    });

    return geoJson;

    function getHHMM(dt) {
        return ('0' + dt.getHours()).slice(-2) + ':' + ('0' + dt.getMinutes()).slice(-2);
    }
}
