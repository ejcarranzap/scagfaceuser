(function() {
    'use strict';
    var app = angular.module('myApp');
    app.controller('pagoCtrl', function($scope, $rootScope, $log, $filter, boService, $uibModal, $window, $location) {
        $scope.actionType = $location.search().action;

        $scope.data = [];
        $scope.alumnos_pivot = [];
        $scope.pagos = [];
        $scope.pagospivot = [];
        $scope.record = {};
        $scope.record.totalpago = null;
        $scope.spago = null;
        $scope.tipocmb = null;
        $scope.bancocmb = null;

        $scope.maskOptions = {
            allowInvalidValue: true //allows us to watch the value
        };

        $scope.meses = [{
            id: '01',
            name: 'Enero'
        }, {
            id: '02',
            name: 'Febrero'
        }, {
            id: '03',
            name: 'Marzo'
        }, {
            id: '04',
            name: 'Abril'
        }, {
            id: '05',
            name: 'Mayo'
        }, {
            id: '06',
            name: 'Junio'
        }, {
            id: '07',
            name: 'Julio'
        }, {
            id: '08',
            name: 'Agosto'
        }, {
            id: '09',
            name: 'Septiembre'
        }, {
            id: '10',
            name: 'Octubre'
        }, {
            id: '11',
            name: 'Noviembre'
        }, {
            id: '12',
            name: 'Diciembre'
        }];

        $scope.anos = [];
        $scope.getAnos = function() {
            $scope.anos = [];
            var ano = (new Date()).getFullYear();
            for (var i = 0; i < 10; i++) {
                $scope.anos.push({
                    id: (ano + i),
                    name: (ano + i)
                });
            }
        };

        $scope.getAnos();

        $scope.getData = function() {
            var urls = [];
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


            boService.call(urls).then(function(results) {
                /*$scope.data = results[0].data.data;*/
                $scope.rubros = results[0].data.data;
                $scope.pcuentas = results[1].data.data;
                $scope.alumnos = results[2].data.data;

                $scope.cuentas = $filter('filter')($scope.pcuentas, function(itm) {
                    return (parseInt(itm.Codigo) == parseInt($rootScope.user.username));
                });


                if ($scope.cuentas) {
                    if ($scope.cuentas) {
                        $scope.record.cuentacmb = $scope.cuentas[0];
                        $scope.record.cuenta = $scope.cuentas[0].Codigo;
                    }
                }
            });
        };

        $scope.getData();

        $scope.limpiaPago = function() {
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
        $scope.$watch('tipocmb', function() {
            if ($scope.tipocmb) {
                $scope.getBancos();
            }
        });

        $scope.getBancos = function() {
            $scope.bancospivot = angular.copy($scope.bancos, $scope.bancospivot);
            $scope.bancospivot = $filter('filter')($scope.bancos, function(item) {
                return (item.Tipo == $scope.tipocmb.Tipo);
            });
        };

        $scope.cargaPago = function() {
            $scope.pagospivot = [];
            $scope.pagos = $filter('orderBy')($scope.pagos, 'id');
            var totalpago = 0.0;
            var i = 1;
            angular.forEach($scope.pagos, function(item) {
                var itm;

                itm = $filter('filter')($scope.tipos, function(pitem) {
                    return (pitem.Tipo == item.tipo);
                });
                if (itm) {
                    if (itm.length > 0) {
                        item.ptipo = itm[0].Tipo;
                    }
                }

                itm = $filter('filter')($scope.bancos, function(pitem) {
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
        $scope.generaPago = function() {
            $scope.spago = {};

            $scope.spago.autorizacion = 0;
            $scope.spago.banco = 'VSL';
            $scope.spago.cuenta = '';
            $scope.spago.documento = 0;
            $scope.spago.dolares = 0.0;
            $scope.spago.id = 0;
            $scope.spago.monto = $scope.totalp;
            $scope.spago.pbanco = 'VISA EN LINEA';
            $scope.spago.ptipo = 'T';
            $scope.spago.tasa = 0.0;
            $scope.spago.tipo = 'T';
            $scope.spago.vuelto = 0.0;

            $scope.pagos = [];
            $scope.addPago();
        };

        $scope.addPago = function() {
            console.log($scope.spago);
            $scope.spago.id = 0;

            $scope.pagos.push($scope.spago);
            $scope.cargaPago();
            $scope.limpiaPago();
        };

        $scope.deletePago = function(index, item) {
            if (item) {
                $scope.pagos.splice(index, 1);
                $scope.pagospivot.splice(index, 1);
            }

            $scope.cargaPago();
            $scope.limpiaPago();
        };

        $scope.editPago = function(index, item) {
            $scope.preparePago(item);
            if (item) {
                $scope.pagos.splice(index, 1);
                $scope.pagospivot.splice(index, 1);
            }
            $scope.cargaPago();
        };

        $scope.preparePago = function(item) {
            var itm;

            itm = $filter('filter')($scope.tipos, function(pitm) {
                return (pitm.Tipo == item.tipo);
            });
            if (itm) {
                if (itm.length > 0) {
                    $scope.tipocmb = itm[0];
                }
            }

            itm = $filter('filter')($scope.bancos, function(pitm) {
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
        $scope.getTotal = function() {
            if (!$scope.datapivot)
                return 0;

            console.log('getTotal Function...');
            $scope.totalp = 0;
            angular.forEach($scope.datapivot.data, function(itm) {
                if (itm.Pagar == false) {

                } else {
                    var filterFields = [];
                    if (filterFields.length > 0) {
                        var filtro = $filter('filter')(filterFields, function(itmf) {
                            return (itmf.Carnet == itm.Carnet);
                        });

                        if (filtro) {
                            if (filtro.length > 0) {
                                $scope.totalp = parseFloat($scope.totalp) + parseFloat(itm.Saldo);
                            }
                        }
                    } else {
                        $scope.totalp = parseFloat($scope.totalp) + parseFloat(itm.Saldo);
                    }
                }
            });
            $scope.totalp = $scope.totalp;

            document.getElementById('txtTotal').value = $filter('currency')($scope.totalp, 'Q', 4);
            setTimeout(function() {
                $scope.generaPago();
                $scope.$apply();
            });

        };


        $scope.getDataDetalle = function() {
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

            boService.call(urls).then(function(results) {
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
                    columns: $scope.datapivot.columns,
                    hiddenCols: [0, 1, 6]
                });

                setTimeout(function() {
                    $scope.record.deviceFingerprintID = cybs_dfprofiler("visanetgt_montessori","live");
                    $scope.$apply();
                });
                /*console.log($scope.totalp);*/
            });
        };

        $scope.hotupdateSettings = function() {
            $scope.getDataDetalle();
        };

        $scope.selectAll = function() {
            angular.forEach($scope.datapivot.data, function(itm) {
                itm.Pagar = true;
            });
            $scope.hotfilter();
            $scope.getTotal();
        };

        $scope.deselectAll = function() {
            angular.forEach($scope.datapivot.data, function(itm) {
                itm.Pagar = false;
            });
            $scope.hotfilter();
            $scope.getTotal();
        };

        $scope.hotfilter = function() {
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

        $scope.getFilterFields = function() {
            var mydt = angular.copy($scope.alumnos_pivot, mydt);
            var mydtret = [];
            angular.forEach($scope.alumnos_pivot, function(itm) {
                if (itm.selected == true) {
                    var itm2 = {
                        Carnet: itm.Codigo
                    };
                    mydtret.push(itm2);
                }
            });
            return mydtret;
        };

        $scope.prepareData = function(data) {
            var arr = angular.copy(data, arr);
            var arrpivot = [];

            var count = 0;
            var headers = ['Pagar', 'Codigo', 'Carnet', 'Nombre', 'Grado', 'Rubro', 'Precio', 'Saldo', 'Mes'];
            var columns = [{
                    data: 'Pagar',
                    type: 'checkbox',
                    renderer: function() {
                        return ('');
                    }
                },
                {
                    data: 'Codigo',
                    editor: false,
                    renderer: function() {
                        return ('');
                    }
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
                    editor: 'text',
                    renderer: function() {
                        return ('');
                    }
                },
                {
                    data: 'Saldo',
                    editor: 'text',
                    renderer: function(instance, td, row, col, prop, value, cellProperties) {
                      td.innerHTML = accounting.formatMoney(value, "Q", 2, ",", ".");
                      return td;
                    }
                },
                {
                    data: 'Mes',
                    editor: false
                }
            ];

            angular.forEach(arr, function(dr) {
                var myitm = {};
                myitm.Pagar = true;
                myitm.Codigo = dr.Codigo;
                myitm.Carnet = dr.Carnet;
                myitm.Nombre = dr.Nombre;
                myitm.Grado = dr.Grado;
                myitm.Rubro = dr.Rubro;
                myitm.Precio = parseFloat(dr.Precio).toFixed(4);
                myitm.Saldo = parseFloat(dr.Saldo).toFixed(4);
                myitm.Mes = dr.Mes;
                myitm.afecto_iva = dr.afecto_iva;
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

        $scope.initCmbs = function() {
            var sitem = {};

            sitem = $filter('filter')($scope.cuentas, function(itm) {
                return (itm.Codigo == $scope.record.cuenta);
            });

            if (sitem) {
                if (sitem.length > 0) {
                    $scope.record.cuentacmb = sitem[0];
                }
            }
        };

        $scope.initCmbs();

        $scope.updateCell = function(changes, source, datarow) {
            /*changes[0] 0 row, 1 field, 2 oldvalue, 3 newvalue*/
            var registro = {},
                registro2 = {},
                datapivot;

            datapivot = $filter('filter')($scope.datapivot.data, function(itm) {
                return (parseFloat(itm.Codigo) == parseFloat(datarow[1]));
            });

            if (!datapivot[0])
                return;

            datapivot[0].Pagar = changes[0][3];
            $scope.getTotal();
        };

        $scope.printArr = function() {
            console.log($scope.datapivot.data);
        };

        $scope.updateCell2 = function(changes, source, datarow) {
            /*changes[0] 0 row, 1 field, 2 oldvalue, 3 newvalue*/
            var registro = {},
                registro2 = {},
                datapivot;

            datapivot = $filter('filter')($scope.datapivot.data, function(itm) {
                return (parseFloat(itm.Codigo) == parseFloat(datarow[1]));
            });

            if (!datapivot[0])
                return;

            datapivot[0].Precio = changes[0][3];
            $scope.getTotal();
        };

        $scope.onCellChange = function(changes, source, datarow) {
            if (changes[0][1] == 'Pagar') {
                $scope.updateCell(changes, source, datarow);
            }
            if (changes[0][1] == 'Precio') {
                $scope.updateCell2(changes, source, datarow);
            }
        };


        $scope.$watch('record.cuentacmb', function() {
            if ($scope.record.cuentacmb) {
                $scope.record.nombre_factura = $scope.record.cuentacmb.NombreFactura;
                $scope.record.nit_factura = $scope.record.cuentacmb.Nit;
                $scope.record.direccion_factura = $scope.record.cuentacmb.DireccionFactura;
                $scope.record.email_factura = $scope.record.cuentacmb.PadreEmail;
                $scope.record.telefono_factura = $scope.record.cuentacmb.Telefonos;
                $scope.record.ip = $scope.record.cuentacmb.ip;
                $scope.record.cuenta_factura = $scope.record.cuentacmb.Codigo;
                $scope.getAlumnos();
            } else {
                $scope.record.nombre_factura = null;
                $scope.record.nit_factura = null;
                $scope.record.direccion_factura = null;
                $scope.record.email_factura = null;
                $scope.record.telefono_factura = null;
                $scope.record.ip = null;
                $scope.record.cuenta_factura = null;
                $scope.alumnos_pivot = [];
            }

            console.log($scope.record.cuentacmb);
            console.log($scope.record);

            if ($scope.record.cuentacmb) {
                $scope.getDataDetalle();
            }
        });

        $scope.getAlumnos = function() {
            $scope.alumnos_pivot = $filter('filter')($scope.alumnos, function(itm) {
                return (itm.Cuenta == $scope.record.cuenta);
            });

            angular.forEach($scope.alumnos_pivot, function(itm) {
                itm.selected = false;
            });
        };

        $scope.clear = function() {
            $scope.record = {};
        };

        $scope.save = function() {
            /*console.log($scope.record);
            return;*/

            var urls = [],
                action = 'INSERTFACTURA',
                filtered = [],
                filteredFields = [],
                mydata = [];

            mydata = angular.copy($scope.datapivot.data, mydata);

            filteredFields = $scope.getFilterFields();
            angular.forEach(filteredFields, function(itm) {
                var filteritm;
                filteritm = $filter('filter')(mydata, itm);
                angular.forEach(filteritm, function(itm2) {
                    filtered.push(itm2);
                });
            });

            if (filteredFields.length == 0) {
                filtered = mydata;
            }

            $scope.record.extradata = $filter('filter')(filtered, {
                Pagar: true
            });

            $scope.record.extrapago = $scope.pagospivot;
            /*$scope.record.total = document.getElementById('txtTotal').value;*/
            $scope.record.total = $scope.totalp;
            $scope.record.activo = ($scope.actionType!=3 ? 1 : 3);
            if($scope.actionType == 3){
                $scope.record.numero_autorizacion = '';
            }
            $scope.record.pfecha = moment().format('"DD/MM/YYYY"');

            if ($scope.validaGuardar($scope.record.total, $scope.record.totalpago) == false) {
                return false;
            }

            urls.push({
                url: 'server/main/Bo_scagface_factura_tool',
                param: {
                    action: action,
                    data: $scope.record
                }
            });

            boService.call(urls).then(function(results) {
                /*$scope.getData();*/
                /*console.log(results[0].data.data[0][0][0].Id_enca);*/
                if($scope.actionType==3){
                  $scope.record.Id_enca = results[0].data.data[0][0][0].Id_enca;
                  $scope.open($scope.record,'lg','print');
                }else{
                  $scope.generaFEL();
                  /*alert('Transacción exitosa.');
                  $location.path('/home');*/
                }
            });
        };

        $scope.generaFEL = function(){
            var urls = [];
            urls.push({
                url: 'server/main/Bo_scagface_factura_tool',
                param: {
                    action: 'INSERTFACTURAFEL',
                    data: $scope.record
                }
            });
            boService.call(urls).then(function(results) {
                  alert('FEL generado exitosamente.');
                  $location.path('/home');
            });
        };

        $scope.validaGuardar = function(totalfactura, totalpago) {
            var ok = true;

            if (totalfactura != totalpago) {
                ok = false;
                $window.alert('El monto de la factura es diferente al de los pagos Monto: ' + totalfactura +
                    ' Pago: ' + totalpago + '.');
                return ok;
            }

            if($scope.actionType != 3){
              if(!$scope.record.tarjeta){
                  ok = false;
                  $window.alert('Favor ingrese n\u00FAmero de tarjeta.');
                  return ok;
              }

              if(!$scope.record.mes){
                  ok = false;
                  $window.alert('Favor ingrese mes vencimiento tarjeta.');
                  return ok;
              }

              if(!$scope.record.ano){
                  ok = false;
                  $window.alert('Favor ingrese a\u00F1o vencimiento tarjeta.');
                  return ok;
              }
              if(!$scope.record.cvv){
                ok = false;
                $window.alert('Favor ingrese codigo de seguridad.');
                return ok;
              }
            }

            if($scope.totalp <= 0){
                ok = false;
                $window.alert('Su saldo es 0, no se puede realizar el pago.');
                return ok;
            }


            return ok;
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        /*impresion pagos a terceros*/
        $scope.open = function (record, size, actn) {
    			var modalInstance = $uibModal.open({
    				animation: $scope.animationsEnabled,
    				templateUrl: 'app/view/main/pagodetp.html?' + (new Date()).getTime(),
    				controller: 'pagodetCtrl',
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
            $location.path('/home');
    			}, function () {
            $location.path('/home');
    				/*$log.info('Modal dismissed at: ' + new Date());*/
    			});
    		};
        /*end impresion pagos a terceros*/
        $log.info('pagoCtrl');
    });

    app.controller('pagodetCtrl', function ($scope, $log, $filter, $window, boService, fileServicePHP, $uibModalInstance,
  		record, userService) {

      $scope.record = record;

      $scope.loadReport = function () {
        fileServicePHP.call([{
    				type: 'application/pdf',
					/*type: 'text/plain',*/
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

      $scope.clear = function () {
        $scope.record = {};
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.loadReport();
      console.log('pagodetCtrl');
    });
}());
