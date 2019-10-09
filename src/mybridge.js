module.exports.mybridge = {
	querystring: require('querystring'),
	myRequest: require('request-promise'),
	m: {
		method: 'POST',
		path: '/server/main/mybridge',
		config: {
			auth: false,
			handler: function (request, reply) {
				try {

					var reg = request.payload;
					if (!reg) reg = {};

					var data = reg;
					var registros, errores, rsdata = [];
					var responseText = '';

					data.data.Ruta = data.ruta;
					/*data = module.exports.mybridge.querystring.stringify(data);*/
					
					var options = {
						uri: 'http://localhost:3002'+reg.data.path,
						method: 'POST',
						body: data,
						json: true,
						headers: {
							'Authorization': request.headers.authorization,
							'Content-Type': 'application/json'
						}
					};

					module.exports.mybridge.myRequest(options).then(function (response) {
						var myReply = response;
						myReply.success = true;
						if(myReply.code != 0)
							myReply.success = false;
						
						reply(myReply);
					});

				} catch (e) {
					console.log(e.message);
				}
			}
		}
	}
};
