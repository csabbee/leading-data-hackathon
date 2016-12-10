'use strict';

module.exports = {
    initComponent: initComponent
};

function initComponent(appModule) {
    appModule.component('menu', {
        templateUrl: 'menu/menu.html',
        controller: MenuController
    })
}

function MenuController() {
    
}

