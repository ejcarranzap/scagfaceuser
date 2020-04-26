module.exports.Bo_scagface_factura_tool = {
    config: require('./config/config'),
    m: {
        method: 'POST',
        path: '/server/main/Bo_scagface_factura_tool',
        config: {
            auth: false,
            handler: function (request, reply) {
                try {
                    var reg = request.payload;
                    var data = reg.data;

                    var action = '';
                    switch (reg.action) {
                        case 'INSERTFACTURA':
                            action = 'INSERTFACTURA';
                            break;
                        case 'INSERTFACTURAFEL':
                            action = 'INSERTFACTURAFEL';
                            break;
                    };

                    switch (action) {
                        case 'INSERTFACTURAFEL':
                            var calls = [],
                                params = [];
                            params = [];
                            calls.push({
                                params: params.slice(0),
                                query: 'sp_scagface_get_xml_fel_all',
                                state: 1,
                                type: 'sql'
                            });

                            module.exports.mssqlcnsync.transaction(1, request, reply, calls, function (error, result) {
                                console.log('TRANSACTION END...');
                                if (error) {
                                    reply({
                                        success: false,
                                        code: error.code,
                                        msg: 'CODE: ' + error.code + ' MSG: ' + error.message + ' PROC: ' + error.procName + ' SERVER: ' + error.serverName,
                                        data: [],
                                        total: 0
                                    });
                                } else {
                                    reply({
                                        success: true,
                                        msg: 'Operación exitosa.',
                                        data: result,
                                        total: 0
                                    });
                                }
                            });
                            break;
                        case 'INSERTFACTURA':
                            var extradata = data.extradata;
                            var extrapago = data.extrapago;
                            var calls = [],
                                deta = [],
                                params = [],
                                detparams = [],
                                row = {};

                            params = [];
                            params.push({
                                name: 'ACTION',
                                type: module.exports.mssqlcn.mysql.NVarChar(20),
                                value: 'I'
                            });
                            params.push({
                                name: 'idenca',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.Id_enca
                            });
                            params.push({
                                name: 'cuenta',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.cuenta
                            });
                            params.push({
                                name: 'numeroautorizacion',
                                type: module.exports.mssqlcn.mysql.NVarChar(100),
                                value: data.numero_autorizacion
                            });
                            params.push({
                                name: 'fecharesolucion',
                                type: module.exports.mssqlcn.mysql.DateTime,
                                value: data.fecha_resolucion
                            });
                            params.push({
                                name: 'rangoinicioresolucion',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.rango_inicio_resolucion
                            });
                            params.push({
                                name: 'rangofinresolucion',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.rango_fin_resolucion
                            });
                            params.push({
                                name: 'moneda',
                                type: module.exports.mssqlcn.mysql.NVarChar(3),
                                value: data.moneda
                            });
                            params.push({
                                name: 'cambio',
                                type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                value: data.cambio
                            });
                            params.push({
                                name: 'regimen',
                                type: module.exports.mssqlcn.mysql.NVarChar(255),
                                value: data.regimen
                            });
                            params.push({
                                name: 'fechafactura',
                                type: module.exports.mssqlcn.mysql.DateTime,
                                value: data.fecha_factura
                            });
                            params.push({
                                name: 'correlativofactura',
                                type: module.exports.mssqlcn.mysql.NVarChar(150),
                                value: data.correlativo_factura
                            });
                            params.push({
                                name: 'seriefactura',
                                type: module.exports.mssqlcn.mysql.NVarChar(20),
                                value: data.serie_factura
                            });
                            params.push({
                                name: 'nombrefactura',
                                type: module.exports.mssqlcn.mysql.NVarChar(150),
                                value: data.nombre_factura
                            });
                            params.push({
                                name: 'direccionfactura',
                                type: module.exports.mssqlcn.mysql.NVarChar(255),
                                value: data.direccion_factura
                            });
                            params.push({
                                name: 'nitfactura',
                                type: module.exports.mssqlcn.mysql.NVarChar(20),
                                value: data.nit_factura
                            });
                            params.push({
                                name: 'iva',
                                type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                value: data.iva
                            });
                            params.push({
                                name: 'subtotal',
                                type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                value: data.subtotal
                            });
                            params.push({
                                name: 'total',
                                type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                value: data.total
                            });
                            params.push({
                                name: 'pagado',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.pagado
                            });
                            params.push({
                                name: 'enviado',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.enviado
                            });
                            params.push({
                                name: 'enviaremail',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.enviar_email
                            });
                            params.push({
                                name: 'fecha',
                                type: module.exports.mssqlcn.mysql.DateTime,
                                value: reg.fecha
                            });
                            params.push({
                                name: 'usuario',
                                type: module.exports.mssqlcn.mysql.NVarChar(20),
                                value: reg.usuario
                            });
                            params.push({
                                name: 'activo',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.activo
                            });

                            params.push({
                                name: 'recibototal',
                                type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                value: data.recibo_total
                            });
                            params.push({
                                name: 'recibonumero',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.recibo_numero
                            });
                            params.push({
                                name: 'reciboserie',
                                type: module.exports.mssqlcn.mysql.NVarChar(100),
                                value: data.recibo_serie
                            });
                            params.push({
                                name: 'facturatotal',
                                type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                value: data.factura_total
                            });
                            params.push({
                                name: 'facturanumero',
                                type: module.exports.mssqlcn.mysql.Int,
                                value: data.factura_numero
                            });
                            params.push({
                                name: 'facturaserie',
                                type: module.exports.mssqlcn.mysql.NVarChar(100),
                                value: data.factura_serie
                            });
                            params.push({
                                name: 'documentoguid',
                                type: module.exports.mssqlcn.mysql.NVarChar(200),
                                value: data.documento_guid
                            });
                            params.push({
                                name: 'requestidvisa',
                                type: module.exports.mssqlcn.mysql.NVarChar(200),
                                value: data.request_id_visa
                            });
                            params.push({
                                name: 'fechavencimiento',
                                type: module.exports.mssqlcn.mysql.DateTime,
                                value: reg.fecha_vencimiento
                            });
                            params.push({
                                name: 'llavebanco',
                                type: module.exports.mssqlcn.mysql.NVarChar(50),
                                value: data.llave_banco
                            });

                            deta = [];
                            for (var i = 0; i < extradata.length; i++) {
                                row = extradata[i];

                                detparams = [];
                                detparams.push({
                                    name: 'ACTION',
                                    type: module.exports.mssqlcn.mysql.NVarChar(20),
                                    value: 'I'
                                });
                                detparams.push({
                                    name: 'iddeta',
                                    type: module.exports.mssqlcn.mysql.Int,
                                    value: 0
                                });
                                detparams.push({
                                    name: 'idenca',
                                    type: module.exports.mssqlcn.mysql.Int,
                                    value: 0
                                });
                                detparams.push({
                                    name: 'codigo',
                                    type: module.exports.mssqlcn.mysql.Int,
                                    value: row.Codigo
                                });
                                detparams.push({
                                    name: 'rubro',
                                    type: module.exports.mssqlcn.mysql.NVarChar(13),
                                    value: row.Codigo
                                });
                                detparams.push({
                                    name: 'carnet',
                                    type: module.exports.mssqlcn.mysql.NVarChar(13),
                                    value: row.Carnet
                                });
                                detparams.push({
                                    name: 'descripcion',
                                    type: module.exports.mssqlcn.mysql.NVarChar(40),
                                    value: ''
                                });
                                detparams.push({
                                    name: 'ivalinea',
                                    type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                    value: row.iva_linea
                                });
                                detparams.push({
                                    name: 'subtotallinea',
                                    type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                    value: row.subtotal_linea
                                });
                                detparams.push({
                                    name: 'totallinea',
                                    type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                    value: row.Saldo
                                });
                                detparams.push({
                                    name: 'afectoiva',
                                    type: module.exports.mssqlcn.mysql.Int,
                                    value: row.afecto_iva
                                });

                                deta.push({
                                    params: detparams.slice(0),
                                    query: 'spc_scagface_factura_deta_mod',
                                    state: 1
                                });
                            }


                            for (var i = 0; i < extrapago.length; i++) {
                                row = extrapago[i];

                                detparams = [];
                                detparams.push({
                                    name: 'ACTION',
                                    type: module.exports.mssqlcn.mysql.NVarChar(20),
                                    value: 'I'
                                });
                                detparams.push({
                                    name: 'iddeta',
                                    type: module.exports.mssqlcn.mysql.Int,
                                    value: 0
                                });
                                detparams.push({
                                    name: 'idenca',
                                    type: module.exports.mssqlcn.mysql.Int,
                                    value: 0
                                });
                                detparams.push({
                                    name: 'tipo',
                                    type: module.exports.mssqlcn.mysql.NVarChar(1),
                                    value: row.tipo
                                });
                                detparams.push({
                                    name: 'ptipo',
                                    type: module.exports.mssqlcn.mysql.NVarChar(1),
                                    value: row.ptipo
                                });
                                detparams.push({
                                    name: 'banco',
                                    type: module.exports.mssqlcn.mysql.NVarChar(3),
                                    value: row.banco
                                });
                                detparams.push({
                                    name: 'pbanco',
                                    type: module.exports.mssqlcn.mysql.NVarChar(60),
                                    value: row.pbanco
                                });
                                detparams.push({
                                    name: 'cuenta',
                                    type: module.exports.mssqlcn.mysql.NVarChar(20),
                                    value: row.cuenta
                                });
                                detparams.push({
                                    name: 'autorizacion',
                                    type: module.exports.mssqlcn.mysql.NVarChar(10),
                                    value: row.autorizacion
                                });
                                detparams.push({
                                    name: 'documento',
                                    type: module.exports.mssqlcn.mysql.Int,
                                    value: row.documento
                                });
                                detparams.push({
                                    name: 'monto',
                                    type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                    value: row.monto
                                });
                                detparams.push({
                                    name: 'tasa',
                                    type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                    value: row.tasa
                                });
                                detparams.push({
                                    name: 'dolares',
                                    type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                    value: row.dolares
                                });
                                detparams.push({
                                    name: 'vuelto',
                                    type: module.exports.mssqlcn.mysql.Numeric(19, 10),
                                    value: row.vuelto
                                });

                                deta.push({
                                    params: detparams.slice(0),
                                    query: 'spc_scagface_factura_pago',
                                    state: 1
                                });
                            }

                            /*CALL FACTURA GENERA CORRELATIVO*/
                            if (data.activo == 3) {

                            } else {
                                detparams = [];
                                detparams.push({
                                    name: 'idenca',
                                    type: module.exports.mssqlcn.mysql.Int,
                                    value: 0
                                });

                                deta.push({
                                    params: detparams.slice(0),
                                    query: 'sp_scagface_asigna_correlativo_factura',
                                    state: 1
                                });
                            }

                            /*CALL FACTURA*/
                            calls.push({
                                params: params.slice(0),
                                query: 'spc_scagface_factura_enca',
                                state: 1,
                                Identity: 'Id_enca',
                                IdentityParamName: 'idenca',
                                deta: deta,
                                type: 'sql'
                            });

                            var reqdata = {
                                data: data,
                                extra: {
                                    PvalidationType: module.exports.test.config.PAGOTERCERO.VALIDACION_DE_PAGO,
                                    PID: null,
                                    Pfecha: reg.data.pfecha.replace('"', '').replace('"', ''),
                                    Pmonto: reg.data.total
                                }
                            };

                            if (data.activo == 3) {
                                calls.push({
                                    params: {
                                        uri: module.exports.test.config.PAGOTERCERO.URL,
                                        webmethod: module.exports.test.config.PAGOTERCERO.WEB_METHOD,
                                        method: 'POST',
                                        body: reqdata,
                                        json: true,
                                        headers: {
                                            'Authorization': request.headers.authorization,
                                            'Content-Type': 'application/json'
                                        }
                                    },
                                    type: 'soap'
                                });

                                /*ACTUALIZA LLAVE DE BANCO EN EL ENCABEZADO*/
                                params = [];
                                params.push({
                                    name: 'ACTION',
                                    type: module.exports.mssqlcn.mysql.NVarChar(20),
                                    value: 'U'
                                });
                                params.push({
                                    name: 'idenca',
                                    type: module.exports.mssqlcn.mysql.Int,
                                    value: null
                                });
                                params.push({
                                    name: 'llavebanco',
                                    type: module.exports.mssqlcn.mysql.NVarChar(50),
                                    value: null
                                });

                                calls.push({
                                    params: params.slice(0),
                                    query: 'spc_scagface_factura_enca_llave_banco',
                                    state: 1,
                                    Identity: 'Id_enca',
                                    IdentityParamName: 'idenca',
                                    Identity2: 'llave_banco',
                                    IdentityParamName2: 'llavebanco',
                                    deta: [],
                                    type: 'sql'
                                });
                                /*END ACTUALIZA LLAVE DE BANCO EN EL ENCABEZADO*/
                            } else {

                                var reqdata2 = {
                                    data: module.exports.test.config.VISA_CONFIG,
                                    extra: data
                                };

                                calls.push({
                                    params: {
                                        uri: module.exports.test.config.VISA_CONFIG.URL,
                                        method: 'POST',
                                        body: reqdata2,
                                        json: true,
                                        headers: {
                                            'Authorization': request.headers.authorization,
                                            'Content-Type': 'application/json'
                                        }
                                    },
                                    type: 'http'
                                });

                            }

                            module.exports.mssqlcnsync.transaction(1, request, reply, calls, function (error, result) {
                                console.log('TRANSACTION END...');
                                if (error) {
                                    reply({
                                        success: false,
                                        code: error.code,
                                        msg: 'CODE: ' + error.code + ' MSG: ' + error.message + ' PROC: ' + error.procName + ' SERVER: ' + error.serverName,
                                        data: [],
                                        total: 0
                                    });
                                } else {
                                    reply({
                                        success: true,
                                        msg: 'Operación exitosa.',
                                        data: result,
                                        total: 0
                                    });
                                }
                            });

                            break;
                    }
                } catch (e) {
                    console.log(e.message);
                }
            }
        }
    }
}
