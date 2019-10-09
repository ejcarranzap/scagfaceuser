module.exports.middleware = {
    jwt: require('jwt-simple'),
    moment: require('moment'),
    config: require('./config/config'),
    ensureAuthenticated: function (req, res) {
        try {
            /*console.log('header');
            console.log(req.headers.authorization);
    
            if(!req.headers.authorization){
                return res({
                    success: false,
                    msg: 'No hay encabezado de autorización.',
                    code: "403"
                });
            }*/
            
            if (req.headers.authorization == 'Basic') {
                return res({
                    success: false,
                    msg: 'Token invalido autenticación Básica no permitida.',
                    code: "403"
                });
            }

            if (!req.headers.authorization) {
                return res({
                    success: false,
                    msg: 'Token invalido no hay encabezado.',
                    code: "403"
                });
            }
            
            
            if (req.headers.authorization.length < 100) { 
                return res({
                    success: false,
                    msg: 'Largo del token invalido.',
                    code: "403"
                });
            }

            var token = req.headers.authorization.split(" ")[1];           
            var payload = module.exports.middleware.jwt.decode(token, module.exports.middleware.config.TOKEN_SECRET);

            if (payload.exp <= module.exports.middleware.moment().unix()) {
                return res({
                    message: {
                        success: false,
                        msg: 'Token invalido',
                        code: "401"
                    }
                });
            }

            return "ok";
        } catch (e) {
            return res({
                success: false,
                msg: 'Token invalido ' + e.message + ' Por favor ingrese credenciales.',
                code: "403"
            });
        }
    }
};
