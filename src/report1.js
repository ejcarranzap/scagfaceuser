module.exports.report1 = {
	encoding: require('encoding'),
	jasper: require('node-jasper')({
		path: '../../jasperreports-5.6.0',
		reports: {
			hw: {
				jasper: '../zrpts/MyReports/scafactura.jasper',
				jrxml: '../zrpts/MyReports/scafactura.jrxml',
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
		path: '/server/main/report1',
		config: {
			auth: false,
			handler: function (request, reply) {
				try {
					var res = request.payload.data;
					console.log(res);
					var report = {
						report: 'hw',
						data: res
					};


					module.exports.report1.jasper.reports.hw.jasper =
						module.exports.mssqlcn.config.JASPER.rptpath + module.exports.mssqlcn.config.REPORTS[res.action] + '.jasper';
					module.exports.report1.jasper.reports.hw.jrxml =
						module.exports.mssqlcn.config.JASPER.rptpath + module.exports.mssqlcn.config.REPORTS[res.action] + '.jrxml';
					var pdf = module.exports.report1.jasper.pdf(report);

					reply(pdf).header('Content-Type', 'application/pdf').header('Cache-Control', 'no-cache');
				} catch (e) {
					console.log(e.message);
					reply(e.message);
				};
			}
		}
	}
};
