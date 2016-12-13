'use strict';
var angular = require('angular');

var app = angular.module('telekom-vis', ['templates']);

require('./dashboard.component.js').initComponent(app);
require('./mapbox.component.js').initComponent(app);
require('./menu/menu.component.js').initComponent(app);
require('./menu/filter-menu.component.js').initComponent(app);
require('./menu/chart.component.js').initComponent(app);
