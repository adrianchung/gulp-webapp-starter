(function () {
    'use strict';

    angular.module('GulpWebappStarter')
        .controller('DashboardController', [
            '$scope',
            function($scope) {
                const constMessage = 'Something interesting about me';
                $scope.message = constMessage;
            }
        ]);
}());
