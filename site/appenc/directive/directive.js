(function () {
	'use strict';
	var app = angular.module('myApp');

	app.directive('mySearchFieldEasyTwo', function ($uibModal, $log, $filter) {
		return {
			restrict: 'E',
			template: '<div class="row">' +
				'<div class="col-sm-12">' +
				'<div class="input-group">' +
				'<input type="text" class="form-control" value="{{val}}">' +
				'<div class="input-group-btn">' +
				'<button type="button" ng-click="clear()" class="btn btn-default" aria-label="Help">' +
				'<span class="glyphicon glyphicon-remove"></span>' +
				'</button> <button type="button" ng-click="fnClick()" class="btn btn-default">Buscar</button>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>',
			replace: true,
			require: 'ngModel',
			scope: {
				fnClick: '=?',
				fnKeyPress: '&',
				arrSearch: '=?',
				arrFields: '=?',
				arrRenderFields: '=?',
				val: '=?',
				str: '=?'
			},
			link: function (scope, element, attrs, model) {
				element.bind("keypress", function (event) {
					if (event.keyCode == 13) {

						var itm;
						itm = $filter('filter')(scope.arrSearch, scope.q, true);

						if (itm) {
							if (itm.length > 0) {
								scope.selectedrecord = itm[0];
								model.$setViewValue(scope.selectedrecord);
								scope.fnKeyPress();
							}
						}
						$(element).find('input')[0].select();
					}
				});

				scope.fnClick = function () {
					var modalInstance = $uibModal.open({
						/*animation: $scope.animationsEnabled,*/
						templateUrl: 'app/view/my-search-field/tpl/search.html?dt=' + (new Date()).getTime(),
						controller: 'mySearchFieldModalController',
						size: 'lg',
						resolve: {
							data: function () {
								return (scope.arrSearch);
							},
							fields: function () {
								return (scope.arrFields);
							}
						}
					});

					modalInstance.result.then(function (record) {
						scope.selectedrecord = record;
						scope.q = scope.selectedrecord[scope.arrRenderFields[0]];
						model.$setViewValue(scope.selectedrecord);
					}, function (err) {

					});
				};

				scope.clear = function () {
					model.$setViewValue(null);
				};

				scope.$watch(
					function () {
						return model.$modelValue;
					},
					function (newValue) {

						var str = '';

						angular.forEach(scope.arrRenderFields, function (itm) {
							if (model.$modelValue) {
								str = str + model.$modelValue[itm];
								str = str + ' ';
							} else {
								str = '';
							}
						});

						scope.val = str;
					});
			}
		}
	});

	app.directive('mySearchFieldEasy', function ($uibModal, $log, $filter) {
		return {
			restrict: 'E',
			template: '<div class="row">' +
				'<div class="col-sm-4"><input type="text" class="form-control" ng-model="q"></div>' +
				'<div class="col-sm-8">' +
				'<div class="input-group">' +
				'<input type="text" class="form-control" value="{{val}}">' +
				'<div class="input-group-btn">' +
				'<button type="button" ng-click="clear()" class="btn btn-default" aria-label="Help">' +
				'<span class="glyphicon glyphicon-remove"></span>' +
				'</button> <button type="button" ng-click="fnClick()" class="btn btn-default">Buscar</button>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>',
			replace: true,
			require: 'ngModel',
			scope: {
				fnClick: '=?',
				fnKeyPress: '&',
				arrSearch: '=?',
				arrFields: '=?',
				arrRenderFields: '=?',
				val: '=?',
				str: '=?'
			},
			link: function (scope, element, attrs, model) {
				element.bind("keypress", function (event) {
					if (event.keyCode == 13) {

						var itm;
						itm = $filter('filter')(scope.arrSearch, scope.q, true);

						if (itm) {
							if (itm.length > 0) {
								scope.selectedrecord = itm[0];
								model.$setViewValue(scope.selectedrecord);
								scope.fnKeyPress();
							}
						}
						$(element).find('input')[0].select();
					}
				});

				scope.fnClick = function () {
					var modalInstance = $uibModal.open({
						/*animation: $scope.animationsEnabled,*/
						templateUrl: 'app/view/my-search-field/tpl/search.html?dt=' + (new Date()).getTime(),
						controller: 'mySearchFieldModalController',
						size: 'lg',
						resolve: {
							data: function () {
								return (scope.arrSearch);
							},
							fields: function () {
								return (scope.arrFields);
							}
						}
					});

					modalInstance.result.then(function (record) {
						scope.selectedrecord = record;
						scope.q = scope.selectedrecord[scope.arrRenderFields[0]];
						model.$setViewValue(scope.selectedrecord);
					}, function (err) {

					});
				};

				scope.clear = function () {
					model.$setViewValue(null);
				};

				scope.$watch(
					function () {
						return model.$modelValue;
					},
					function (newValue) {

						var str = '';

						angular.forEach(scope.arrRenderFields, function (itm) {
							if (model.$modelValue) {
								str = str + model.$modelValue[itm];
								str = str + ' ';
							} else {
								str = '';
							}
						});

						scope.val = str;
					});
			}
		}
	});

	app.directive('fancybox', function ($compile, $http) {
		return {
			restrict: 'A',

			controller: function ($scope, $rootScope) {
				$scope.openFancybox = function (url) {
					if (url) {
						url = $rootScope.filepath + url + '?t' + (new Date()).getTime();
						$scope.fancyboxurl = url;
						$http.get('./app/view/template.html').then(function (response) {
							if (response.status == 200) {

								var template = angular.element(response.data);
								var compiledTemplate = $compile(template);
								compiledTemplate($scope);

								$.fancybox.open({
									content: template,
									type: 'html'
								});
							}
						});
					}
				};
			}
		};
	});

	app.filter('boolText',
		function boolText() {
			return function (boolValue) {
				if (parseInt(boolValue) === 1)
					return "Activo";
				else
					return "Inactivo";
			}
		});

	app.filter('dateText',
		function dateText() {
			return function (dateValue) {
				try {
					var retVal;
					var momentObj = moment(dateValue.substring(0, 19).replace('T', ''), 'YYYY-MM-DDTHH:mm:ss.SSSSZ');
					if (momentObj.isValid() == true) {
						retVal = momentObj.format('DD/MM/YYYY HH:mm');
						return retVal;
					} else {
						momentObj = moment(dateValue.substring(0, 19), 'YYYY-MM-DD HH:mm:ss');
						if (momentObj.isValid()) {
							retVal = momentObj.format('DD/MM/YYYY HH:mm');
							return retVal;
						} else {
							return dateValue;
						}
					}
				} catch (e) {
					return dateValue;
				}
			}
		});

	app.directive('handsontable', function ($timeout, $filter) {
		return {
			restrict: 'A',
			scope: {
				data: '=',
				headers: '=',
				mergeCells: '=',
				onCellChangeFn: '&'
			},
			replace: true,
			template: "<div style=\"width:100%; height:300px; overflow: hidden;\"></div>",
			link: function (scope, elem, attrs) {
				scope.colWidths = [];
				scope.originalColWidths = [];
				scope.el = $(elem);

				scope.hotrender = function (instance, td, row, col, prop, value, cellProperties) {
					if (td.className != 'formula') {
						Handsontable.renderers.TextRenderer.apply(scope.el, arguments);
						if (prop == 'Genero' && value == 'M') {
							td.className = 'hot-bg-blue';
						}
						if (prop == 'Genero' && value == 'F') {
							td.className = 'hot-bg-pink';
						}
					}
				};

				scope.hotrendereditable = function (instance, td, row, col, prop, value, cellProperties) {
					if (td.className != 'formula') {
						Handsontable.renderers.TextRenderer.apply(scope.el, arguments);
						td.className = 'hot-bg-gray';
					}
				};

				scope.hotrenderhidden = function (instance, td, row, col, prop, value, cellProperties) {
					if (td.className != 'formula' && scope.colWidths[col] != 0.1) {
						Handsontable.renderers.TextRenderer.apply(scope.el, arguments);
						scope.colWidths[col] = 0.1;
					}
				};

				scope.hotrenderstatic = function (instance, td, row, col, prop, value, cellProperties) {
					if (td.className != 'formula') {
						Handsontable.renderers.TextRenderer.apply(scope.el, arguments);
						td.className = 'hot-bg-green';
					}
				};

				scope.hotrendercustom = function (instance, td, row, col, prop, value, cellProperties) {
					Handsontable.cellTypes['formula'].renderer.apply(this, arguments);
				};

				scope.$on('hotupdateExport', function (event, args) {
					/*console.log('hotupdateExport');*/
					var tableData = scope.el.getData();
					console.log(tableData);
					var csv = scope.convert2dArrayToCsv(tableData);
					window.open('data:application/vnd.ms-excel,' + encodeURIComponent(csv));
				});

				Handsontable.helper.isArray = function (obj) {
					return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) == '[object Array]';
				};

				scope.SelectEditor = Handsontable.editors.BaseEditor.prototype.extend();
				scope.SelectEditor.prototype.init = function () {
					this.select = document.createElement('SELECT');
					Handsontable.Dom.addClass(this.select, 'htSelectEditor');
					this.select.style.display = 'none';

					this.instance.rootElement.appendChild(this.select);
				};


				scope.SelectEditor.prototype.prepare = function () {

					Handsontable.editors.BaseEditor.prototype.prepare.apply(this, arguments);

					var selectOptions = this.cellProperties.selectOptions;
					var options;

					if (typeof selectOptions == 'function') {
						options = this.prepareOptions(selectOptions(this.row,
							this.col, this.prop))
					} else {
						options = this.prepareOptions(selectOptions);
					}
					Handsontable.Dom.empty(this.select);

					for (var option in options) {
						if (options.hasOwnProperty(option)) {
							var optionElement = document.createElement('OPTION');
							optionElement.value = option;
							Handsontable.Dom.fastInnerHTML(optionElement, options[option]);
							this.select.appendChild(optionElement);
						}
					}
				};

				scope.SelectEditor.prototype.prepareOptions = function (optionsToPrepare) {
					var preparedOptions = {};

					if (Handsontable.helper.isArray(optionsToPrepare)) {
						for (var i = 0, len = optionsToPrepare.length; i < len; i++) {
							preparedOptions[optionsToPrepare[i].value] = optionsToPrepare[i].name;
						}
					} else if (typeof optionsToPrepare == 'object') {
						preparedOptions = optionsToPrepare;
					}
					return preparedOptions;
				};

				scope.SelectEditor.prototype.getValue = function () {
					return this.select.value;
				};

				scope.SelectEditor.prototype.setValue = function (value) {
					this.select.value = value;
				};

				scope.SelectEditor.prototype.open = function () {
					var width = Handsontable.Dom.outerWidth(this.TD);
					var height = Handsontable.Dom.outerHeight(this.TD);
					var rootOffset = Handsontable.Dom.offset(this.instance.rootElement);
					var tdOffset = Handsontable.Dom.offset(this.TD);


					this.select.style.height = height + 'px';
					this.select.style.minWidth = width + 'px';


					this.select.style.top = tdOffset.top - rootOffset.top + 'px';
					this.select.style.left = tdOffset.left - rootOffset.left + 'px';
					this.select.style.margin = '0px';


					this.select.style.display = '';
				};

				scope.SelectEditor.prototype.close = function () {
					this.select.style.display = 'none';
				};

				scope.SelectEditor.prototype.focus = function () {
					this.select.focus();
				};

				scope.convert2dArrayToCsv = function (arr) {
					return arr.reduce(function (csvString, row) {
						csvString += row.join(',');
						csvString += ';';
						return csvString;
					}, '');
				};

				scope.getRowsFromObjects = function (queryResult) {
					var rows = [];
					for (var i = 0, l = queryResult.length; i < l; i++) {
						rows.push(queryResult[i].row);
					}
					return rows;
				};

				scope.$on('hotfilter', function (event, args) {
					try {
						console.log(args.searchFields);
						if (args.searchFields)
							if (args.searchFields.length > 0) {
								var mydata = angular.copy(args.data, mydata);
								var fields = args.searchFields;
								var filtered = [];

								angular.forEach(fields, function (itm) {
									var filteritm;
									filteritm = $filter('filter')(mydata, itm);

									angular.forEach(filteritm, function (itm2) {
										filtered.push(itm2);
									});
								});

								scope.el.selectCell(0, 0);
								scope.el.loadData(filtered);
							} else {
								var mydata = angular.copy(args.data, mydata);
								scope.el.selectCell(0, 0);
								scope.el.loadData(mydata);
							}
					} catch (e) {
						console.log('Error hotsearchField filter');
						console.log(e.stack);
					}
				});

				scope.$on('hotupdateSettings', function (event, args) {
					scope.colWidths = [];
					scope.originalColWidths = [];

					try {
						scope.el.destroy();
					} catch (e) {

					}

					scope.el = $(elem);
					scope.el = Handsontable(scope.el[0], {
						rowHeaders: true,
						contextMenu: false,
						data: args.data,
						colHeaders: args.headers,
						columns: args.columns,
						fixedColumnsLeft: 4,
						mergeCells: scope.mergeCells,
						afterChange: function (changes, source) {
							var cg = changes,
								sr = source;

							if (cg)
								scope.onCellChangeFn({
									changes: cg,
									source: sr,
									datarow: this.getDataAtRow(cg[0][0])
								});

							scope.el = this;
							scope.el.render();
						},
						formulas: true
					});


					if (scope.el.getData()[0])
							for (var i = 0, l = scope.el.getData()[0].length; i < l; i++) {
									var isColHidden = false;
									/*console.log(i);*/
									try {
											for (var y = 0; y < args.hiddenCols.length; y++) {
													/*console.log('i:y'+i+':'+args.hiddenCols[y]);*/
													if (parseInt(i) == parseInt(args.hiddenCols[y])) {
															isColHidden = true;
															/*console.log('isColHidden');*/
													}
											}
									} catch (e) {

									}

									if (isColHidden == false) {
											scope.originalColWidths.push(scope.el.getColWidth(i));
									} else {
											scope.originalColWidths.push(0.1);
									}
							}

					scope.colWidths = scope.originalColWidths.slice();

					scope.el.updateSettings({
						colWidths: scope.colWidths,
						cells: function (row, col, prop) {
							var cellProperties = {};
							if (prop == 'Precio') {
								cellProperties.editor = 'text';
								return cellProperties;

								/*if (tipo == 'cualitativa') {
									cellProperties.editor = scope.SelectEditor;
									cellProperties.selectOptions = args.options;
									return cellProperties;
								}

								if (tipo == 'cuantitativa') {
									cellProperties.renderer = Handsontable.NumericRenderer,
										cellProperties.editor = Handsontable.editors.TextEditor,
										cellProperties.validator = Handsontable.NumericValidator
									return cellProperties;
								}*/

							}
							if (prop == 'Pagar') {
								cellProperties.type = 'checkbox';
								return cellProperties;
							}

							cellProperties.editor = false;
							return cellProperties;

						},
						afterUpdateSettings: function () {
							console.log('after update settings.');
							scope.el.render();
						},
						afterLoadData: function () {
							scope.el.render();
						}
					});

					scope.el.render();

				});

			}
		}
	});

	app.directive('myHook', function ($timeout, $rootScope) {
		function link(scope, element, attrs) {
			$timeout(function () {
				scope.$emit("MyTestHook");
			}, 500);
		}

		return {
			link: link
		};
	});

	app.directive('ngConfirmMessage', [function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.on('click', function (e) {
					var message = attrs.ngConfirmMessage || "Esta seguro?";
					if (!confirm(message)) {
						e.stopImmediatePropagation();
					}
				});
			}
		}
    }]);


	app.directive('myScrollDiv', function ($timeout) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {
				$timeout(function () {
					var $targetElement = $(element);
					$('document').ready(function () {
						var wHeight = $(window).height();
						var nBar = $('nav.navbar');

						if (nBar)
							wHeight = parseInt(wHeight) - parseInt(nBar.height() + 150);

						$targetElement.css({
							'height': wHeight + 'px',
							'width': '100%'
								/*,
								                            'overflow-x': 'scroll'*/
						});

					});

					scope.$watch(function () {
						return ngModel.$modelValue;
					}, function (newValue) {

					});
				}, 0);
			}
		}
	});

	app.directive('checkList', function ($filter) {
		return {
			scope: {
				list: '=checkList',
				value: '@'
			},
			link: function (scope, elem, attrs) {
				var handler = function (setup) {
					(!scope.list ? scope.list = [] : scope.list);
					var checked = elem.prop('checked');
					var index = scope.list.indexOf(scope.value);

					if (checked && index == -1) {
						if (setup) elem.prop('checked', false);
						else {
							scope.value = angular.fromJson(scope.value);
							if (scope.value.UniqueSelection == 1) {
								scope.list = [];
							} else {
								var UniqueSelections = [];
								UniqueSelections = $filter('filter')(scope.list, function (itm) {
									return (itm.UniqueSelection == 1)
								});

								angular.forEach(UniqueSelections, function (itm) {
									var nindex = scope.list.indexOf(itm);
									scope.list.splice(nindex, 1);
								});
							}

							scope.list.push(scope.value);
						}
					} else if (!checked && index != -1) {
						if (setup) elem.prop('checked', true);
						else {
							scope.list.splice(index, 1);
						}
					}

				};

				var setupHandler = handler.bind(null, true);
				var changeHandler = handler.bind(null, false);

				elem.bind('change', function () {
					scope.$apply(changeHandler);
				});
				scope.$watch('list', setupHandler, true);
			}
		};
	});

	app.directive('checkImage', function ($q, $rootScope) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				attrs.$observe('ngSrc', function (ngSrc) {
					var deferred = $q.defer();
					var image = new Image();
					image.onerror = function () {
						deferred.resolve(true);
						element.attr('src', $rootScope.filepath + '../../../images/noimage.png');
					};
					image.onload = function () {
						deferred.resolve(true);
					};
					image.src = ngSrc;
					return deferred.promise;
				});
			}
		};
	});

	app.directive('myDatepicker', function ($timeout, $log, $filter) {
		return {
			restrict: 'A',
			require: 'ngModel',
			template: '<input type="text" editable="false" value="{{dtpDate | date: \'dd/MM/yyyy HH:mm:ss\'}}" class="form-control input-sm"/>',
			scope: {
				dtpval: '=?',
				dtpenabled: '=?'
			},
			link: function (scope, element, attrs, ngModel) {
				$timeout(function () {
					$.datetimepicker.setLocale('es');
					/*console.log($.datetimepicker);*/

					/*$.datetimepicker.regional.es = angular.copy($.datepicker.regional['en'], $.datepicker.regional['es']);
                    $.datetimepicker.regional.es.closeText = 'Cerrar';
                    $.datetimepicker.regional.es.currentText = 'Hoy';
                    $.datetimepicker.regional.es.dayNames = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
                    $.datetimepicker.regional.es.dayNamesMin = ['Do','Lu','Ma','Mi','Ju','Vi','Sa'];
                    $.datetimepicker.regional.es.dayNamesShort = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
                    $.datetimepicker.regional.es.monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre', 'Octubre','Noviembre','Diciembre'];
                    $.datetimepicker.regional.es.monthNamesShort = ['Ener','Febr','Marz','Abri','Mayo','Juni','Juli','Agos','Sept', 'Octu','Novi','Dici'];

                    $.datetimepicker.setDefaults($.datetimepicker.regional.es);*/




					scope.dtpenabled = ((attrs.dtpenabled == true || !attrs.dtpenabled) ? true : false);


					$.datepicker.setDefaults($.datepicker.regional['es']);
					var $targetSelects = $(element);
					$targetSelects.datetimepicker({
						format: 'Y/m/d H:i:s',
						inline: false,
						disable: !scope.dtpenabled
					});


					$targetSelects.on('change', function (dtp) {
						if (scope.dtpenabled != false) {
							var val = $(this).val();
							ngModel.$setViewValue(val);
						}
					});

					$($targetSelects.find('input')).on('change', function () {
						var newValue = $($targetSelects.find('input')).val();
						var momentVal = moment(newValue, 'DD/MM/YYYY HH:mm:ss');

						if (momentVal.isValid() != false) {
							newValue = $filter('date')(momentVal._d, 'yyyy/MM/dd HH:mm:ss');
							$targetSelects.val(newValue);
							ngModel.$setViewValue(newValue);
						}
					});

					scope.$watch(
						function () {
							$targetSelects.find('input').attr('disabled', !scope.dtpenabled);
							return ngModel.$modelValue;
						},
						function (newValue) {
							$targetSelects.find('input').attr('disabled', !scope.dtpenabled);
							if (newValue) {
								scope.dtpval = newValue;
								scope.dtpDate = moment(newValue, 'YYYY-MM-DD HH:mm:ss')._d;
								/*$targetSelects.datetimepicker('refresh');*/
							}
						}
					);

				}, 0);
			}
		}
	});

	app.directive('fancySelect', function ($timeout) {
		return {
			restrict: 'E',
			require: 'ngModel',
			replace: true,
			template: '<select class="form-control input-sm"></select>',
			link: function (scope, element, attrs, ngModel) {
				$timeout(function () {
					var $targetSelects = $(element),
						selectConfig = {
							theme: "bootstrap",
							downArrowIcon: "arrow",
							showFirstOption: true
						};

					function onOpen(event) {
						/*$(this).data('selectBoxSelectBoxIt').list.perfectScrollbar();
						$(this).data('selectBoxSelectBoxIt').dropdown.perfectScrollbar();
						$targetSelects.selectBoxIt('refresh');*/
					}

					function onClose(event) {

					}

					/*$targetSelects.selectBoxIt();*/
					$targetSelects.on({
						"open": onOpen,
						"close": onClose
					});

					scope.$watch(function () {
						return ngModel.$modelValue;
					}, function (newValue) {
						/*$targetSelects.selectBoxIt('refresh');*/
					});

				}, 0);
			}
		}
	});

	app.directive('userMenu', function ($timeout) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs, ngModel) {
				$timeout(function () {
					var menu = $(element);
					menu.click(function(){
						$(this).toggleClass('show');
					});
					menu.mouseleave(function(){
						$(this).removeClass("show");
					});
				}, 0);
			}
		}
	});

	app.filter('adjustDatepicker', ['$filter', function ($filter) {
		var dateFilter = $filter('date');
		return function (dateToFix) {
			var localDate, localTime, localOffset, adjustedDate;

			localDate = new Date(dateToFix);
			localTime = localDate.getTime();
			localOffset = localDate.getTimezoneOffset() * 60000;
			adjustedDate = new Date(localTime + localOffset);

			return adjustedDate;
		};
    }]);

	app.filter('randomSrc', function () {
		return function (input) {
			if (input)
				return input + '?r=' + Math.round(Math.random() * 999999);
		}
	})

	app.directive('myCheckbox', function () {
		return {
			restrict: 'E',
			template: '<div class="my-checkbox" ng-class="{\'checked\': isChecked}" ng-click="toggle();"></div>',
			replace: true,
			require: 'ngModel',
			scope: {
				isChecked: '=?'
			},
			link: function (scope, element, attrs, model) {

				model.$formatters.unshift(function (value) {
					scope.isChecked = value == true;
					return (scope.isChecked ? 1 : 0);
				});

				scope.toggle = function () {
					scope.isChecked = !scope.isChecked;
					model.$setViewValue((scope.isChecked ? 1 : 0));
				}
			}
		};
	});

	app.directive('myCheckboxD', function () {
		return {
			restrict: 'E',
			template: '<div class="my-checkbox" ng-class="{\'checked\': isChecked}" ng-click="toggle();"></div>',
			replace: true,
			require: 'ngModel',
			scope: {
				isChecked: '=?',
				onChangeEvent: '&'
			},
			link: function (scope, element, attrs, model) {

				model.$formatters.unshift(function (value) {
					scope.isChecked = value == true;
					return (scope.isChecked ? 1 : 0);
				});

				scope.toggle = function () {
					scope.isChecked = !scope.isChecked;
					model.$setViewValue((scope.isChecked ? 1 : 0));
					scope.onChangeEvent();
				}
			}
		};
	});

	app.directive('myNumericInput', function () {
		return {
			restrict: 'A',
			template: '<input type="text" placeholder="">',
			replace: true,
			require: 'ngModel',
			scope: {
				nivalue: '=?'
			},
			link: function (scope, element, attrs, model) {
				var $targetElement = $(element);

				$targetElement.on('change', function () {
					var tval = $targetElement.val();
					scope.nivalue = tval;
					model.$setViewValue(tval);
				});

				scope.$watch(
					function () {
						return model.$modelValue;
					},
					function (newValue) {
						scope.nivalue = model.$modelValue;
					});
			}
		};
	});

	app.directive('mySearchField', function ($uibModal, $log) {
		return {
			restrict: 'E',
			template: '<div class="input-group"> <input type="text" class="form-control" value="{{val}}" disabled> <div class="input-group-btn"> <button type="button" ng-click="clear()" class="btn btn-default" aria-label="Help"><span class="glyphicon glyphicon-remove"></span></button> <button type="button" ng-click="fnClick()" class="btn btn-default">Buscar</button> </div> </div>',
			replace: true,
			require: 'ngModel',
			scope: {
				fnClick: '=?',
				arrSearch: '=?',
				arrFields: '=?',
				arrRenderFields: '=?',
				val: '=?',
				str: '=?'
			},
			link: function (scope, element, attrs, model) {
				scope.fnClick = function () {
					var modalInstance = $uibModal.open({
						/*animation: $scope.animationsEnabled,*/
						templateUrl: 'app/view/my-search-field/tpl/search.html?dt=' + (new Date()).getTime(),
						controller: 'mySearchFieldModalController',
						size: 'lg',
						resolve: {
							data: function () {
								return (scope.arrSearch);
							},
							fields: function () {
								return (scope.arrFields);
							}
						}
					});

					modalInstance.result.then(function (record) {
						scope.selectedrecord = record;
						model.$setViewValue(scope.selectedrecord);
					}, function (err) {

					});
				};

				scope.clear = function () {
					model.$setViewValue(null);
				};

				scope.$watch(
					function () {
						return model.$modelValue;
					},
					function (newValue) {

						var str = '';

						angular.forEach(scope.arrRenderFields, function (itm) {
							if (model.$modelValue) {
								str = str + model.$modelValue[itm];
								str = str + ' ';
							} else {
								str = '';
							}
						});

						scope.val = str;
					});
			}
		}
	});

	app.filter('mapAnswer', function () {
		var ansHash = {
			0: 'FALSO',
			1: 'VERDADERO'
		};

		return function (input) {
			if (!input) {
				return 0;
			} else {
				return ansHash[input];
			}
		};
	});

	app.filter('griddropdown', function () {
		return function (input, context) {
			if (context.col) {
				var map = context.col.colDef.editDropdownOptionsArray;
				var idField = context.col.colDef.editDropdownIdLabel;
				var valueField = context.col.colDef.editDropdownValueLabel;
				var initial = context.row.entity[context.col.field];
				if (typeof map !== "undefined") {
					for (var i = 0; i < map.length; i++) {
						if (map[i][idField] == input) {
							return map[i][valueField];
						}
					}
				} else if (initial) {
					return initial;
				}
				return input;
			} else {
				return input;
			}
		};

	});

	app.filter('propsFilter', function () {
		return function (items, props) {
			var out = [];

			if (angular.isArray(items)) {
				var keys = Object.keys(props);

				items.forEach(function (item) {
					var itemMatches = false;

					for (var i = 0; i < keys.length; i++) {
						var prop = keys[i];
						var text = props[prop].toLowerCase();
						if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
							itemMatches = true;
							break;
						}
					}

					if (itemMatches) {
						out.push(item);
					}
				});
			} else {
				out = items;
			}

			return out;
		};
	});

}());
