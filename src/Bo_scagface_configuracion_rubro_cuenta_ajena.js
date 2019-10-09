module.exports.Bo_scagface_configuracion_rubro_cuenta_ajena = {
   m: {
       method: 'POST',
       path: '/server/main/Bo_scagface_configuracion_rubro_cuenta_ajena',
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
                       params.push({name: 'idconfiguracion', type: module.exports.mssqlcn.mysql.Int, value: data.Id_configuracion});
                       params.push({name: 'codigo', type: module.exports.mssqlcn.mysql.NVarChar(13), value: data.codigo});
                       params.push({name: 'descripcion', type: module.exports.mssqlcn.mysql.NVarChar(100), value: data.descripcion});
                       params.push({name: 'fecha', type: module.exports.mssqlcn.mysql.DateTime, value: reg.fecha});
                       params.push({name: 'usuario', type: module.exports.mssqlcn.mysql.NVarChar(20), value: reg.usuario});
                       params.push({name: 'activo', type: module.exports.mssqlcn.mysql.Int, value: data.activo});
                       switch (action) {
                           case 'S':
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_configuracion_rubro_cuenta_ajena', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_configuracion_rubro_cuenta_ajena', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_configuracion_rubro_cuenta_ajena', params, function (error, results) {
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
                               module.exports.mssqlcn.query(1, request, reply, 'spc_scagface_configuracion_rubro_cuenta_ajena', params, function (error, results) {
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