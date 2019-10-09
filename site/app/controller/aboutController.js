(function () {
    'use strict';
    var app = angular.module('myApp');
    app.controller('aboutController', function ($scope, $log) {
        $log.info('aboutController');
    });
}());