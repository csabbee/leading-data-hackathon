var gulp = require('gulp');
var fs = require('fs');

gulp.task('pharmacy-geo', (done) => {
    var pharmacies = require('./py/shop.json');
    var geoJson = {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
    };

    geoJson.data.features = pharmacies.map(pharmacy => {
        return {
            type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [pharmacy.lon, pharmacy.lat]
                },
                properties: {
                    shopType: pharmacy.shopType,
                    branchName: pharmacy.branchName
                }
        };
    });

    fs.writeFileSync('app/pharmacy.geo.json', JSON.stringify(geoJson));
    done();
});
