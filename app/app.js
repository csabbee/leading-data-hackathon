'use strict';

var _ = require('lodash');
var angular = require('angular');

var appModule = angular.module('telekom-vis', ['templates']);

appModule.component('telekomApp', {
    templateUrl: 'telekom-app.html',
    controller: TelekomAppController
});

TelekomAppController.$inject = ['filterService'];

function TelekomAppController(filterService) {
    this.geojson = require('./telekom_crm_msc_weekly.json');
    
    this.filter = filterService.filter;
    this.updateFilter = function (newFilter) {
        this.filter = newFilter
    }
}

require('./mapbox.component.js').initComponent(appModule);
require('./menu/menu.component.js').initComponent(appModule);
require('./menu/filter.service.js').initComponent(appModule);
require('./menu/gender-chart.component.js').initComponent(appModule);
require('./menu/filter-menu.component.js').initComponent(appModule);
require('./menu/age-chart.component.js').initComponent(appModule);
