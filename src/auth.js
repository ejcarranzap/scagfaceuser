module.exports.auth = {
    services: module.exports.services,

    appSignup: function (request, reply) {
        var user = new User({

        });

        user.save(function (err) {
            return reply({
                token: service.createToken(user)
            }).code(200);
        });
    },

    appLogin: function (reply, user, err, msg) {
        /* Comprobar si hay errores
           Si el usuario existe o no
           Y si la contraseña es correcta*/
        try {
            user = user[0];
            var token = module.exports.services.createToken(user);
            return reply({
                token: token,
                Username: user.usuario,
                Password: user.password,
				Ruta: user.ruta,
				Id_device: user.Id_device,
                code: err,
                msg: msg,
                success: true
            }).code(200);

        } catch (e) {
            return reply({
                code: 'ERRAUTH',
                msg: 'ERROR AL GENERAR TOKEN '+e.message,
                success: false
            }).code(200);
        }
    }
};
