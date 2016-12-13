'use strict';
var _ = require('lodash');

module.exports = {
    initComponent: initComponent
};

function initComponent(appModule) {
    appModule.component('filterMenu', {
        templateUrl: 'menu/filter-menu.html',
        controller: FilterMenuController,
        bindings: {
            selectedChart: '<'
        },
        require: {
            parent: '^menu'
        }
    });

    FilterMenuController.$inject = ['$scope'];

    function FilterMenuController($scope) {
        this.filters = {
            crm_sex: [], // OR
            crm_age: [] // AND
        };

        this.buildFilter = () => {
            //build logic
            var F = ['all'];

            if (this.filters.crm_sex.length > 0) {
                var a = _.map(this.filters.crm_sex, s => {
                    return ['==', 'crm_sex', s];
                });
                a.unshift('any')
                F.push(a);
            }

            if (this.filters.crm_age.length > 0) {
                F.push(this.filters.crm_age);
            }

            if (F.length === 1) {
                F = ['any'];
            }

            this.parent.updateFilter(F);
        };

        $scope.$watch('$ctrl.femaleCheckbox', (newValue, oldValue) => {
            var value = 'F';
            if (newValue) {
                this.filters.crm_sex.push(value);
                this.filters.crm_sex = _.uniq(this.filters.crm_sex);
            } else {
                this.filters.crm_sex = _.filter(this.filters.crm_sex, s => {
                    return s === value;
                });
            }
            this.buildFilter();
        });

        $scope.$watch('$ctrl.maleCheckbox', (newValue, oldValue) => {
            var value = 'M';
            if (newValue) {
                this.filters.crm_sex.push(value);
                this.filters.crm_sex = _.uniq(this.filters.crm_sex);
            } else {
                this.filters.crm_sex = _.filter(this.filters.crm_sex, s => {
                    return s === value;
                });
            }
            this.buildFilter();
        });

        $scope.$watch('$ctrl.min', (newValue, oldValue) => {
            if (newValue > this.max) {
                this.min = this.max - 1;
            } else if (newValue && this.max) {
                this.filters.crm_age = ['all', ['>=', 'crm_age', this.min], ['<=', 'crm_age', this.max]];
            }
            this.buildFilter();
        });

        $scope.$watch('$ctrl.max', (newValue, oldValue) => {
            if (newValue < this.min) {
                this.max = this.min + 1;
            } else if (newValue && this.min) {
                this.filters.crm_age = ['all', ['>=', 'crm_age', this.min], ['<=', 'crm_age', this.max]];
            }
            this.buildFilter();
        });

        this.$onChanges = function () {};
    }
}
