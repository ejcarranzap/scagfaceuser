module.exports.services = {
    jwt: require('jwt-simple'),
    moment: require('moment'),
    config: require('./config/config'),
    createToken: function (user) {
        /*console.log('usuario');
        console.log(user);*/
		
        var payload = {
            sub: user.idusuario,
            iat: module.exports.services.moment().unix(),
            exp: module.exports.services.moment().add(14, "days").unix(),
        };
        return module.exports.services.jwt.encode(payload, module.exports.services.config.TOKEN_SECRET);
    }
};
