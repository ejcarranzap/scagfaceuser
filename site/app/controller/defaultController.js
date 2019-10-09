(function () {
    'use strict';
    var app = angular.module('myApp');
    app.controller('defaultController', function ($scope, $rootScope, $log) {
        $log.info('defaultController');
    });
}());