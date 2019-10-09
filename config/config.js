module.exports = {
    TOKEN_SECRET: process.env.TOKEN_SECRET || "secrettoken",
    JASPER: {
        libpath: '../zjavalibs/jasperreports-6.0.0',        
        rptpath: '../zrpts/MyReports/SCAGFACE/',
        driverpath: '../zjavalibs/jtds-1.3.1/jtds-1.3.1.jar',
        driverclass: 'net.sourceforge.jtds.jdbc.Driver',
        drivertype: 'jtds:sqlserver',
        host: '192.168.8.130;databaseName=SCAGFACE',
		port: 1433,
		dbname: '',
		user: 'sa',
		pass: 'sopmac08$$',
	    driver: 'mssql'
    },
    REPORTS: {
        PAGO_TERCERO: 'rpt_pago_tercero',
        PAGO_VISA: 'rpt_visal',
        PAGO_RUBRO: 'rpt_rubro'
    },
    MSSQL_CONFIG: {
        user: 'sa',
        password: 'sopmac08$$',
        server: '192.168.8.130',
        database: 'SCAGFACE',
        connectionTimeout: 600000,
        requestTimeout: 600000,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 60000
        }
    },
    JASPER_CN_CONFIG: {
        host: '192.168.8.130',
        port: 1433,
        dbname: 'SCAGFACE',
        user: 'jaspereport',
        pass: 'sopmac08$$',
        driver: 'mssql'
    },
    VISA_CONFIG: {
        URL: 'http://181.174.81.118:8080/visa/web-visa.php',
        WSDL_URL: 'https://ics2ws.ic3.com/commerce/1.x/transactionProcessor/CyberSourceTransaction_1.110.wsdl',
        MERCHANT_ID: 'visanetgt_montessori',
        MERCHANT_REFERENCE_CODE: 'visanetgt_montessori_acct',
		TRANSACTION_KEY: 'utAXk/0LI9d7ekCtH63JttXpzHS3zO5rl76c1I6eVKA6kkyZLsmDQqWJ0DNkgOx7YKrb8s+jV8Dr6xjnmxEwXSSm3x51QTYpyMkRfJBWvvdZV+Yg8Gh5+nyCzSSv16VHDq+71YNPI3BV6JlQlCP8ip4JmhC9/aw8/rc3YUph3E+zVafPwUH5ZvVSwIF33RRQPvTmbSLMNLpUmfg/C8BT7RpeyS3RMaNTjmv8Fy5C98h+JcGkV5EY/czk240dCxeDqT58L6LA0mvPhr5W4N4A7b9BFNXXW771tiwNYZwqk0KfYZlmTRwyn7Z/vDi4oTzsC3ZEuVZ4cFGel3h9q/kscw==',
	},
    GFACE_CONFIG: {
        Requestor: 'e1bec399-43a8-477e-b14c-b966851ff028',
        Transaction: 'CONVERT_NATIVE_XML',
        Country: 'GT',
        Entity: '4482441',
        User: 'e1bec399-43a8-477e-b14c-b966851ff028',
        UserName: 'RICICA ASTURIAS Y CIA LTDA',
        Data1: '',
        Data2: 'PDF XML',
        Data3: 'XML',
        WSDL_URL: 'https://testgface.efactura.com.gt/mx.com.fact.wsfront/FactWSFront.asmx?wsdl',
				Version: '3',
				Serie: 'CIMV002',
				NumeroAutorizacion: '2017-5-18070-4818',
				FechaResolucion: '2017-02-27',
				RangoInicialAutorizado: 1,
				RangoFinalAutorizado: 3000,
				TipoActivo: 'FACE63',
				CodigoDeMoneda: 'GTQ',
				TipoDeCambio: 1.0000,
				InformacionDeRegimenIsr: 'PAGO_TRIMESTRAL',
				Nit: '4482441',
				NombreComercial: 'COLEGIO INTERNACIONAL MONTESSORI',
				Direccion1: 'KM 13.5',
				Municipio: 'SANTA CATARINA PINULA',
				Departamento: 'Guatemala',
				Idioma: 'es',
				CodigoDeEstablecimiento: 1,
				NombreDeEstablecimiento: 'COLEGIO INTERNACIONAL MONTESSORI',
				DispositivoElectronico: '001'
    },
    PAGOTERCERO:{
      URL: 'http://localhost:49837/WsGyT/Service.asmx?WSDL',
      WEB_METHOD: 'GeneraLlave',
      VALIDACION_DE_PAGO: 1
    },
    FEL: {
        encryptionKey: '+I6BHuI6RzEn7Ac9FhILu7OPaXbrZ2v5+4+FIlXchUc=',
        encryptionIv: 'dBxLH5CGYYkGgsv1es0Zpg=='
    }
};
