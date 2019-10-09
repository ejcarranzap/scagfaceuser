module.exports.test = {
	config: require('./config/config'),
	m: {
		method: 'GET',
		path: '/test',
		config: {
			auth: false,
			handler: function (request, reply) {
				try {
					var reg = request.query;
					var fecha = '2017-02-25 00:00:00';
					var fecha2 = '2018-01-01 23:59:59';
					var calls = [];

					var params = [];
					params.push({
						name: 'ACTION',
						type: module.exports.mssqlcn.mysql.NVarChar(20),
						value: 'I'
					});
					params.push({
						name: 'idenca',
						type: module.exports.mssqlcn.mysql.Int,
						value: 0
					});
					params.push({
						name: 'fecha',
						type: module.exports.mssqlcn.mysql.DateTime,
						value: fecha
					});
					params.push({
						name: 'descripcion',
						type: module.exports.mssqlcn.mysql.NVarChar(20),
						value: 'DESC 1'
					});

					var deta = [];
					var detparams = [];

					detparams.push({
						name: 'ACTION',
						type: module.exports.mssqlcn.mysql.NVarChar(20),
						value: 'I'
					});
					detparams.push({
						name: 'iddeta',
						type: module.exports.mssqlcn.mysql.Int,
						value: 0
					});
					detparams.push({
						name: 'idenca',
						type: module.exports.mssqlcn.mysql.Int,
						value: 0
					});
					detparams.push({
						name: 'codigo',
						type: module.exports.mssqlcn.mysql.NVarChar(20),
						value: 'C0001'
					});
					detparams.push({
						name: 'descripcion',
						type: module.exports.mssqlcn.mysql.NVarChar(255),
						value: 'PRODUCTO 1'
					});
					detparams.push({
						name: 'cantidad',
						type: module.exports.mssqlcn.mysql.Numeric(19, 10),
						value: 10
					});
					detparams.push({
						name: 'precio',
						type: module.exports.mssqlcn.mysql.Numeric(19, 10),
						value: 30.25
					});
					detparams.push({
						name: 'total',
						type: module.exports.mssqlcn.mysql.Numeric(19, 10),
						value: (10 * 30.25)
					});

					deta.push({
						params: detparams.slice(0),
						query: 'spc_test_deta',
						state: 1
					});

					detparams = [];
					detparams.push({
						name: 'ACTION',
						type: module.exports.mssqlcn.mysql.NVarChar(20),
						value: 'I'
					});
					detparams.push({
						name: 'iddeta',
						type: module.exports.mssqlcn.mysql.Int,
						value: 0
					});
					detparams.push({
						name: 'idenca',
						type: module.exports.mssqlcn.mysql.Int,
						value: 0
					});
					detparams.push({
						name: 'codigo',
						type: module.exports.mssqlcn.mysql.NVarChar(20),
						value: 'C0002'
					});
					detparams.push({
						name: 'descripcion',
						type: module.exports.mssqlcn.mysql.NVarChar(255),
						value: 'PRODUCTO 2'
					});
					detparams.push({
						name: 'cantidad',
						type: module.exports.mssqlcn.mysql.Numeric(19, 10),
						value: 5
					});
					detparams.push({
						name: 'precio',
						type: module.exports.mssqlcn.mysql.Numeric(19, 10),
						value: 10.21
					});
					detparams.push({
						name: 'total',
						type: module.exports.mssqlcn.mysql.Numeric(19, 10),
						value: (5 * 10.21)
					});

					deta.push({
						params: detparams.slice(0),
						query: 'spc_test_deta',
						state: 1
					});
					
					calls.push({params: params,query: 'spc_test_enca',state: 1,Identity: 'Id_enca',IdentityParamName: 'idenca',
						deta: deta,
						type: 'sql'
					});

					calls.push({params: [],query: 'test',state: 15,type: 'sql'});

					var reqdata = {data: module.exports.test.config.VISA_CONFIG};
					
					calls.push({params: {
						uri: 'http://site.localhost/visa/web-visa.php',
						method: 'POST',
						body: reqdata,
						json: true,
						headers: {
							'Authorization': request.headers.authorization,
							'Content-Type': 'application/json'
						}
					},type: 'http'});

					module.exports.mssqlcnsync.transaction(1, request, reply, calls, function (error, result) {
						console.log('TRANSACTION END...');
						if (error) {
							reply({
								success: false,
								code: error.code,
								msg: 'ERROR: ' + error.message + ' PROC: ' + error.procName + ' SERVER: ' + error.serverName,
								data: [],
								total: 0
							});
						} else {
							reply({
								success: true,
								msg: 'Operación exitosa.',
								data: [],
								total: 0
							});
						}
					});
				} catch (e) {
					console.log(e.message);
					reply({
						success: false,
						code: -1,
						msg: e.message,
						data: [],
						total: 0
					});
				}
			}
		}
	}
};
