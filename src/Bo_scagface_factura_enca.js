module.exports.Bo_scagface_factura_enca = {
   m: {
       method: 'POST',
       path: '/server/main/Bo_scagface_factura_enca',
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
                       params.push({name: 'idenca', type: module.exports.mssqlcn.mysql.Int, value: data.Id_enca});
                       params.push({name: 'cuenta', type: module.exports.mssqlcn.mysql.Int, value: data.cuenta});
                       params.push({name: 'numeroautorizacion', type: module.exports.mssqlcn.mysql.NVarChar(100), value: data.numero_autorizacion});
                       params.push({name: 'fecharesolucion', type: module.exports.mssqlcn.mysql.DateTime, value: data.fecha_resolucion});
                       params.push({name: 'rangoinicioresolucion', type: module.exports.mssqlcn.mysql.Int, value: data.rango_inicio_resolucion});
                       params.push({name: 'rangofinresolucion', type: module.exports.mssqlcn.mysql.Int, value: data.rango_fin_resolucion});
                       params.push({name: 'moneda', type: module.exports.mssqlcn.mysql.NVarChar(3), value: data.moneda});
                       params.push({name: 'cambio', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.cambio});
                       params.push({name: 'regimen', type: module.exports.mssqlcn.mysql.NVarChar(255), value: data.regimen});
                       params.push({name: 'fechafactura', type: module.exports.mssqlcn.mysql.DateTime, value: data.fecha_factura});
                       params.push({name: 'correlativofactura', type: module.exports.mssqlcn.mysql.NVarChar(150), value: data.correlativo_factura});
                       params.push({name: 'seriefactura', type: module.exports.mssqlcn.mysql.NVarChar(20), value: data.serie_factura});
                       params.push({name: 'nombrefactura', type: module.exports.mssqlcn.mysql.NVarChar(150), value: data.nombre_factura});
                       params.push({name: 'direccionfactura', type: module.exports.mssqlcn.mysql.NVarChar(255), value: data.direccion_factura});
                       params.push({name: 'nitfactura', type: module.exports.mssqlcn.mysql.NVarChar(20), value: data.nit_factura});
                       params.push({name: 'iva', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.iva});
                       params.push({name: 'subtotal', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.subtotal});
                       params.push({name: 'total', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.total});
                       params.push({name: 'pagado', type: module.exports.mssqlcn.mysql.Int, value: data.pagado});
                       params.push({name: 'enviado', type: module.exports.mssqlcn.mysql.Int, value: data.enviado});
                       params.push({name: 'enviaremail', type: module.exports.mssqlcn.mysql.Int, value: data.enviar_email});
                       params.push({name: 'fecha', type: module.exports.mssqlcn.mysql.DateTime, value: data.fecha});
                       params.push({name: 'usuario', type: module.exports.mssqlcn.mysql.NVarChar(20), value: data.usuario});
                       params.push({name: 'activo', type: module.exports.mssqlcn.mysql.Int, value: data.activo});
                       params.push({name: 'recibototal', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.recibo_total});
                       params.push({name: 'recibonumero', type: module.exports.mssqlcn.mysql.Int, value: data.recibo_numero});
                       params.push({name: 'reciboserie', type: module.exports.mssqlcn.mysql.NVarChar(100), value: data.recibo_serie});
                       params.push({name: 'facturatotal', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.factura_total});
                       params.push({name: 'facturanumero', type: module.exports.mssqlcn.mysql.Int, value: data.factura_numero});
                       params.push({name: 'facturaserie', type: module.exports.mssqlcn.mysql.NVarChar(100), value: data.factura_serie});
                       params.push({name: 'documentoguid', type: module.exports.mssqlcn.mysql.NVarChar(200), value: data.documento_guid});
                       params.push({name: 'requestidvisa', type: module.exports.mssqlcn.mysql.NVarChar(200), value: data.request_id_visa});
                       switch (action) {
                           case 'S':
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_enca', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_enca', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_enca', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_enca', params, function (error, results) {
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