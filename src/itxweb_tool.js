module.exports.itxweb_tool = {
   m: {
       method: 'POST',
       path: '/server/main/itxweb_tool',
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
						   case 'getrubro': action = 'getrubro'; break;
							   
						   case 'getcuenta': action = 'getcuenta'; break;
						   case 'getpago': action = 'getcuenta'; break;
							   
						   case 'getalumno': action = 'getalumno'; break;
						   case 'getcargo': action = 'getcargo'; break;
						   case 'getforma': action = 'getforma'; break;
						   case 'getbanco': action = 'getbanco'; break;						  
                       };
                       var params = [];
                       params.push({name: 'ACTION', type: module.exports.mssqlcn.mysql.NVarChar(20), value: action});
                       params.push({name: 'CATALOG', type: module.exports.mssqlcn.mysql.NVarChar(30), value: data.catalog});
					   params.push({name: 'CODIGO', type: module.exports.mssqlcn.mysql.NVarChar(30), value: data.codigo});
					   params.push({name: 'IDFACTURA', type: module.exports.mssqlcn.mysql.Int, value: data.Id_enca});
                       
                       switch (action) {
                           case 'getrubro':
                               module.exports.mssqlcn.query(1, request, reply, 'scagface_tool', params, function (error, results) {
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
						   case 'getcuenta':
                               module.exports.mssqlcn.query(1, request, reply, 'scagface_tool', params, function (error, results) {
                                   if (error) {
                                       console.log(error);
                                   } else {
                                   /*else
                                       console.log(results);*/
                                       var ip = '';
                                       if(results)
                                        if(results[0]){
                                            ip = request.headers['x-real-ip'] || request.info.remoteAddress;
                                            for(var i = 0; i < results[0].length; i++){
                                                results[0][i].ip = ip;
                                            } 
                                        }


                                       reply({
                                           success: true,
                                           msg: 'Operación exitosa.',
                                           data: results[0],
                                           total: 0
                                       });
                                   }
                               });
                           break;
						   case 'getalumno':
                               module.exports.mssqlcn.query(1, request, reply, 'scagface_tool', params, function (error, results) {
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
						   case 'getcargo':
                               module.exports.mssqlcn.query(1, request, reply, 'scagface_tool', params, function (error, results) {
                                   if (error) {
                                       console.log(error);
                                   } else {
                                   /*else*/
                                       console.log(results);
                                       reply({
                                           success: true,
                                           msg: 'Operación exitosa.',
                                           data: results[0],
                                           total: 0
                                       });
                                   }
                               });
                           break;
						   case 'getforma':
                               module.exports.mssqlcn.query(1, request, reply, 'scagface_tool', params, function (error, results) {
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
						   case 'getbanco':
                               module.exports.mssqlcn.query(1, request, reply, 'scagface_tool', params, function (error, results) {
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
						   default:
							   reply({
                                	success: false,
                                	msg: 'No se encontro el servicio.',
                                	data: results[0],
                                	total: 0
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