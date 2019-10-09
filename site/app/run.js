(function () {
    'use strict';
    var app = angular.module('myApp');

    /*
        $log.log(message)
        $log.warn(message)
        $log.info(message)
        $log.error(message)
        $log.debug(message)
    */

    app.run(function ($log, $rootScope, $location, $timeout, $window, userService, AuthenticationService, $cookieStore, $http, Base64) {
        /*02MAR2016 EJCP GLOBALS*/
        $rootScope.globals = $cookieStore.get('globals') || {};
        $rootScope.filepath = './server/main/uploads/';
        $rootScope.fileuploadurl = 'upload';
        $rootScope.filebo = 'server/main/bo/';
		    $rootScope.filehost = 'http://localhost:3061';

        (!$rootScope.globals ? $rootScope.globals = {} : $rootScope.globals);
        $rootScope.booleanOptions = [{
                id: 0,
                name: 'FALSO'
        },
            {
                id: 1,
                name: 'VERDADERO'
        }];

        $rootScope.sexoOptions = [{
                id: 0,
                name: 'Femenino'
        },
        {
                id: 1,
                name: 'Masculino'
        },
        {
                id: 2,
                name: 'Ambos'
        }];

        $rootScope.globaltipocliente = [{
                id: 0,
                name: 'Ninguno'
        },{
                id: 1,
                name: 'Seguro'
        },{
                id: 2,
                name: 'Terceros'
        }];

        $rootScope.imageglobalpath = './images/';

        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.autenticated = false;

        /*02MAR2016 EJCP GLOBALS*/



        $rootScope.login = function (puser, fn) {
            if (puser) {
                puser.password = Base64.encode(puser.password);
                userService.login(puser).then(function (data) {
                    /*$window.alert(JSON.stringify(data));*/
                    console.log('autenticando...');

                    var usrdata = data;

                    if (data.success === true) {
                        $rootScope.logedin = true;
                        $rootScope.autenticated = true;
                        $rootScope.user = puser;
						            $rootScope.rutaglobal = usrdata.Username + '-' + usrdata.Ruta;
                        AuthenticationService.SetCredentials(usrdata.Usuario, usrdata.Password, usrdata.token, usrdata.ruta);
                        userService.saveCredential(usrdata);

                        console.log($location.path());
                        if($location.path() == '/' || $location.path() == '/login')
                        $location.path('/home');
                    } else {

                        puser.password = Base64.decode(puser.password);
                        $rootScope.logedin = false;
                        $rootScope.autenticated = false;
                        /*$rootScope.user = undefined;*/
                        AuthenticationService.ClearCredentials();
                        userService.clearCredential();

                        $rootScope.globals.alerts = [];
                        $rootScope.globals.alerts.push({
                            type: 'danger',
                            msg: data.msg,
                            data: data
                        });

                        if ($rootScope.globals.alerts.length > 0 && $location.path() != '/') {
                            var win = $('#my-alert-window');
                            win.trigger('click');
                            /*console.log($rootScope.globals.alerts);
                            console.log($location.path());*/
                        }

                        if($rootScope.logedin == false && $location.path() != '/' && $location.path() != '/login'){
                            $location.path('/login');
                        }
                        //$window.location.href = 'http://localhost/order/login';
                        //$location.path('ajax/page_login.html');
                    }

                    $rootScope.$on("$routeChangeStart", function (event, next, current) {
                        /*waitingDialog.show('Por favor espere...', {
                            dialogSize: 'md',
                            progressType: 'info'
                        });*/
                    });

                    $rootScope.$on('$routeChangeSuccess', function (event, toState, toParams) {
                        /*$timeout(function () {
                            waitingDialog.hide();
                        }, 1000);*/

                        var requireLogin;
                        var mypath = $location.path().substring(1) || '/login';

                        if (toState.data)
                            requireLogin = toState.data.requireLogin;

                        $rootScope.requireLogin = requireLogin;

                        if (requireLogin && !$rootScope.logedin && mypath != '/login') {
                            //event.preventDefault();
                            $location.path('/login');
                        } else {

                        }

                    });


                    if (fn)
                        fn($rootScope.logedin);
                    //console.log(data);
                }, function (error) {
                    console.log(error);
                });
            } else {

                var mypath = $location.path().substring(1);

                if(mypath != '/login'){
                    $location.path('/login');
                }

                $rootScope.$on('$routeChangeSuccess', function (event, toState, toParams) {
                    /*$timeout(function () {
                        waitingDialog.hide();
                    }, 1000);*/

                    var requireLogin;
                    var mypath = $location.path().substring(1) || '/login';

                    if (toState.data)
                        requireLogin = toState.data.requireLogin;

                    $rootScope.requireLogin = requireLogin;

                    if (requireLogin && !$rootScope.logedin && mypath != '/login') {
                        //event.preventDefault();
                        $location.path('/login');
                    } else {

                    }

                });
            }
        };

        var credential = userService.getCredential();
        var ppuser = (!credential.data ? {Username: -1, Password: -1, success: false} : credential.data.data);

        $rootScope.login((!$rootScope.user ? ppuser : $rootScope.user));
        $rootScope.logout = function () {
            userService.logout().then(function (data) {
                $rootScope.logedin = false;
                $rootScope.autenticated = false;
                $rootScope.user = undefined;
                userService.clearCredential();
                //console.log(data);
                $location.path('/login');
            }, function (error) {
                console.log(error);
            });
        };
        $log.info('run');
    });

}());
