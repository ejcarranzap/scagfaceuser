module.exports.Bo_pagotercero_tool = {
    config: require('./config/config'),
    m: {
        method: 'POST',
        path: '/server/main/Bo_pagotercero_tool',
        config: {
            auth: false,
            handler: function(request, reply) {
              try {
                  var reg = request.payload;

                  var parseString = require('xml2json-light').xml2json;
                  var parseJson = require("js2xmlparser").parse;
                  var xml = reg.XMLIn;

                  /*console.log(xml);*/
                  /*var xml = "<root>Hello xml2js!</root>";*/
                  /*var xml = "<REQPAGOREVERSIONGENERICO>"+
                            "<ID>200</ID>"+
                            "<LLAVE>12210810125404137</LLAVE>"+
                            "<TVALIDACION>1</TVALIDACION>"+
                            "<MONTO_PAGADO>150.00</MONTO_PAGADO>"+
                            "<BANCO>GT</BANCO>"+
                            "<FECHA_PAGO>20/01/2014</FECHA_PAGO>"+
                            "<PAGO_REVERSION>P</PAGO_REVERSION>"+
                            "<HORA_PAGO>13:00:14</HORA_PAGO>"+
                            "<AGENCIA>00000120</AGENCIA>"+
                            "<AUT_BCO>000000000635230</AUT_BCO>"+
                            "<USUARIO>120101 </USUARIO>"+
                            "<TERMINAL>7D02CCC8  </TERMINAL>"+
                            "</REQPAGOREVERSIONGENERICO>";*/
                  var data = parseString(xml).REQPAGOREVERSIONGENERICO;
                  var dat = require('date-and-time');
                  data.FECHA_PAGO = dat.format(dat.parse(data.FECHA_PAGO, 'DD/MM/YYYY'),'YYYY-MM-DD');

                  var extradata = data.extradata;
                  var extrapago = data.extrapago;
                  var calls = [],
                      deta = [],
                      params = [],
                      detparams = [],
                      row = {};

                  var params = [];
                  params.push({name: 'ACTION', type: module.exports.mssqlcn.mysql.NVarChar(20), value: 'I'});
                  params.push({name: 'idpagotercero', type: module.exports.mssqlcn.mysql.Int, value: data.Id_pago_tercero});
                  params.push({name: 'idenca', type: module.exports.mssqlcn.mysql.Int, value: data.ID});
                  params.push({name: 'llave', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.LLAVE});
                  params.push({name: 'codigoagencia', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.AGENCIA});
                  params.push({name: 'terminal', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.TERMINAL});
                  params.push({name: 'usuario', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.USUARIO});
                  params.push({name: 'fechapago', type: module.exports.mssqlcn.mysql.DateTime, value: data.FECHA_PAGO});
                  params.push({name: 'horapago', type: module.exports.mssqlcn.mysql.NVarChar(8), value: data.HORA_PAGO});
                  params.push({name: 'fechamaxrecepcion', type: module.exports.mssqlcn.mysql.DateTime, value: data.FECHA_MAX_RECEPCION});
                  params.push({name: 'validacion', type: module.exports.mssqlcn.mysql.Int, value: data.TVALIDACION});
                  params.push({name: 'montopago', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.MONTO_PAGADO});
                  params.push({name: 'montopagado', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.MONTO_PAGADO});
                  params.push({name: 'autorizacionbco', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.AUT_BCO});
                  params.push({name: 'autorizaciontercero', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.AUTORIZACION_TERCERO});
                  params.push({name: 'pagoreversion', type: module.exports.mssqlcn.mysql.NVarChar(10), value: data.PAGO_REVERSION});
                  params.push({name: 'codigorespuesta', type: module.exports.mssqlcn.mysql.NVarChar(3), value: data.CODIGO_RESPUESTA});
                  params.push({name: 'descripcionrespuesta', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.DESCRIPCION_RESPUESTA});
                  params.push({name: 'banco', type: module.exports.mssqlcn.mysql.NVarChar(10), value: data.BANCO});
                  params.push({name: 'fecha', type: module.exports.mssqlcn.mysql.DateTime, value: data.fecha});
                  params.push({name: 'usuariomod', type: module.exports.mssqlcn.mysql.NVarChar(20), value: data.usuario_mod});
                  params.push({name: 'activo', type: module.exports.mssqlcn.mysql.Int, value: data.activo});

                  calls.push({
                      params: params.slice(0),
                      query: 'spc_scagface_factura_pago_tercero_mod',
                      state: 1,
                      Identity: 'Id_pago_tercero',
                      IdentityParamName: 'idenca',
                      deta: deta,
                      type: 'sql'
                  });

                  module.exports.mssqlcnsync.transaction(1, request, reply, calls, function(error, result) {
                      console.log('TRANSACTION END...');
                      var dataret = {};
                      if (error) {
                          dataret.CODIGO_RESPUESTA = 999;
                          dataret.DESCRIPCION_RESPUESTA = error.message;
                          reply(parseJson('REQPAGOREVERSIONGENERICO',dataret));
                      } else {
                          dataret = result[0][0][0];
                          reply(parseJson('REQPAGOREVERSIONGENERICO',dataret));
                      }
                  });

              }catch(e){
                console.log(e.message);
                reply(e.message);
              }
            }
        }
    }
}
