module.exports.mysqlcn = {
    mysql: require('mysql'),
	config: require('./config/config'),
    middleware: module.exports.middleware,
    query: function (isMiddleware, request, reply, sqlquery, params, fn) {

        if (isMiddleware == 1) {
            if (module.exports.middleware.ensureAuthenticated(request, reply) != "ok") {
                fn({
                    code: 999,
                    message: 'Error de autenticación.'
                }, null);
                return;
            }
        }

        var cn = module.exports.mysqlcn.mysql.createConnection(module.exports.mysqlcn.config.MYSQL_CONFIG);
        cn.connect(function (error) {
            if (error) {
                fn(error, null);
                return res({
                    success: false,
                    msg: error.message,
                    code: error.code
                });
            } else {
                /*console.log('Conexion correcta.');*/
            }
        });

        var query = cn.query(sqlquery, params, function (error, result) {
            try {
                if (error) {
                    fn(error, null);
                    return res({
                        success: false,
                        msg: error.message,
                        code: error.code
                    });
                } else {
                    fn(error, result);
                }
                cn.end();
            } catch (e) {
                cn.end();
                throw e;
            }
        });
    }
};
