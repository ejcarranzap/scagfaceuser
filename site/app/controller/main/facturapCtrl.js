(function () {
	'use strict';
	var app = angular.module('myApp');
	app.controller('facturapCtrl', function ($scope, $log, $filter, boService, $uibModal) {
		$scope.data = [];
		$scope.record = {};

		$scope.getData = function () {
			var urls = [];
			urls.push({
				url: 'server/main/Bo_scagface_factura_enca',
				param: {
					action: '',
					data: {}
				}
			});

			urls.push({
				url: 'server/main/itxweb_tool',
				param: {
					action: 'getrubro',
					data: {
						catalog: 'RUBRO'
					}
				}
			});

			urls.push({
				url: 'server/main/itxweb_tool',
				param: {
					action: 'getcuenta',
					data: {
						catalog: 'CUENTA'
					}
				}
			});

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
				$scope.data = results[0].data.data;
				$scope.rubros = results[1].data.data;
				$scope.cuentas = results[2].data.data;
				$scope.alumnos = results[3].data.data;

				$scope.prepareData();
				$scope.loadData();
			});
		};

		$scope.prepareData = function () {
			angular.forEach($scope.data, function (itm) {
				var sitem;
				sitem = $filter('filter')($scope.cuentas, function (itm2) {
					return (itm2.Cuenta == itm.cuenta);
				});

				if (sitem) {
					if (sitem.length > 0)
						itm.CuentaNombre = sitem[0].NombreFactura;
				}
			});
		};

		$scope.loadData = function (q) {
			if (q) {
				$scope.pivot_data = $filter('filter')($scope.data, q);
			} else {
				$scope.pivot_data = $scope.data;
			}
		};

		$scope.getData();

		$scope.q = null;
		$scope.$watch('q', function () {
			$scope.loadData($scope.q);
		});

		/*detalle*/
		$scope.open = function (record, size, actn) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/view/main/facturadetp.html?' + (new Date()).getTime(),
				controller: 'facturadetpCtrl',
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

		$log.info('facturaCtrl');
	});

	app.controller('facturadetpCtrl', function ($scope, $log, $filter, $window, boService, fileServicePHP, $uibModalInstance,
		record, userService) {
		$scope.record = record;

		var credential = userService.getCredential();
		$scope.record.authdata = credential.data;

		$scope.loadReport = function () {
			fileServicePHP.call([{
				type: 'application/pdf',
				url: '/server/main/report_tool',
				param: {
					action: 'get_report1',
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
			var urls = [];
			urls.push({
				url: 'server/main/itxweb_tool',
				param: {
					action: 'getcargo',
					data: {
						catalog: 'CARGO',
						codigo: $scope.record.cuenta,
						Id_enca: $scope.record.Id_enca
					}
				}
			});

			boService.call(urls).then(function (results) {
				$scope.cargos = results[0].data.data;
				$scope.record.extradata = $scope.cargos;
				$scope.loadReport();
			});
		};

		$scope.clear = function () {
			$scope.record = {};
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.getDataDetalle();

		$log.info('facturadetCtrl');
	});
}());
