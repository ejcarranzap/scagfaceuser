module.exports.mssqlcn = {
	mysql: require('mssql'),
	config: require('./config/config'),
	middleware: module.exports.middleware,

	query: function (isMiddleware, request, reply, sqlquery, params, fn, order, extraparam, orderb, extraparamb) {
		try {
			if (isMiddleware == 1) {
				if (module.exports.middleware.ensureAuthenticated(request, reply) != "ok") {
					fn({
						success: false,
						code: 999,
						message: 'Error de autenticación.'
					}, null);
					return;
				}
			}

			var cn = new module.exports.mssqlcn.mysql.Connection(module.exports.mssqlcn.config.MSSQL_CONFIG);
			cn.connect().then(function () {
				var request = new module.exports.mssqlcn.mysql.Request(cn);

				for (var i = 0; i < params.length; i++) {
					var param = params[i];

					if ((module.exports.mssqlcn.mysql.DateTime == param.type) && (param.value != null) && (param.value != undefined)) {
						param.value = param.value.replace(/\//gi, '-');
						request.input(param.name, module.exports.mssqlcn.mysql.NVarChar(50), param.value);
					} else {
						request.input(param.name, param.type, param.value);
					}
				}

				request.execute(sqlquery, function (err, recordsets, returnValue) {

					if (err) {
						reply({
							success: false,
							msg: err.message,
							code: err.code
						});
						console.log("Sql Error: ");
						console.log(err);
						fn(err, null, order, extraparam, orderb, extraparamb);
					} else {
						fn(err, recordsets, order, extraparam, orderb, extraparamb);
					}

					cn.close();
				});

			}).catch(function (err) {
				console.log("Sql Error2: ");
				console.log(err);
				reply({
					success: false,
					msg: "mssql: " + err.message,
					code: err.code
				});
				fn(err, null, order, extraparam, orderb, extraparamb);
			});
		} catch (e) {
			console.log(e.message);
		}
	},
	queryTransaction: function (isMiddleware, request, reply, sqlquery, params, fn, order, extraparam, orderb, extraparamb) {
		try {
			if (isMiddleware == 1) {
				if (module.exports.middleware.ensureAuthenticated(request, reply) != "ok") {
					fn({
						success: false,
						code: 999,
						message: 'Error de autenticación.'
					}, null);
					return;
				}
			}

			var cn = new module.exports.mssqlcn.mysql.Transaction(module.exports.mssqlcn.config.MSSQL_CONFIG);
			/*BEGIN TRANSACTION*/
			cn.begin(function (err) {
				var rolledBack = false;

				cn.on('rollback', function (aborted) {
					rolledBack = true;
				});

				var request = new module.exports.mssqlcn.mysql.Request(cn);

				for (var i = 0; i < params.length; i++) {
					var param = params[i];

					if ((module.exports.mssqlcn.mysql.DateTime == param.type) && (param.value != null) && (param.value != undefined)) {
						param.value = param.value.replace(/\//gi, '-');
						request.input(param.name, module.exports.mssqlcn.mysql.NVarChar(50), param.value);
					} else {
						request.input(param.name, param.type, param.value);
					}
				}


				request.execute(sqlquery, function (err, recordsets, returnValue) {

					if (err) {
						if (!rolledBack) {
							cn.rollback(function (err) {
								console.log(err);
							});
						}


						reply({
							success: false,
							msg: err.message,
							code: err.code
						});
						console.log("Sql Error: ");
						console.log(err);
						fn(err, null, order, extraparam, orderb, extraparamb);
					} else {
						cn.commit(function (err, recordset) {
							console.log("Transaction committed.");
						});

						fn(err, recordsets, order, extraparam, orderb, extraparamb);
					}

					cn.close();
				});

			});
			/*END TRANSACTION*/

		} catch (e) {
			console.log(e.message);
		}
	}
};
