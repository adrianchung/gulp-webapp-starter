(function () {
    'use strict';

    angular.module('GulpWebappStarter', ['ngRoute', 'ngAnimate']).config(config);

    config.$inject = [
        '$locationProvider',
        '$routeProvider' 
    ];

    function config($locationProvider, $routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "./partials/dashboard.html",
                controller: "DashboardController",
                controllerAs: "vm"
            })
            .otherwise({
                redirectTo: '/'
            });
    }
}());