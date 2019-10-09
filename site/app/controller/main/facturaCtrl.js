(function () {
	'use strict';
	var app = angular.module('myApp');
	app.controller('facturaCtrl', function ($scope, $log, $filter, boService, $uibModal) {
		$scope.data = [];

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
				/*animation: $scope.animationsEnabled,*/
				templateUrl: 'app/view/main/facturadet.html?dt=' + (new Date()).getTime(),
				controller: 'facturadetCtrl',
				size: size,
				windowClass: 'modalfull',
				resolve: {
					record: function () {
						return (actn == 'edit' ? record : {});
					},
					rubros: function () {
						return ($scope.rubros);
					},
					cuentas: function () {
						return ($scope.cuentas);
					},
					alumnos: function () {
						return ($scope.alumnos);
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

		$log.info('facturaCtrl');
	});

	app.controller('facturadetCtrl', function ($scope, $rootScope, $log, $filter, $window, $timeout, boService, Upload, $uibModalInstance, record, rubros, cuentas, alumnos, action) {
		$scope.record = record;
		$scope.rubros = rubros;
		$scope.cuentas = cuentas;
		$scope.alumnos = alumnos;
		$scope.alumnos_pivot = [];
		$scope.pagos = [];
		$scope.pagospivot = [];
		$scope.record.totalpago = null;
		$scope.spago = null;
		$scope.tipocmb = null;
		$scope.bancocmb = null;

		$scope.limpiaPago = function () {
			$scope.spago = {
				id: 0,
				monto: 0.0,
				documento: 0,
				cuenta: '',
				autorizacion: 0,
				tasa: 0.0,
				dolares: 0.0,
				vuelto: 0.0
			};
			$scope.tipocmb = null;
			$scope.bancocmb = null;
		};

		$scope.limpiaPago();
		$scope.$watch('tipocmb', function () {
			if ($scope.tipocmb) {
				$scope.getBancos();
			}
		});

		$scope.getBancos = function () {
			$scope.bancospivot = angular.copy($scope.bancos, $scope.bancospivot);
			$scope.bancospivot = $filter('filter')($scope.bancos, function (item) {
				return (item.Tipo == $scope.tipocmb.Tipo);
			});
		};

		$scope.cargaPago = function () {
			$scope.pagospivot = [];
			$scope.pagos = $filter('orderBy')($scope.pagos,'id');			
			var totalpago = 0.0;
			var i = 1;
			angular.forEach($scope.pagos, function (item) {
				var itm;

				itm = $filter('filter')($scope.tipos, function (pitem) {
					return (pitem.Tipo == item.tipo);
				});
				if (itm) {
					if (itm.length > 0) {
						item.ptipo = itm[0].Tipo;
					}
				}

				itm = $filter('filter')($scope.bancos, function (pitem) {
					return (pitem.Codigo == item.banco);
				});
				if (itm) {
					if (itm.length > 0) {
						item.pbanco = itm[0].Nombre;
					}
				}

				item.id = i;
				$scope.pagospivot.push(item);
				totalpago = totalpago + parseFloat(item.monto);
				i++;
			});

			$scope.record.totalpago = totalpago;
		};

		$scope.cargaPago();
		$scope.addPago = function () {
			$scope.spago.id = 0;
			
			$scope.pagos.push($scope.spago);
			$scope.cargaPago();
			$scope.limpiaPago();
		};

		$scope.deletePago = function (index, item) {
			if (item) {
				$scope.pagos.splice(index, 1);
				$scope.pagospivot.splice(index, 1);
			}

			$scope.cargaPago();
			$scope.limpiaPago();
		};

		$scope.editPago = function (index, item) {			
			$scope.preparePago(item);
			if (item) {
				$scope.pagos.splice(index, 1);
				$scope.pagospivot.splice(index, 1);
			}
			$scope.cargaPago();			
		};

		$scope.preparePago = function (item) {
			var itm;

			itm = $filter('filter')($scope.tipos, function (pitm) {
				return (pitm.Tipo == item.tipo);
			});
			if (itm) {
				if (itm.length > 0) {
					$scope.tipocmb = itm[0];
				}
			}

			itm = $filter('filter')($scope.bancos, function (pitm) {
				return (pitm.Codigo == item.banco);
			});
			if (itm) {
				if (itm.length > 0) {
					$scope.bancocmb = itm[0];
				}
			}
			$scope.spago = item;
		};

		$scope.totalp = 0;
		$scope.getTotal = function () {
			if (!$scope.datapivot)
				return 0;

			console.log('getTotal Function...');
			$scope.totalp = 0;
			angular.forEach($scope.datapivot.data, function (itm) {
				if (itm.Pagar == false) {

				} else {
					var filterFields = $scope.getFilterFields();
					if (filterFields.length > 0) {
						var filtro = $filter('filter')(filterFields, function (itmf) {
							return (itmf.Carnet == itm.Carnet);
						});

						if (filtro) {
							if (filtro.length > 0) {
								$scope.totalp = parseFloat($scope.totalp) + parseFloat(itm.Precio);
							}
						}
					} else {
						$scope.totalp = parseFloat($scope.totalp) + parseFloat(itm.Precio);
					}
				}
			});
			$scope.totalp = $scope.totalp.toFixed(2);
			document.getElementById('txtTotal').value = $scope.totalp;
		};


		$scope.getDataDetalle = function () {
			var urls = [];
			urls.push({
				url: 'server/main/itxweb_tool',
				param: {
					action: 'getcargo',
					data: {
						catalog: 'CARGO',
						codigo: $scope.record.cuentacmb.Codigo,
						Id_enca: $scope.record.Id_enca
					}
				}
			});
			
			urls.push({
				url: 'server/main/itxweb_tool',
				param: {
					action: 'getpago',
					data: {
						catalog: 'PAGO',
						codigo: $scope.record.cuentacmb.Codigo,
						Id_enca: $scope.record.Id_enca
					}
				}
			});

			urls.push({
				url: 'server/main/itxweb_tool',
				param: {
					action: 'getforma',
					data: {
						catalog: 'FORMA',
						codigo: $scope.record.cuentacmb.Codigo,
						Id_enca: $scope.record.Id_enca
					}
				}
			});

			urls.push({
				url: 'server/main/itxweb_tool',
				param: {
					action: 'getbanco',
					data: {
						catalog: 'BANCO',
						codigo: $scope.record.cuentacmb.Codigo,
						Id_enca: $scope.record.Id_enca
					}
				}
			});

			boService.call(urls).then(function (results) {
				/*$scope.cargos_pivot = results[0].data.data;*/
				$scope.cargos = results[0].data.data;
				$scope.pagos = results[1].data.data;
				$scope.tipos = results[2].data.data;
				$scope.bancos = results[3].data.data;
				$scope.bancospivot = [];

				$scope.datapivot = $scope.prepareData($scope.cargos);
				$scope.getTotal();
				$scope.cargaPago();
				$scope.$broadcast('hotupdateSettings', {
					data: $scope.datapivot.data,
					headers: $scope.datapivot.headers,
					columns: $scope.datapivot.columns
				});
				/*console.log($scope.totalp);*/
			});
		};

		$scope.hotupdateSettings = function () {
			$scope.getDataDetalle();
		};

		$scope.selectAll = function () {
			angular.forEach($scope.datapivot.data, function (itm) {
				itm.Pagar = true;
			});
			$scope.hotfilter();
			$scope.getTotal();
		};

		$scope.deselectAll = function () {
			angular.forEach($scope.datapivot.data, function (itm) {
				itm.Pagar = false;
			});
			$scope.hotfilter();
			$scope.getTotal();
		};

		$scope.hotfilter = function () {
			/*console.log('hotfilter');
			console.log($scope.getFilterFields());*/
			$scope.$broadcast('hotfilter', {
				data: $scope.datapivot.data,
				headers: $scope.datapivot.headers,
				columns: $scope.datapivot.columns,
				searchFields: $scope.getFilterFields()
			});
			$scope.getTotal();
		};

		$scope.getFilterFields = function () {
			var mydt = angular.copy($scope.alumnos_pivot, mydt);
			var mydtret = [];
			angular.forEach($scope.alumnos_pivot, function (itm) {
				if (itm.selected == true) {
					var itm2 = {
						Carnet: itm.Codigo
					};
					mydtret.push(itm2);
				}
			});
			return mydtret;
		};

		$scope.prepareData = function (data) {
			var arr = angular.copy(data, arr);
			var arrpivot = [];

			var count = 0;
			var headers = ['Pagar', 'Codigo', 'Carnet', 'Nombre', 'Grado', 'Rubro', 'Precio', 'Saldo', 'Mes'];
			var columns = [
				{
					data: 'Pagar',
					type: 'checkbox'
                },
				{
					data: 'Codigo',
					editor: false
                },
				{
					data: 'Carnet',
					editor: false
                },
				{
					data: 'Nombre',
					editor: false
                },
				{
					data: 'Grado',
					editor: false
                },
				{
					data: 'Rubro',
					editor: false
                },
				{
					data: 'Precio',
					editor: 'text'
                },
				{
					data: 'Saldo',
					editor: 'text'
                },
				{
					data: 'Mes',
					editor: false
                }
            ];

			angular.forEach(arr, function (dr) {
				var myitm = {};
				myitm.Pagar = true;
				myitm.Codigo = dr.Codigo;
				myitm.Carnet = dr.Carnet;
				myitm.Nombre = dr.Nombre;
				myitm.Grado = dr.Grado;
				myitm.Rubro = dr.Rubro;
				myitm.Precio = parseFloat(dr.Precio.toFixed(2));
				myitm.Saldo = parseFloat(dr.Saldo.toFixed(2));
				myitm.Mes = dr.Mes;
				arrpivot.push(myitm);
			});

			return ({
				data: arrpivot,
				headers: headers,
				columns: columns
			});
		};

		$scope.renderfields = ['Codigo', 'NombreFactura'];
		$scope.fields = [{
			title: 'CODIGO',
			field: 'Codigo'
		}, {
			title: 'DESCRIPCION',
			field: 'NombreFactura'
		}];

		$scope.initCmbs = function () {
			var sitem = {};

			sitem = $filter('filter')($scope.cuentas, function (itm) {
				return (itm.Codigo == $scope.record.cuenta);
			});

			if (sitem) {
				if (sitem.length > 0) {
					$scope.record.cuentacmb = sitem[0];
				}
			}
		};

		$scope.initCmbs();

		$scope.updateCell = function (changes, source, datarow) {
			/*changes[0] 0 row, 1 field, 2 oldvalue, 3 newvalue*/
			var registro = {},
				registro2 = {},
				datapivot;

			datapivot = $filter('filter')($scope.datapivot.data, function (itm) {
				return (parseFloat(itm.Codigo) == parseFloat(datarow[1]));
			});

			if (!datapivot[0])
				return;

			datapivot[0].Pagar = changes[0][3];
			$scope.getTotal();
		};

		$scope.printArr = function () {
			console.log($scope.datapivot.data);
		};

		$scope.updateCell2 = function (changes, source, datarow) {
			/*changes[0] 0 row, 1 field, 2 oldvalue, 3 newvalue*/
			var registro = {},
				registro2 = {},
				datapivot;

			datapivot = $filter('filter')($scope.datapivot.data, function (itm) {
				return (parseFloat(itm.Codigo) == parseFloat(datarow[1]));
			});

			if (!datapivot[0])
				return;

			datapivot[0].Precio = changes[0][3];
			$scope.getTotal();
		};

		$scope.onCellChange = function (changes, source, datarow) {
			if (changes[0][1] == 'Pagar') {
				$scope.updateCell(changes, source, datarow);
			}
			if (changes[0][1] == 'Precio') {
				$scope.updateCell2(changes, source, datarow);
			}
		};


		$scope.$watch('record.cuentacmb', function () {
			if ($scope.record.cuentacmb) {
				$scope.record.nombre_factura = $scope.record.cuentacmb.NombreFactura;
				$scope.record.direccion_factura = $scope.record.cuentacmb.DireccionFactura;
				$scope.record.nit_factura = $scope.record.cuentacmb.Nit;
				$scope.getAlumnos();
			} else {
				$scope.record.nombre_factura = null;
				$scope.record.direccion_factura = null;
				$scope.record.nit_factura = null;
				$scope.alumnos_pivot = [];
			}
			if ($scope.record.cuentacmb) {
				$scope.getDataDetalle();
			}
		});

		$scope.getAlumnos = function () {
			$scope.alumnos_pivot = $filter('filter')($scope.alumnos, function (itm) {
				return (itm.Cuenta == $scope.record.cuenta);
			});

			angular.forEach($scope.alumnos_pivot, function (itm) {
				itm.selected = false;
			});
		};

		$scope.clear = function () {
			$scope.record = {};
		};

		$scope.save = function () {
			var urls = [],
				action = 'INSERTFACTURA',
				filtered = [],
				filteredFields = [],
				mydata = [];

			mydata = angular.copy($scope.datapivot.data, mydata);

			filteredFields = $scope.getFilterFields();
			angular.forEach(filteredFields, function (itm) {
				var filteritm;
				filteritm = $filter('filter')(mydata, itm);
				angular.forEach(filteritm, function (itm2) {
					filtered.push(itm2);
				});
			});
			
			if(filteredFields.length == 0){
				filtered = mydata;
			}

			$scope.record.extradata = $filter('filter')(filtered, {
				Pagar: true
			});			
			$scope.record.extrapago = $scope.pagospivot;
			$scope.record.total = document.getElementById('txtTotal').value;
			
			if($scope.validaGuardar($scope.record.total, $scope.record.totalpago) == false){
				return false;
			}

			urls.push({
				url: 'server/main/Bo_scagface_factura_tool',
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
		
		$scope.validaGuardar = function(totalfactura, totalpago){
			var ok = true;
			
			if(totalfactura != totalpago){
				ok = false;
				$window.alert('El monto de la factura es diferente al de los pagos Monto: '+totalfactura+
							  ' Pago: '+totalpago+'.');
			}
			
			return ok;
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};



		$log.info('facturadetCtrl');
	});
}());
