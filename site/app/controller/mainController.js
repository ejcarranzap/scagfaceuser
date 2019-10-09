(function () {
    'use strict';
    var app = angular.module('myApp');
    app.controller('mainController', function ($scope, $rootScope, $log, $http, boService, menuService, userService) {

        $scope.callService = function(){
            var promise = $http.post('http://localhost:3061/server/main/Bo_pagotercero_tool',
            {XMLIn:"<REQPAGOREVERSIONGENERICO>"+
                      "<ID>200</ID>"+
                      "<LLAVE>12210810125404137</LLAVE>"+
                      "<TVALIDACION>1</TVALIDACION>"+
                      "<MONTO_PAGADO>150.00</MONTO_PAGADO>"+
                      "<BANCO>GT</BANCO>"+
                      "<FECHA_PAGO>20/01/2014</FECHA_PAGO>"+
                      "<PAGO_REVERSION>P</PAGO_REVERSION>"+
                      "<HORA_PAGO>13:00:14</HORA_PAGO>"+
                      "<AGENCIA>00000120</AGENCIA>"+
                      "<AUT_BCO>000000000635230</AUT_BCO>"+
                      "<USUARIO>120101 </USUARIO>"+
                      "<TERMINAL>7D02CCC8  </TERMINAL>"+
                      "</REQPAGOREVERSIONGENERICO>"}).then(
            function(response, status){
              console.log(response);
              console.log(response.data);
            });
            return promise;
        };

        $log.info('mainController');
    });
}());
