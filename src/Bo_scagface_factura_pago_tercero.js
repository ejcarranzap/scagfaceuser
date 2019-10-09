module.exports.Bo_scagface_factura_pago_tercero = {
   m: {
       method: 'POST',
       path: '/server/main/Bo_scagface_factura_pago_tercero',
       config: {
               auth: false,
               handler: function (request, reply) {
                   try {
                       var reg = request.payload;
                       var data = reg.data;
                       var registros, errores, rsdata = [];
                       
                       var action = '';
                       switch(reg.action){
                           case undefined: action = 'S'; break;
                           case '': action = 'S'; break;
                           case 'insert': action = 'I'; break;
                           case 'update': action = 'U'; break;
                           case 'delete': action = 'D'; break;
                       };
                       var params = [];
                       params.push({name: 'ACTION', type: module.exports.mssqlcn.mysql.NVarChar(20), value: action});
                       params.push({name: 'idpagotercero', type: module.exports.mssqlcn.mysql.Int, value: data.Id_pago_tercero});
                       params.push({name: 'idenca', type: module.exports.mssqlcn.mysql.Int, value: data.Id_enca});
                       params.push({name: 'llave', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.LLAVE});
                       params.push({name: 'codigoagencia', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.CODIGO_AGENCIA});
                       params.push({name: 'terminal', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.TERMINAL});
                       params.push({name: 'usuario', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.USUARIO});
                       params.push({name: 'fechapago', type: module.exports.mssqlcn.mysql.DateTime, value: data.FECHA_PAGO});
                       params.push({name: 'horapago', type: module.exports.mssqlcn.mysql.NVarChar(8), value: data.HORA_PAGO});
                       params.push({name: 'fechamaxrecepcion', type: module.exports.mssqlcn.mysql.DateTime, value: data.FECHA_MAX_RECEPCION});
                       params.push({name: 'validacion', type: module.exports.mssqlcn.mysql.Int, value: data.VALIDACION});
                       params.push({name: 'montopago', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.MONTO_PAGO});
                       params.push({name: 'montopagado', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.MONTO_PAGADO});
                       params.push({name: 'autorizacionbco', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.AUTORIZACION_BCO});
                       params.push({name: 'autorizaciontercero', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.AUTORIZACION_TERCERO});
                       params.push({name: 'pagoreversion', type: module.exports.mssqlcn.mysql.NVarChar(10), value: data.PAGO_REVERSION});
                       params.push({name: 'codigorespuesta', type: module.exports.mssqlcn.mysql.NVarChar(3), value: data.CODIGO_RESPUESTA});
                       params.push({name: 'descripcionrespuesta', type: module.exports.mssqlcn.mysql.NVarChar(50), value: data.DESCRIPCION_RESPUESTA});
                       params.push({name: 'banco', type: module.exports.mssqlcn.mysql.NVarChar(10), value: data.BANCO});
                       params.push({name: 'fecha', type: module.exports.mssqlcn.mysql.DateTime, value: data.fecha});
                       params.push({name: 'usuariomod', type: module.exports.mssqlcn.mysql.NVarChar(20), value: data.usuario_mod});
                       params.push({name: 'activo', type: module.exports.mssqlcn.mysql.Int, value: data.activo});
                       switch (action) {
                           case 'S':
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_pago_tercero', params, function (error, results) {
                                   if (error) {
                                       console.log(error);
                                   } else {
                                   /*else
                                       console.log(results);*/
                                       reply({
                                           success: true,
                                           msg: 'Operación exitosa.',
                                           data: results[0],
                                           total: 0
                                       });
                                   }
                               });
                           break;
                           case 'I':
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_pago_tercero', params, function (error, results) {
                                   if (error) {
                                       console.log(error);
                                   } else {
                                   /*else
                                       console.log(results);*/
                                       reply({
                                           success: true,
                                           msg: 'Operación exitosa.',
                                           data: results[0],
                                           total: 0
                                       });
                                   }
                               });
                           break;
                           case 'U':
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_pago_tercero', params, function (error, results) {
                                   if (error) {
                                       console.log(error);
                                   } else {
                                   /*else
                                       console.log(results);*/
                                       reply({
                                           success: true,
                                           msg: 'Operación exitosa.',
                                           data: results[0],
                                           total: 0
                                       });
                                   }
                               });
                           break;
                           case 'D':
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_pago_tercero', params, function (error, results) {
                                   if (error) {
                                       console.log(error);
                                   } else {
                                   /*else
                                       console.log(results);*/
                                       reply({
                                           success: true,
                                           msg: 'Operación exitosa.',
                                           data: results[0],
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
};