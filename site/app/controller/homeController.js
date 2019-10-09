(function () {
    'use strict';
    var app = angular.module('myApp');
    app.controller('homeController', function ($scope, $log, $rootScope, $http, boService, menuService) {


        $scope.getRecords = function () {
            var req = {
                method: 'POST',
                url: 'http://localhost:49728/Home/Test',
                dataType: 'json',
                params: {
                        Docentry: 2500,
                        DocNum: 3000
                },
                headers: {
                    'Content-Type': 'json/application'
                }
            };

            $http(req).then(function (results) {
                console.log(results.data);
            });

        };

        $log.info('homeController');
    });
}());
