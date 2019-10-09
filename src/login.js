module.exports.login = {
	appLogin: {
		method: 'POST',
		path: '/server/main/login',
		config: {
			auth: false,
			handler: function (request, reply) {
				try {
					var reg = request.payload;
					var registros, errores, rsdata = [];

					var b = new Buffer(reg.Password, 'base64');
					var s = b.toString();
					reg.Password = s;
					console.log(reg);

					var params = [];
					params.push({
						name: 'ACTION',
						type: module.exports.mssqlcn.mysql.NVarChar(30),
						value: 'S'
					});
					params.push({
						name: 'RUTA',
						type: module.exports.mssqlcn.mysql.NVarChar(30),
						value: reg.Ruta
					});
					params.push({
						name: 'IDUSUARIO',
						type: module.exports.mssqlcn.mysql.Int,
						value: null
					});
					params.push({
						name: 'USUARIO',
						type: module.exports.mssqlcn.mysql.NVarChar(20),
						value: reg.Usuario
					});
					params.push({
						name: 'PASSWORD',
						type: module.exports.mssqlcn.mysql.NVarChar(255),
						value: reg.Password
					});

					module.exports.mssqlcn.query(0, request, reply, 'epsilon_spc_UsuarioPadre', params, function (error, results) {
						if (error) {
							console.log(error);
						} else {
							if (results.length > 0) {
								module.exports.auth.appLogin(reply, results[0], '0', 'Operación exitosa');
							} else {
								reply({
									success: false,
									msg: 'Error usuario/password invalido.',
									data: results[0],
									total: 0
								});
							}
						}
					});
					/*console.log(reg);

					module.exports.mysqlcn.query(0, request, reply, 'SELECT * FROM seg_usuario WHERE usuario = ? AND password = ?', [reg.Usuario, reg.Password], function (error, results) {
                        if (error) {
                            console.log(error);
                        } else {
                            if (results.length > 0) {
                                module.exports.auth.appLogin(reply, results, '0', 'Operación exitosa');
                            } else {
                                reply({
                                    success: false,
                                    msg: 'Error usuario/password invalido.',
                                    total: 0
                                });
                            }
                        }
                    });*/

				} catch (e) {
					console.log(e.message);
					reply({
						code: -1,
						msg: e.message,
						success: false
					});
				}
			}
		}
	}
};
