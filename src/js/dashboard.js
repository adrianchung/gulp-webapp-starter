(function () {
    'use strict';

    angular.module('GulpWebappStarter')
        .controller('DashboardController', [
            '$scope',
            function($scope) {
                $scope.message = 'foo';
            }
        ]);
}());
