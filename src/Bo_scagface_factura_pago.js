module.exports.Bo_scagface_factura_pago = {
   m: {
       method: 'POST',
       path: '/server/main/Bo_scagface_factura_pago',
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
                       params.push({name: 'tipo', type: module.exports.mssqlcn.mysql.NVarChar(1), value: data.tipo});
                       params.push({name: 'ptipo', type: module.exports.mssqlcn.mysql.NVarChar(1), value: data.ptipo});
                       params.push({name: 'banco', type: module.exports.mssqlcn.mysql.NVarChar(3), value: data.banco});
                       params.push({name: 'pbanco', type: module.exports.mssqlcn.mysql.NVarChar(60), value: data.pbanco});
                       params.push({name: 'cuenta', type: module.exports.mssqlcn.mysql.NVarChar(20), value: data.cuenta});
                       params.push({name: 'autorizacion', type: module.exports.mssqlcn.mysql.NVarChar(10), value: data.autorizacion});
                       params.push({name: 'documento', type: module.exports.mssqlcn.mysql.Int, value: data.documento});
                       params.push({name: 'monto', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.monto});
                       params.push({name: 'tasa', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.tasa});
                       params.push({name: 'dolares', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.dolares});
                       params.push({name: 'vuelto', type: module.exports.mssqlcn.mysql.Numeric(19,10), value: data.vuelto});
                       switch (action) {
                           case 'S':
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_pago', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_pago', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_pago', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_factura_pago', params, function (error, results) {
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