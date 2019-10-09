module.exports.report_tool_new = {
	encoding: require('encoding'),
	config: require('./config/config'),
  myRequest: require('request-promise'),
	http: require('http'),
	m: {
		method: 'POST',
		path: '/server/main/report_tool_new',
		config: {
			auth: false,
			handler: function (request, reply) {
				try {
					var payload = request.payload;
					var filedata = [];
					/*var host = 'http://localhost:51662';*/
					var host = 'http://181.174.81.116:8091/ITXSCA';
					var url = host+'/Report/'+payload.action+'/'+payload.data.alumnoscmb.Codigo;
					/*console.log(url);
					console.log(payload);*/
					module.exports.report_tool_new.http.get(url, function(response){
						response.on('data', function(chunk) {
								filedata.push(chunk);
						});
						response.on('end', function() {
								filedata = Buffer.concat(filedata);
								reply(filedata).header('Content-Type', 'application/pdf').header('Cache-Control', 'no-cache');
						});
					});
				} catch (e) {
					console.log(e.message);
					reply(e.message);
				};
			}
		}
	}
};
