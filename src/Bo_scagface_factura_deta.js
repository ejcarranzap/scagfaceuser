module.exports.Bo_scagface_factura_deta = {
   m: {
       method: 'POST',
       path: '/server/main/Bo_scagface_factura_deta',
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
                       params.push({name: 'iddeta', type: module.exports.mssqlcn.mysql.Int, value: data.Id_deta});
                       params.push({name: 'idenca', type: module.exports.mssqlcn.mysql.Int, value: data.Id_enca});
                       params.push({name: 'codigo', type: module.exports.mssqlcn.mysql.Int, value: data.codigo});
                       params.push({name: 'rubro', type: module.exports.mssqlcn.mysql.NVarChar(13), value: data.rubro});
                       params.push({name: 'rubroerp', type: module.exports.mssqlcn.mysql.Int, value: data.rubro_erp});
                       params.push({name: 'carnet', type: module.exports.mssqlcn.mysql.Int, value: data.carnet});
                       params.push({name: 'descripcion', type: module.exports.mssqlcn.mysql.NVarChar(40), value: data.descripcion});
                       params.push({name: 'ivalinea', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.iva_linea});
                       params.push({name: 'subtotallinea', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.subtotal_linea});
                       params.push({name: 'totallinea', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.total_linea});
                       params.push({name: 'afectoiva', type: module.exports.mssqlcn.mysql.Int, value: data.afecto_iva});
                       switch (action) {
                           case 'S':
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_deta', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_deta', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_deta', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_deta', params, function (error, results) {
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