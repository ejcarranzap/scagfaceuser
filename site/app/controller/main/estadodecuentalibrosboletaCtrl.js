(function () {
	'use strict';
	var app = angular.module('myApp');
	app.controller('estadodecuentalibrosboletaCtrl', function ($scope, $log, $filter, boService, $uibModal,
  userService) {
		$scope.data = [];
		$scope.record = {};
    $scope.record.alumnoscmb = {};

    var credential = userService.getCredential();
		$scope.record.authdata = credential.data;

		$scope.getData = function () {
			var urls = [];

			urls.push({
				url: 'server/main/itxweb_tool',
				param: {
					action: 'getalumno',
					data: {
						catalog: 'ALUMNO'
					}
				}
			});


			boService.call(urls).then(function (results) {
				//$scope.data = results[0].data.data;
        $scope.alumnos = results[0].data.data;
        $scope.alumnos = $filter('filter')($scope.alumnos, function(itm){
          return(itm.Cuenta == $scope.record.authdata.Username);
        });
				$scope.prepareData();
				//$scope.loadData();
			});
		};

		$scope.prepareData = function () {
			angular.forEach($scope.alumnos, function (itm) {
				var sitem;
				/*sitem = $filter('filter')($scope.cuentas, function (itm2) {
					return (itm2.Cuenta == itm.cuenta);
				});

				if (sitem) {
					if (sitem.length > 0)
						itm.CuentaNombre = sitem[0].NombreFactura;
				}*/
			});
      console.log($scope.alumnos);
		};

		$scope.getData();

		/*detalle*/
		$scope.open = function (record, size, actn) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/view/main/estadodecuentalibrosboletadet.html?' + (new Date()).getTime(),
				controller: 'estadodecuentalibrosboletadetCtrl',
				size: size,
				windowClass: 'modalfull',
				resolve: {
					record: function () {
						return (record);
					}
				}
			});

			modalInstance.result.then(function (record) {
				/*$scope.selectedrecord = record;*/
			}, function () {
				/*$log.info('Modal dismissed at: ' + new Date());*/
			});
		};
		/*end detalle*/

		$log.info('estadodecuentalibrosboletaCtrl');
	});

	app.controller('estadodecuentalibrosboletadetCtrl', function ($scope, $log, $filter, $window, boService, fileServicePHP, $uibModalInstance,
		record) {
		$scope.record = record;

		$scope.loadReport = function () {
			fileServicePHP.call([{
				type: 'application/pdf',
				url: '/server/main/report_tool_new',
				param: {
					action: 'rptCargosLibrosBoletaNew',
					data: $scope.record
				},
				config: {
					responseType: 'arraybuffer'
				}
            }]).then(function (results) {
				var frame = document.getElementsByTagName('iframe')[0];
				frame.src = results;
			});
		};

		$scope.getDataDetalle = function () {
        /*console.log(credential);
        $scope.loadReport();*/
				$scope.loadReport();
		};

		$scope.clear = function () {
			$scope.record = {};
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');

		};

		$scope.getDataDetalle();

		$log.info('estadodecuentalibrosboletadetCtrl');
	});
}());
