'use strict';

var _ = require('lodash');
var angular = require('angular');

var appModule = angular.module('telekom-vis', ['templates']);

appModule.component('telekomApp', {
    templateUrl: 'telekom-app.html',
    controller: TelekomAppController
});

TelekomAppController.$inject = ['$timeout'];

function TelekomAppController($timeout) {
    this.geojson = require('./telekom_crm_msc_weekly.json');
    console.log(this.geojson.data.features.length);
    console.log(this.geojson.data.features[0].properties);

    this.filter = ['all'];
    this.updateFilter = function (newFilter) {
        this.filter = newFilter
    }
}

require('./mapbox.component.js').initComponent(appModule);
require('./menu/menu.component.js').initComponent(appModule);
require('./menu/filter.service.js').initComponent(appModule);
