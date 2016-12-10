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
        $scope.$watch('$ctrl.femaleCheckbox', (newValue, oldValue) => {
            if (newValue) {
                this.parent.updateFilter(['==', 'crm_sex', 'F']);
            }
            // this.parent.updateFilter({ female: newValue });
        });
        $scope.$watch('$ctrl.maleCheckbox', (newValue, oldValue) => {
            if (newValue) {
                this.parent.updateFilter(['==', 'crm_sex', 'M']);
            }
        });
        $scope.$watch('$ctrl.min', (newValue, oldValue) => {
            if (newValue > this.max) {
                this.min = this.max - 1;
            } else if (newValue) {
                this.parent.updateFilter(['all', ['>=', 'crm_age', this.min], ['<=', 'crm_age', this.max]])
            }
            // this.parent.updateFilter({ male: newValue });
        });

        $scope.$watch('$ctrl.max', (newValue, oldValue) => {
            if (newValue < this.min) {
                this.max = this.min + 1;
            } else if (newValue) {
                this.parent.updateFilter(['all', ['>=', 'crm_age', this.min], ['<=', 'crm_age', this.max]]);
            }
            // this.parent.updateFilter({ male: newValue });
        });

        this.$onChanges = function () {
        };
    }
}
