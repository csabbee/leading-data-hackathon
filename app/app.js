'use strict';
var angular = require('angular');

var app = angular.module('telekom-vis', ['templates']);

require('./dashboard.component.js').initComponent(app);
require('./mapbox.component.js').initComponent(app);
require('./menu/menu.component.js').initComponent(app);
require('./menu/gender-chart.component.js').initComponent(app);
require('./menu/filter-menu.component.js').initComponent(app);
require('./menu/age-chart.component.js').initComponent(app);
