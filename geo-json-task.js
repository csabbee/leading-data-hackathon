var gulp = require('gulp');
var Converter = require('csvtojson').Converter;
var fs = require('fs');
var _ = require('lodash');

var converterCrm = new Converter({});
var converterMsc = new Converter({});
var converterTac = new Converter({});

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

    var tacPromise = new Promise((resolve, reject) => {
        converterTac.fromFile('./data/tac_weekly.csv', function (err, result) {
            resolve(result);
        });
    });

    return Promise.all([crmPromise, mscPromise, tacPromise])
        .then(([crm, msc, tac]) => {
            return connectJsons(crm, msc, tac);
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
                // MSC data
                msc_timestamp: element.timestamp,
                msc_mmdd: element.dataset,
                msc_hhmm: getHHMM(dt),
                msc_day: parseInt(dt.getDay() + 1),
                msc_type: element.type,
                // CRM data
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

function connectJsons(crmJson, mscJson, tacJson) {
    return mscJson.map((msc, index) => {
        var userData = _.find(crmJson, { subscriber: msc.subscriber });
        var tacData = _.find(tacJson, { TAC: msc.TAC });
        return _.merge({}, msc, userData, tacData);
    });
}