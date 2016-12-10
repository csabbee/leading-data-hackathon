'usr strict';

module.exports = {
    initComponent: initComponent
};

function initComponent(appModule) {
    appModule.service('filterService', function () {
        this.filter = ['all'];
    });
}
