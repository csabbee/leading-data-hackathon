'use strict';

var _ = require('lodash');
var angular = require('angular');

var appModule = angular.module('telekom-vis', ['templates']);

require('./mapbox.component.js').initComponent(appModule);

