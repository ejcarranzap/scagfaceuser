module.exports.mytool = {
	m: {
		method: 'POST',
		path: '/server/main/mytool',
		config: {
			auth: false,
			handler: function (request, reply) {
				try {
					var reg = request.payload;
					var registros, errores, rsdata = [];

					console.log(reg);
					/*console.log(reg.email);
					console.log("mytool");*/

					reply({
						success: true,
						msg: 'Operación exitosa.',
						status: true,
						message: 'Listo',
						data: [],
						total: 0
					});

				} catch (e) {
					console.log(e.message);
				}
			}
		}
	}
};
