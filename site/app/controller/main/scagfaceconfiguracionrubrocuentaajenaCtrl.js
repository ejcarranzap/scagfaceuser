(function () {
    'use strict';
    var app = angular.module('myApp');
    app.controller('scagfaceconfiguracionrubrocuentaajenaCtrl', function ($scope, $log, $filter, boService, $uibModal) {
        $scope.data = [];

        $scope.getData = function () {
            var urls = [];
            urls.push({
                url: 'server/main/Bo_scagface_configuracion_rubro_cuenta_ajena',
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
			

            boService.call(urls).then(function (results) {
                $scope.data = results[0].data.data;
				$scope.rubros = results[1].data.data;

                $scope.prepareData();
                $scope.loadData();
            });
        };

        $scope.prepareData = function () {
            angular.forEach($scope.data, function (itm) {
                var sitem;
				sitem = $filter('filter')($scope.rubros, function (itm2) {
					return (itm2.Codigo == itm.codigo);
				});

				if (sitem) {
					if (sitem.length > 0)
						itm.Rubro = sitem[0].Descripcion;
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
                /*animation: $scope.animationsEnabled,*/
                templateUrl: 'app/view/main/scagfaceconfiguracionrubrocuentaajenadet.html?dt=' + (new Date()).getTime(),
                controller: 'scagfaceconfiguracionrubrocuentaajenadetCtrl',
                size: size,
                windowClass: 'modalfull',
                resolve: {
                    record: function () {
                        return (actn == 'edit' ? record : {});
                    },
					rubros: function () {
                        return ($scope.rubros);
                    },
                    action: function () {
                        return (actn == 'edit' ? 'update' : 'insert')
                    }
                }
            });

            modalInstance.result.then(function (record) {
                $scope.selectedrecord = record;
                $scope.getData();
            }, function () {
				$scope.getData();
                /*$log.info('Modal dismissed at: ' + new Date());*/
            });
        };
        /*end detalle*/

        $log.info('scagfaceconfiguracionrubrocuentaajenaCtrl');
    });

    app.controller('scagfaceconfiguracionrubrocuentaajenadetCtrl', function ($scope, $rootScope, $log, $filter, $timeout, boService, Upload, $uibModalInstance, record, rubros,action) {
        $scope.record = record;
		$scope.rubros = rubros;
		
		$scope.renderfields = ['Codigo', 'Descripcion'];
		$scope.fields = [{
				title: 'CODIGO',
				field: 'Codigo'
		}, {
				title: 'DESCRIPCION',
				field: 'Descripcion'
		}];

        $scope.initCmbs = function () {
            var sitem = {};
			
			sitem = $filter('filter')($scope.rubros, function (itm) {
				return (itm.Codigo == $scope.record.codigo);
			});

			if (sitem) {
				if (sitem.length > 0) {
					$scope.record.codigocmb = sitem[0];
				}
			}
        };

        $scope.initCmbs();

        $scope.clear = function () {
            $scope.record = {};
        };

        $scope.save = function () {
            var urls = [],
                action = (!$scope.record.Id_configuracion ? 'insert' : 'update');

            urls.push({
                url: 'server/main/Bo_scagface_configuracion_rubro_cuenta_ajena',
                param: {
                    action: action,
                    data: $scope.record
                }
            });

            boService.call(urls).then(function (results) {
                $scope.clear();
                $uibModalInstance.close($scope.record);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $log.info('scagfaceconfiguracionrubrocuentaajenadetCtrl');
    });
}());
