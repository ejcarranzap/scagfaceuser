module.exports.report_tool = {
	encoding: require('encoding'),
	config: require('./config/config'),
	jasper: require('node-jasper')({
		path: 'jasperreports-5.6.0',
		reports: {
			hw: {
				jasper: '../../jaspersoft-reports/MyReports/boletagenerica.jasper',
				jrxml: '../../jaspersoft-reports/MyReports/boletagenerica.jrxml',
				conn: 'dbserver1'
			}
		},
		drivers: {
			mssql: {
				path: './jasperjtds/jtds-1.3.1.jar',
				class: 'net.sourceforge.jtds.jdbc.Driver',
				type: 'jtds:sqlserver'
			}
		},
		conns: {
			dbserver1: module.exports.mssqlcn.config.JASPER_CN_CONFIG
		},
		defaultConn: 'dbserver1'
	}),
	m: {
		method: 'POST',
		path: '/server/main/report_tool',
		config: {
			auth: false,
			handler: function (request, reply) {
				try {
					var res = request.payload.data;

					var report = {
						report: 'hw',
						data: {
							Id_enca: parseInt(res.Id_enca)
						}
					};
					var pdf = module.exports.report_tool.jasper.pdf(report);
					reply(pdf).header('Content-Type', 'application/pdf').header('Cache-Control', 'no-cache');
				} catch (e) {
					reply(e.message);
				};
			}
		}
	}
};
