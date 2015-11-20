(function () {
    'use strict';

    angular.module('GulpWebappStarter', ['ngRoute', 'ngAnimate'])
        .config([
            '$locationProvider',
            '$routeProvider',
            function($locationProvider, $routeProvider) {
                $locationProvider.hashPrefix('!');
                $routeProvider
                    .when("/", {
                        templateUrl: "./partials/dashboard.html",
                        controller: "DashboardController"
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
            }
        ]);
}());