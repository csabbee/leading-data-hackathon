var gulp = require('gulp');
var _= require('lodash');
var fs = require('fs');

var geojson = require('./data/overpass.geo.json');

gulp.task('filter-geojson', (done) => {
    var telekomTowers = {
        type: 'FeatureCollection',
        features: []
    };

    telekomTowers.features = geojson.features.filter(feature => {
        return feature.properties.tags.operator && _.includes(feature.properties.tags.operator, 'Telekom');
    });
    fs.writeFileSync('app/telekom_towers.geo.json', JSON.stringify(telekomTowers, null, '    '));
    done();
});