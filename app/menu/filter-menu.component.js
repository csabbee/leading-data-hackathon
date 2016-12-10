'use strict';

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
        $scope.$watch('$ctrl.age1824', (newValue, oldValue) => {
            // this.parent.updateFilter({ male: newValue });
        });
        $scope.$watch('$ctrl.age2545', (newValue, oldValue) => {
            // this.parent.updateFilter({ male: newValue });
        });
        $scope.$watch('$ctrl.age4660', (newValue, oldValue) => {
            // this.parent.updateFilter({ male: newValue });
        });
        $scope.$watch('$ctrl.age6174', (newValue, oldValue) => {
            // this.parent.updateFilter({ male: newValue });
        });
        $scope.$watch('$ctrl.age75plus', (newValue, oldValue) => {
            // this.parent.updateFilter({ male: newValue });
        });

        this.$onChanges = function () {
        }
    }
}
