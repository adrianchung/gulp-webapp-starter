(function () {
    'use strict';

    angular.module('GulpWebappStarter')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [];

    function DashboardController() {
        const vm = this;
        const constMessage = 'Something interesting about me';
        vm.message = constMessage;
    }
}());
