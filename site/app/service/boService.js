(function () {
	'use strict';
	var app = angular.module('myApp');

	app.factory('AuthenticationService', ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
    function (Base64, $http, $cookieStore, $rootScope, $timeout) {
			var service = {};

			service.Login = function (username, password, callback) {

				/* Dummy authentication for testing, uses $timeout to simulate api call
				 ----------------------------------------------*/
				$timeout(function () {
					var response = {
						success: username === 'test' && password === 'test'
					};
					if (!response.success) {
						response.message = 'Username or password is incorrect';
					}
					callback(response);
				}, 1000);


				/* Use this for real authentication
				 ----------------------------------------------*/
				//$http.post('/api/authenticate', { username: username, password: password })
				//    .success(function (response) {
				//        callback(response);
				//    });

			};

			service.SetCredentials = function (username, password, token, ruta) {
				var authdata = Base64.encode(username + ':' + password);

				$rootScope.globals = {
					currentUser: {
						username: username,
						authdata: authdata,
						token: token,
						ruta: ruta
					}
				};

				$http.defaults.headers.common['Authorization'] = 'Switch ' + token;
				$cookieStore.put('globals', $rootScope.globals);
			};

			service.ClearCredentials = function () {
				$rootScope.globals = {};
				$cookieStore.remove('globals');
				$http.defaults.headers.common.Authorization = 'Basic';
			};

			return service;
    }])

	.factory('Base64', function () {
		/* jshint ignore:start */

		var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

		return {
			encode: function (input) {
				if (!input) input = '';
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;

				do {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output = output +
						keyStr.charAt(enc1) +
						keyStr.charAt(enc2) +
						keyStr.charAt(enc3) +
						keyStr.charAt(enc4);
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
				} while (i < input.length);

				return output;
			},

			decode: function (input) {
				if (!input) input = '';
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;

				// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
				var base64test = /[^A-Za-z0-9\+\/\=]/g;
				if (base64test.exec(input)) {
					window.alert("There were invalid base64 characters in the input text.\n" +
						"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
						"Expect errors in decoding.");
				}
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

				do {
					enc1 = keyStr.indexOf(input.charAt(i++));
					enc2 = keyStr.indexOf(input.charAt(i++));
					enc3 = keyStr.indexOf(input.charAt(i++));
					enc4 = keyStr.indexOf(input.charAt(i++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					output = output + String.fromCharCode(chr1);

					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}

					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";

				} while (i < input.length);

				return output;
			}
		};

	});

	app.service('userService', function ($http, $q, Base64, $rootScope, $cookieStore) {
		this.getCredential = function () {
			/*console.log(window.localStorage['credential']);*/
			var credential = JSON.parse(window.localStorage['easycredential'] || null);
			/*console.log(credential);*/
			if (credential) {
				if (!credential.data) credential.data = {};
				credential.data.username = credential.data.Usuario;
				credential.data.password = Base64.decode(credential.data.Password);
				credential.data.token = credential.data.token;
				credential.data.ruta = credential.data.ruta;
			}
			//console.log(credential);
			return {
				data: (credential || null)
			};
		};

		this.saveCredential = function (user) {
			window.localStorage['easycredential'] = JSON.stringify(user);
		};

		this.clearCredential = function () {
			window.localStorage['easycredential'] = null;
		};

		this.login = function (user) {
			var deferred = $q.defer();
			var urlCalls = [];
			var urls = [];

			urls.push({
				url: './server/main/login'
			});


			var dataObj = {};

			if (user == undefined) {
				dataObj.Usuario = null;
				dataObj.Password = null;
				dataObj.Ruta = null;
			} else {
				dataObj.Usuario = user.username;
				if (user.password)
					dataObj.Password = user.password;
				if (user.ruta)
					dataObj.Ruta = user.ruta;
			}

			/*alert(JSON.stringify(dataObj));*/
			$rootScope.divloading = true;
			angular.forEach(urls, function (url) {
				urlCalls.push($http.post(url.url, dataObj));
			});
			// they may, in fact, all be done, but this
			// executes the callbacks in then, once they are
			// completely finished.
			$q.all(urlCalls)
				.then(
					function (results) {
						$rootScope.divloading = false;
						/*deferred.resolve(
               JSON.stringify(results))*/
						//console.log(results[0].data);
						/*console.log(results[0].data);*/
						deferred.resolve(results[0].data);
					},
					function (errors) {
						$rootScope.divloading = false;
						deferred.reject(errors);
					},
					function (updates) {
						$rootScope.divloading = false;
						deferred.update(updates);
					});
			return deferred.promise;
		};

		this.logout = function (user) {
			var deferred = $q.defer();
			var urlCalls = [];
			var urls = [];

			urls.push({
				url: './server/main/login'
			});
			var dataObj = {};

			if (user == undefined) {
				dataObj.Username = null;
				dataObj.Password = null;
			} else {
				dataObj.Username = user.username;
				dataObj.Password = user.password;
			}

			$rootScope.divloading = true;
			angular.forEach(urls, function (url) {
				urlCalls.push($http.post(url.url, dataObj));
			});
			// they may, in fact, all be done, but this
			// executes the callbacks in then, once they are
			// completely finished.
			$q.all(urlCalls)
				.then(
					function (results) {
						$rootScope.divloading = false;
						/*deferred.resolve(
               JSON.stringify(results))*/
						/*console.log(results[0].data);*/
						deferred.resolve(results[0].data);
					},
					function (errors) {
						$rootScope.divloading = false;
						deferred.reject(errors);
					},
					function (updates) {
						$rootScope.divloading = false;
						deferred.update(updates);
					});
			return deferred.promise;
		};
	});

	app.service('dateService', function ($http, $q) {
		this.getLocalDate = function (d) {
			var copiedDate = d;
			var actualdate = new Date();
			var h = actualdate.getTimezoneOffset() / 60;

			copiedDate.setTime(d.getTime() - (h * 60 * 60 * 1000));
			return copiedDate;
		};
		var serializeJSON = function (prms) {
			angular.forEach(prms, function (value, key) {
				if (typeof prms[key] === 'object') {
					serializeJSON(prms[key]);
				} else {
					if (typeof prms[key] === 'string') {
						if (prms[key].indexOf('Date') != -1) {
							var actualdate = new Date();
							var date = new Date(parseInt(prms[key].replace("/Date(", "").replace(")/", ""), 10));
							var h = actualdate.getTimezoneOffset() / 60;
							date.setTime(date.getTime() - (h * 60 * 60 * 1000));
							if (date.getUTCFullYear() == 1970) {
								prms[key] = null;
							} else {
								prms[key] = date;
							}

						}
					}
				}
			});
			return prms;
		};

		this.serializeJSON = serializeJSON;


		var deserializeJSON = function (prms) {
			angular.forEach(prms, function (value, key) {

				if (prms[key])
					if (prms[key].toString().indexOf('GMT-0600') >= 0) {
						var copiedDate = angular.copy(prms[key], copiedDate);
						var h = copiedDate.getTimezoneOffset() / 60;
						prms[key].setTime(prms[key].getTime() - (h * 60 * 60 * 1000));
					}

				if (typeof prms[key] === 'object') {
					deserializeJSON(prms[key]);
				} else {
					if (prms[key])
						if (prms[key].toString().indexOf('GMT-0600') != -1) {
							var copiedDate = new Date();
							var h = copiedDate.getTimezoneOffset() / 60;
							prms[key].setTime(prms[key].getTime() - (h * 60 * 60 * 1000));
						}
				}
			});
			return prms;
		};

		this.deserializeJSON = deserializeJSON;
	});


	app.service('boService', function ($rootScope, $http, $q, $log, dateService, userService, $location) {
		this.call = function (urls) {
			/*$http.defaults.headers.common.Authorization = 'Switch '+;*/
			var crd = userService.getCredential();

			var deferred = $q.defer();
			var urlCalls = [];

			angular.forEach(urls, function (url) {
				var prms;
				var config = {};
				prms = angular.copy(url.param, prms);
				dateService.deserializeJSON(prms);

				if (prms.action != '') {
					prms.usuario = crd.data.Username;
					prms.fecha = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');

					if ($rootScope.rutaglobal)
						prms.ruta = $rootScope.rutaglobal.replace(prms.usuario + '-', '');
				}
				urlCalls.push($http.post(url.url, prms));
			});

			$rootScope.divloading = true;
			$rootScope.globals.alerts = [];

			$q.all(urlCalls)
				.then(
					function (results) {
						$rootScope.divloading = false;

						if (urlCalls.length != 0) {
							angular.forEach(results, function (res) {
								if (res.data.success == true) {
									dateService.serializeJSON(results);
									deferred.resolve(results);
								} else {
									if (res.data.code == 403)
										$location.path('/login');
									$rootScope.globals.alerts.push({
										type: 'danger',
										msg: res.data.msg,
										data: res.data
									});
								}
							});

							if ($rootScope.globals.alerts)
								if ($rootScope.globals.alerts.length > 0) {
									var win = $('#my-alert-window');
									win.trigger('click');
									/*console.log($rootScope.globals.alerts);*/
								}
						}

					},
					function (errors) {
						$rootScope.divloading = false;
						deferred.reject(errors);
						console.log(errors);
					},
					function (updates) {
						$rootScope.divloading = false;
						deferred.update(updates);
					});
			return deferred.promise;
		};

		this.saveImg = function (urls) {
			var deferred = $q.defer();
			var urlCalls = [];

			angular.forEach(urls, function (url) {
				urlCalls.push($http.post(url.url, url.params));
			});
			// they may, in fact, all be done, but this
			// executes the callbacks in then, once they are
			// completely finished.
			$q.all(urlCalls)
				.then(
					function (results) {
						/*deferred.resolve(
               JSON.stringify(results))*/
						if (results[0].data.success === true) {
							//console.log(results[0].data);
							deferred.resolve(results[0].data);
						} else {
							console.log(results);
							angular.forEach(results, function (res) {
								$rootScope.globals.alerts.push({
									type: 'danger',
									msg: res.data.msg
								});
							});
						}
					},
					function (errors) {
						deferred.reject(errors);
						//console.log(errors);
					},
					function (updates) {
						deferred.update(updates);
						//console.log(updates);
					});
			return deferred.promise;
		};
	});

	app.service('fileService', function ($rootScope, $http, $q, dateService) {
		this.call = function (urls) {
			var deferred = $q.defer();
			var urlCalls = [];

			angular.forEach(urls, function (url) {
				var prms;
				var config = {};
				var iframe = null;
				prms = angular.copy(url.param, prms);
				config = url.config;

				urlCalls.push($http.post(url.url, prms, config));
			});

			$rootScope.divloading = true;
			$rootScope.alerts = [];

			$q.all(urlCalls)
				.then(
					function (results) {
						var data = results[0].data;
						$rootScope.divloading = false;

						var blob = null,
							blob_url = null;
						blob = new window.Blob([data], {
							type: 'application/pdf'
								/*type: 'text/plain'*/
						});

						blob_url = window.URL.createObjectURL(blob);
						console.log(blob_url);

						deferred.resolve(blob_url);
					},
					function (errors) {
						$rootScope.divloading = false;
						deferred.reject(errors);
						/*console.log(errors);*/
					},
					function (updates) {
						$rootScope.divloading = false;
						deferred.update(updates);
						/*console.log(updates);*/
					});
			return deferred.promise;
		};

	});


	app.service('menuService', function ($rootScope, $filter) {
		var me = this;

		me.prepareMenu = function (menu, esmenu) {
			me.dataForTheTree = [];
			if (esmenu == 1) menu = $filter('filter')(menu, function (itm) {
				return (itm.Esmenu == 1)
			});
			me.menus = $filter('filter')(menu, function (itm) {
				return (parseInt(itm.Idparent) == 0);
			});

			angular.forEach(me.menus, function (menuitm) {
				me.dataForTheTree.push(menuitm);
				me.prepareSubMenu(menuitm, menu);
			});
			return me.dataForTheTree;
			/*$log.info(menu);*/
		};

		me.prepareSubMenu = function (menu, pmenus) {
			var children = [];

			children = $filter('filter')(pmenus, function (itm) {
				return (itm.Idparent == menu.Idmenu);
			});

			angular.forEach(children, function (itm) {
				me.prepareSubMenu(itm);
			});

			if (children)
				menu.children = children;
		};
	});

	app.service('fileServicePHP', function ($rootScope, $http, $q, dateService) {
		this.call = function (urls) {
			var deferred = $q.defer();
			var urlCalls = [];
			var mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

			angular.forEach(urls, function (url) {
				var prms;
				var config = {};
				var iframe = null;

				if (url.type) mime = url.type;
				prms = angular.copy(url.param, prms);
				config = url.config;

				/*var req = {
					method: 'POST',
					url: url.url,
					headers: {
						"Accept":"application/json;charset=utf-8",
					},
					data: prms
				};*/

				urlCalls.push($http.post(url.url, prms, config));
				/*urlCalls.push($http(req));*/
				
			});

			$rootScope.divloading = true;
			$rootScope.alerts = [];

			$q.all(urlCalls)
				.then(
					function (results) {
						var data = results[0].data;
						$rootScope.divloading = false;

						var blob = null,
							blob_url = null;
						blob = new window.Blob([data], {
							type: mime
							//type: 'text/plain'
						});

						blob_url = window.URL.createObjectURL(blob);
						console.log(blob_url);

						deferred.resolve(blob_url);
					},
					function (errors) {
						$rootScope.divloading = false;
						deferred.reject(errors);
						/*console.log(errors);*/
					},
					function (updates) {
						$rootScope.divloading = false;
						deferred.update(updates);
						/*console.log(updates);*/
					});
			return deferred.promise;
		};

	});

}());
