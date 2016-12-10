'use strict';

module.exports = {
    initComponent: initComponent
};

function initComponent(appModule) {
    appModule.component('menu', {
        templateUrl: 'menu/menu.html',
        controller: MenuController,
        require: {
            parent: '^telekomApp'
        }
    })
}

MenuController.$inject = ['filterService'];

function MenuController(filterService) {
    console.log(filterService);
}

