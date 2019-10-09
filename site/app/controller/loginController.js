(function() {
    'use strict';
    var app = angular.module('myApp');
    app.controller('loginController', function($scope, $rootScope, $log, boService, menuService) {
        $rootScope.user = {};
        /*$rootScope.user = {username: '617',password: '99035',ruta: ''};*/
        /*$rootScope.user = {
            username: '369',
            password: '91054',
            ruta: ''
        };*/
        $scope.record = {};
        $scope.record.moment = moment();
        $scope.record.fecha = $scope.record.moment.format('DD/MM/YYYY');
        $scope.record.hora = $scope.record.moment.format('HH:mm:ss');
        $log.info('loginController');
    });
}());
