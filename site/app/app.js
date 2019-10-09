(function() {
    'use strict';
    var app = angular.module('myApp', [
        'ngRoute',
        'ngCookies',
        'ngAnimate',
        'ngFileUpload',
        'uiSwitch',
        'ui.bootstrap',
        'ui.bootstrap.datetimepicker',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.cellNav',
        'ui.grid.pinning',
        'treeControl',
        'ngContextMenu',
        'ngBootbox',
        'ng.group',
        'angularUtils.directives.dirPagination',
        'ngMap',
        'ui.mask'
        /*,
                'ngHandsontable'*/
    ]);

    app.config(function($routeProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $routeProvider
            .when('/', {
                templateUrl: 'app/view/loginform.html',
                controller: 'loginController',
                data: {
                    requireLogin: false
                }
            })
            .when('/home', {
                templateUrl: 'app/view/home.html',
                controller: 'homeController',
                data: {
                    requireLogin: false
                }
            })
            .when('/about', {
                templateUrl: './app/view/about.html',
                controller: 'aboutController',
                data: {
                    requireLogin: true
                }
            })
            .when('/contact', {
                templateUrl: './app/view/contact.html',
                controller: 'contactController',
                data: {
                    requireLogin: true
                }
            })
            .when('/login', {
                templateUrl: './app/view/loginform.html',
                controller: 'loginController',
                data: {
                    requireLogin: false
                }
            })
            .when('/Bo_scagface_configuracion_rubro_cuenta_ajena', {
                templateUrl: './app/view/main/scagfaceconfiguracionrubrocuentaajena.html',
                controller: 'scagfaceconfiguracionrubrocuentaajenaCtrl',
                data: {
                    requireLogin: false
                }
            })
            .when('/Bo_scagface_factura_enca', {
                templateUrl: './app/view/main/factura.html',
                controller: 'facturaCtrl',
                data: {
                    requireLogin: false
                }
            })
            .when('/Bo_scagface_factura_encap', {
                templateUrl: './app/view/main/facturap.html',
                controller: 'facturapCtrl',
                data: {
                    requireLogin: false
                }
            })
            .when('/Bo_scagface_factura_pago', {
                templateUrl: './app/view/main/pago.html',
                controller: 'pagoCtrl',
                data: {
                    requireLogin: false
                }
            })
            .when('/Bo_estado_de_cuenta', {
                templateUrl: './app/view/main/estadodecuenta.html',
                controller: 'estadodecuentaCtrl',
                data: {
                    requireLogin: false
                }
            })
            .when('/Bo_estado_de_cuenta_libros', {
                templateUrl: './app/view/main/estadodecuentalibros.html',
                controller: 'estadodecuentalibrosCtrl',
                data: {
                    requireLogin: false
                }
            })
            .when('/Bo_estado_de_cuenta_boleta', {
                templateUrl: './app/view/main/estadodecuentaboleta.html',
                controller: 'estadodecuentaboletaCtrl',
                data: {
                    requireLogin: false
                }
            })
            .when('/Bo_estado_de_cuenta_libros_boleta', {
                templateUrl: './app/view/main/estadodecuentalibrosboleta.html',
                controller: 'estadodecuentalibrosboletaCtrl',
                data: {
                    requireLogin: false
                }
            }).when('/rptGeneral', {
                templateUrl: 'app/view/rptGeneral.html',
                controller: 'rptGeneralCtrl',
                data: {
                  requireLogin: true
                }
            }).otherwise({
                redirectTo: '/',
                data: {
                    requireLogin: true // this property will apply to all children of 'app'
                }
            });
    });

})();
